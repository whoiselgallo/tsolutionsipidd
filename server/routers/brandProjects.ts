import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { brandProjects, brandGenerations, brandAssets } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

const briefingSchema = z.object({
  brandName: z.string().min(1),
  sector: z.string().optional(),
  values: z.string().optional(),
  competitors: z.string().optional(),
  keywords: z.string().optional(),
  description: z.string().optional(),
  primaryColors: z.array(z.string()).optional(),
  secondaryColors: z.array(z.string()).optional(),
  industry: z.string().optional(),
  industryCustom: z.string().optional(),
  typographySuggestions: z.array(z.string()).optional(),
  typographySelected: z.string().optional(),
  targetAge: z.string().optional(),
  targetGender: z.string().optional(),
  targetLocation: z.string().optional(),
  targetIncome: z.string().optional(),
  targetInterests: z.string().optional(),
  targetPain: z.string().optional(),
  geometrySelected: z.array(z.string()).optional(),
  logoStyle: z.string().optional(),
  nameSuggestions: z.array(z.string()).optional(),
  nameSelected: z.string().optional(),
  nameNotes: z.string().optional(),
});

export const brandProjectsRouter = router({
  // ── List user projects ──────────────────────────────────────────────────────
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(brandProjects)
      .where(eq(brandProjects.userId, ctx.user.id))
      .orderBy(desc(brandProjects.updatedAt));
  }),

  // ── Get single project ──────────────────────────────────────────────────────
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db
        .select()
        .from(brandProjects)
        .where(and(eq(brandProjects.id, input.id), eq(brandProjects.userId, ctx.user.id)))
        .limit(1);
      return result[0] ?? null;
    }),

  // ── Create project ──────────────────────────────────────────────────────────
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(brandProjects).values({
        userId: ctx.user.id,
        name: input.name,
        status: "draft",
        currentStep: 0,
      });
      const id = Number((result as any).insertId);
      return { id, name: input.name };
    }),

  // ── Update briefing data ────────────────────────────────────────────────────
  updateBriefing: protectedProcedure
    .input(z.object({
      id: z.number(),
      briefingData: briefingSchema,
      currentStep: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .update(brandProjects)
        .set({
          briefingData: input.briefingData as any,
          currentStep: input.currentStep ?? 0,
          status: "in_progress",
          selectedColors: (input.briefingData.primaryColors ?? []) as any,
          selectedTypography: { selected: input.briefingData.typographySelected } as any,
          selectedGeometry: (input.briefingData.geometrySelected ?? []) as any,
          selectedStyle: input.briefingData.logoStyle ?? null,
        })
        .where(and(eq(brandProjects.id, input.id), eq(brandProjects.userId, ctx.user.id)));
      return { success: true };
    }),

  // ── Save generated results ──────────────────────────────────────────────────
  saveGeneration: protectedProcedure
    .input(z.object({
      id: z.number(),
      generatedConcept: z.string().optional(),
      generatedNaming: z.string().optional(),
      generatedLogoSvg: z.string().optional(),
      generatedMockupUrl: z.string().optional(),
      generatedBrandGuide: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...updates } = input;
      const filteredUpdates: Record<string, unknown> = {};
      if (updates.generatedConcept !== undefined) filteredUpdates.generatedConcept = updates.generatedConcept;
      if (updates.generatedNaming !== undefined) filteredUpdates.generatedNaming = updates.generatedNaming;
      if (updates.generatedLogoSvg !== undefined) filteredUpdates.generatedLogoSvg = updates.generatedLogoSvg;
      if (updates.generatedMockupUrl !== undefined) filteredUpdates.generatedMockupUrl = updates.generatedMockupUrl;
      if (updates.generatedBrandGuide !== undefined) filteredUpdates.generatedBrandGuide = updates.generatedBrandGuide;
      if (Object.keys(filteredUpdates).length > 0) {
        filteredUpdates.status = "completed";
        await db
          .update(brandProjects)
          .set(filteredUpdates as any)
          .where(and(eq(brandProjects.id, id), eq(brandProjects.userId, ctx.user.id)));
      }
      return { success: true };
    }),

  // ── Delete project ──────────────────────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .delete(brandProjects)
        .where(and(eq(brandProjects.id, input.id), eq(brandProjects.userId, ctx.user.id)));
      return { success: true };
    }),

  // ── Get generation history ──────────────────────────────────────────────────
  getHistory: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(brandGenerations)
        .where(and(
          eq(brandGenerations.projectId, input.projectId),
          eq(brandGenerations.userId, ctx.user.id)
        ))
        .orderBy(desc(brandGenerations.createdAt))
        .limit(50);
    }),

  // ── Get assets ──────────────────────────────────────────────────────────────
  getAssets: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(brandAssets)
        .where(and(
          eq(brandAssets.projectId, input.projectId),
          eq(brandAssets.userId, ctx.user.id)
        ))
        .orderBy(desc(brandAssets.createdAt));
    }),
});
