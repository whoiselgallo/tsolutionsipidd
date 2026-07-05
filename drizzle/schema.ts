import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Brand Projects ────────────────────────────────────────────────────────────
export const brandProjects = mysqlTable("brand_projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["draft", "in_progress", "completed"]).default("draft").notNull(),
  briefingData: json("briefingData"),       // Respuestas del formulario multi-paso
  generatedConcept: text("generatedConcept"),
  generatedNaming: text("generatedNaming"),
  generatedLogoSvg: text("generatedLogoSvg"),
  generatedMockupUrl: text("generatedMockupUrl"),
  generatedBrandGuide: json("generatedBrandGuide"),
  selectedColors: json("selectedColors"),
  selectedTypography: json("selectedTypography"),
  selectedGeometry: json("selectedGeometry"),
  selectedStyle: varchar("selectedStyle", { length: 64 }),
  currentStep: int("currentStep").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrandProject = typeof brandProjects.$inferSelect;
export type InsertBrandProject = typeof brandProjects.$inferInsert;

// ─── Brand Generations (historial de generaciones IA) ─────────────────────────
export const brandGenerations = mysqlTable("brand_generations", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  generationType: mysqlEnum("generationType", [
    "concept",
    "naming",
    "logo_svg",
    "mockup",
    "brand_guide",
    "full",
  ]).notNull(),
  prompt: text("prompt"),
  result: text("result"),
  modelUsed: varchar("modelUsed", { length: 128 }),
  tokensUsed: int("tokensUsed"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BrandGeneration = typeof brandGenerations.$inferSelect;
export type InsertBrandGeneration = typeof brandGenerations.$inferInsert;

// ─── Brand Assets (archivos exportados) ───────────────────────────────────────
export const brandAssets = mysqlTable("brand_assets", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  assetType: mysqlEnum("assetType", [
    "logo_svg",
    "logo_png",
    "logo_jpeg",
    "mockup_png",
    "mockup_jpeg",
    "palette_json",
    "typography_json",
    "brand_guide_json",
    "zip_bundle",
  ]).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  storageKey: text("storageKey"),
  storageUrl: text("storageUrl"),
  fileSize: int("fileSize"),
  isDownloaded: boolean("isDownloaded").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BrandAsset = typeof brandAssets.$inferSelect;
export type InsertBrandAsset = typeof brandAssets.$inferInsert;
