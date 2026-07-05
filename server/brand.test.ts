import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

// ─── Mock DB ─────────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    $returningId: vi.fn().mockResolvedValue([{ id: 1 }]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    desc: vi.fn().mockReturnThis(),
  }),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

// ─── Mock LLM ─────────────────────────────────────────────────────────────────
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            concepto: {
              titulo: "Test Brand",
              esencia: "Una marca de prueba",
              personalidad: ["Innovadora", "Confiable"],
            },
            paleta_cromatica: {
              primario: { hex: "#FF6B00", nombre: "Naranja energía", uso: "Principal" },
            },
            naming: { slogan_principal: "Test slogan" },
          }),
        },
      },
    ],
  }),
}));

// ─── Mock Image Generation ────────────────────────────────────────────────────
vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn().mockResolvedValue({ url: "https://example.com/mockup.png" }),
}));

// ─── Mock Storage ─────────────────────────────────────────────────────────────
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "test-key", url: "/manus-storage/test-key" }),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────
function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("Brand Identity API — Router Tests", () => {
  describe("auth.me", () => {
    it("returns null for unauthenticated users", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createUnauthContext());
      const result = await caller.auth.me();
      expect(result).toBeNull();
    });

    it("returns user for authenticated users", async () => {
      const { appRouter } = await import("./routers");
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result).not.toBeNull();
      expect(result?.email).toBe("test@example.com");
    });
  });

  describe("auth.logout", () => {
    it("clears session cookie and returns success", async () => {
      const { appRouter } = await import("./routers");
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();
      expect(result).toEqual({ success: true });
    });
  });

  describe("brandData", () => {
    it("returns color list with required fields", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createUnauthContext());
      const result = await caller.brandData.getColors();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("hex");
      expect(result[0]).toHaveProperty("nombre");
    });

    it("returns typography list with required fields", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createUnauthContext());
      const result = await caller.brandData.getTypography();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("nombre");
      expect(result[0]).toHaveProperty("familia");
    });

    it("returns geometry list with required fields", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createUnauthContext());
      const result = await caller.brandData.getGeometry();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("key");
      expect(result[0]).toHaveProperty("nombre");
    });

    it("returns logo styles list with required fields", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createUnauthContext());
      const result = await caller.brandData.getLogoStyles();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("key");
      expect(result[0]).toHaveProperty("nombre");
    });

    it("returns industries list with required fields", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createUnauthContext());
      const result = await caller.brandData.getIndustries();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("key");
      expect(result[0]).toHaveProperty("nombre");
    });
  });

  describe("brandProjects — authentication guards", () => {
    it("throws UNAUTHORIZED when creating project without auth", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createUnauthContext());
      await expect(caller.brandProjects.create({ name: "Test" })).rejects.toThrow();
    });

    it("throws UNAUTHORIZED when listing projects without auth", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createUnauthContext());
      await expect(caller.brandProjects.list()).rejects.toThrow();
    });
  });

  describe("brandGeneration — authentication guards", () => {
    it("throws UNAUTHORIZED when generating concept without auth", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createUnauthContext());
      const briefing = {
        brandName: "TestBrand",
        sector: "Tech",
        values: [],
        competitors: [],
        primaryColors: ["#FF6B00"],
        secondaryColors: [],
        industry: "Tecnología",
        typographySelected: "Inter",
        targetAge: "25-35",
        targetGender: "Mixto",
        targetIncome: "Medio",
        targetPsychography: "Innovadores",
        geometrySelected: ["circulo"],
        logoStyle: "moderno",
        nameSelected: "TestBrand",
        nameSuggestions: [],
        nameNotes: "",
        additionalInfo: "",
      };
      await expect(
        caller.brandGeneration.generateConcept({ projectId: 1, briefing })
      ).rejects.toThrow();
    });
  });
});
