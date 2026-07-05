import { useState, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { BriefingFormData } from "../../../shared/brandData";
import { EMPTY_BRIEFING } from "../../../shared/brandData";

// Sub-components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ModuleGrid from "@/components/dashboard/ModuleGrid";
import BriefingPanel from "@/components/panels/BriefingPanel";
import ColorsPanel from "@/components/panels/ColorsPanel";
import TypographyPanel from "@/components/panels/TypographyPanel";
import GeometryPanel from "@/components/panels/GeometryPanel";
import NamingPanel from "@/components/panels/NamingPanel";
import StylePanel from "@/components/panels/StylePanel";
import EditorPanel from "@/components/panels/EditorPanel";
import ExportPanel from "@/components/panels/ExportPanel";
import ProjectsPanel from "@/components/panels/ProjectsPanel";
import GenerationProgress from "@/components/dashboard/GenerationProgress";
import LoginOverlay from "@/components/dashboard/LoginOverlay";

export type ActivePanel =
  | "briefing" | "colors" | "typography" | "geometry"
  | "naming" | "style" | "editor" | "export" | "projects" | null;

export interface BrandProject {
  id: number;
  name: string;
  status: string;
  briefingData: BriefingFormData | null;
  generatedConcept: string | null;
  generatedNaming: string | null;
  generatedLogoSvg: string | null;
  generatedMockupUrl: string | null;
  generatedBrandGuide: any;
  currentStep: number;
}

export interface GeneratedBrand {
  concept: any;
  naming: any;
  logoSvg: string;
  mockupUrl: string;
  brandGuide: any;
}

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [currentProject, setCurrentProject] = useState<BrandProject | null>(null);
  const [briefing, setBriefing] = useState<BriefingFormData>(EMPTY_BRIEFING);
  const [generated, setGenerated] = useState<Partial<GeneratedBrand>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);

  // tRPC mutations
  const createProject = trpc.brandProjects.create.useMutation();
  const updateBriefing = trpc.brandProjects.updateBriefing.useMutation();
  const generateConcept = trpc.brandGeneration.generateConcept.useMutation();
  const generateLogoSvg = trpc.brandGeneration.generateLogoSvg.useMutation();
  const generateMockup = trpc.brandGeneration.generateMockup.useMutation();
  const generateBrandGuide = trpc.brandGeneration.generateBrandGuide.useMutation();
  const saveGeneration = trpc.brandProjects.saveGeneration.useMutation();

  const handlePanelToggle = useCallback((panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? null : panel);
  }, []);

  const handleBriefingUpdate = useCallback((data: Partial<BriefingFormData>) => {
    setBriefing(prev => ({ ...prev, ...data }));
  }, []);

  const handleProjectLoad = useCallback((project: BrandProject) => {
    setCurrentProject(project);
    if (project.briefingData) setBriefing(project.briefingData);
    const gen: Partial<GeneratedBrand> = {};
    if (project.generatedLogoSvg) gen.logoSvg = project.generatedLogoSvg;
    if (project.generatedMockupUrl) gen.mockupUrl = project.generatedMockupUrl;
    if (project.generatedConcept) {
      try { gen.concept = JSON.parse(project.generatedConcept); } catch {}
    }
    if (project.generatedBrandGuide) gen.brandGuide = project.generatedBrandGuide;
    setGenerated(gen);
    setActivePanel("editor");
    toast.success(`Proyecto "${project.name}" cargado`);
  }, []);

  const handleFullGeneration = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para generar identidad de marca");
      return;
    }
    if (!briefing.brandName) {
      toast.error("Completa el briefing antes de generar");
      setActivePanel("briefing");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Step 1: Create or use existing project
      let projectId = currentProject?.id;
      if (!projectId) {
        setGenerationStep("Creando proyecto...");
        const proj = await createProject.mutateAsync({ name: briefing.brandName });
        projectId = proj.id;
        setCurrentProject({ id: proj.id, name: proj.name, status: "in_progress", briefingData: briefing, generatedConcept: null, generatedNaming: null, generatedLogoSvg: null, generatedMockupUrl: null, generatedBrandGuide: null, currentStep: 0 });
      }

      // Step 2: Save briefing
      setGenerationStep("Guardando briefing...");
      setGenerationProgress(10);
      await updateBriefing.mutateAsync({ id: projectId, briefingData: briefing, currentStep: 8 });

      // Step 3: Generate concept
      setGenerationStep("Generando concepto de marca con IA...");
      setGenerationProgress(25);
      const conceptResult = await generateConcept.mutateAsync({ projectId, briefing });
      const concept = conceptResult.content;
      setGenerated(prev => ({ ...prev, concept }));

      // Step 4: Generate logo SVG
      setGenerationStep("Diseñando logotipo vectorial...");
      setGenerationProgress(50);
      const logoResult = await generateLogoSvg.mutateAsync({ projectId, briefing, concept });
      setGenerated(prev => ({ ...prev, logoSvg: logoResult.svg }));

      // Step 5: Generate mockup
      setGenerationStep("Generando mockup visual...");
      setGenerationProgress(70);
      const mockupResult = await generateMockup.mutateAsync({ projectId, briefing, concept });
      setGenerated(prev => ({ ...prev, mockupUrl: mockupResult.url ?? "" }));

      // Step 6: Generate brand guide
      setGenerationStep("Creando guía de marca...");
      setGenerationProgress(88);
      const guideResult = await generateBrandGuide.mutateAsync({ projectId, briefing, concept });
      setGenerated(prev => ({ ...prev, brandGuide: guideResult.guide }));

      // Step 7: Save all
      setGenerationProgress(100);
      setGenerationStep("¡Identidad de marca completada!");
      await saveGeneration.mutateAsync({
        id: projectId,
        generatedLogoSvg: logoResult.svg,
        generatedMockupUrl: mockupResult.url ?? "",
        generatedBrandGuide: guideResult.guide,
      });

      toast.success("¡Identidad de marca generada al 89%+ de personalización!");
      setActivePanel("editor");
    } catch (error: any) {
      toast.error(`Error en la generación: ${error.message ?? "Intenta de nuevo"}`);
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationStep("");
        setGenerationProgress(0);
      }, 3000);
    }
  }, [briefing, currentProject, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ background: "oklch(0.13 0.015 260 / 0.9)", backdropFilter: "blur(20px)", border: "1px solid oklch(0.65 0.22 40 / 0.3)", borderRadius: "16px", boxShadow: "0 0 30px rgba(255,107,0,0.15)", padding: "2rem", textAlign: "center" }}>
          <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "#FF6B00", borderTopColor: "transparent" }} />
          <p className="text-[var(--color-text-secondary)] font-display">Cargando Brand Identity API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background grid pattern */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        zIndex: 0,
      }} />
      {/* Ambient neon glow */}
      <div className="fixed pointer-events-none" style={{
        top: "-20%",
        left: "-10%",
        width: "60%",
        height: "60%",
        background: "radial-gradient(ellipse, rgba(255,107,0,0.04) 0%, transparent 70%)",
        zIndex: 0,
      }} />
      <div className="fixed pointer-events-none" style={{
        bottom: "-20%",
        right: "-10%",
        width: "50%",
        height: "50%",
        background: "radial-gradient(ellipse, rgba(6,182,212,0.03) 0%, transparent 70%)",
        zIndex: 0,
      }} />

      {/* Header */}
      <DashboardHeader
        user={user}
        currentProject={currentProject}
        briefing={briefing}
        isGenerating={isGenerating}
        onGenerate={handleFullGeneration}
        onProjectsOpen={() => handlePanelToggle("projects")}
      />

      {/* Main Content */}
      <main className="container pt-8 pb-20" style={{ position: "relative", zIndex: 1 }}>
        {/* Generation Progress */}
        {isGenerating && (
          <GenerationProgress step={generationStep} progress={generationProgress} />
        )}

        {/* Hero Section */}
        {!isGenerating && (
          <div className="mb-8">
            {briefing.brandName ? (
              <div
                style={{
                  background: "oklch(0.12 0.015 260 / 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid oklch(0.65 0.22 40 / 0.2)",
                  borderRadius: "20px",
                  padding: "1.5rem 2rem",
                  boxShadow: "0 0 40px rgba(255,107,0,0.06), 0 8px 32px rgba(0,0,0,0.3)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Subtle top accent */}
                <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.4), transparent)" }} />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF6B00", boxShadow: "0 0 8px #FF6B00" }} />
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#FF6B00", fontFamily: "'Orbitron', monospace" }}>Proyecto activo</span>
                    </div>
                    <h1 className="text-2xl font-bold font-display" style={{ color: "oklch(0.97 0.005 260)" }}>
                      {briefing.nameSelected || briefing.brandName}
                    </h1>
                    {briefing.sector && (
                      <p className="text-sm mt-0.5" style={{ color: "oklch(0.55 0.01 260)" }}>{briefing.sector} · {briefing.industry || "Industria no definida"}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    {[{
                      label: "Pasos",
                      value: `${[briefing.brandName, briefing.primaryColors?.length, briefing.industry, briefing.typographySelected, briefing.targetAge, briefing.geometrySelected?.length, briefing.logoStyle, briefing.nameSelected || briefing.brandName].filter(Boolean).length}/8`,
                      color: "#FF6B00",
                    }, {
                      label: "Logotipo",
                      value: generated.logoSvg ? "✓ Listo" : "Pendiente",
                      color: generated.logoSvg ? "#10B981" : "oklch(0.45 0.01 260)",
                    }, {
                      label: "Guía",
                      value: generated.brandGuide ? "✓ Lista" : "Pendiente",
                      color: generated.brandGuide ? "#10B981" : "oklch(0.45 0.01 260)",
                    }].map(stat => (
                      <div key={stat.label} className="text-center">
                        <p className="text-lg font-bold font-display" style={{ color: stat.color }}>{stat.value}</p>
                        <p className="text-xs" style={{ color: "oklch(0.45 0.01 260)" }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "oklch(0.12 0.015 260 / 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid oklch(1 0 0 / 0.06)",
                  borderRadius: "20px",
                  padding: "2rem",
                  textAlign: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #FF6B00, #FF8C00)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", boxShadow: "0 0 20px rgba(255,107,0,0.4)" }}>
                  <span style={{ fontSize: "1.5rem" }}>⚡</span>
                </div>
                <h1 className="text-xl font-bold font-display mb-2" style={{ color: "oklch(0.95 0.005 260)" }}>
                  Bienvenido a Brand Identity API
                </h1>
                <p className="text-sm mb-4" style={{ color: "oklch(0.55 0.01 260)" }}>
                  Comienza haciendo clic en <strong style={{ color: "#FF6B00" }}>Briefing</strong> para definir los datos básicos de tu marca.
                </p>
                <button
                  onClick={() => handlePanelToggle("briefing")}
                  className="btn-neon flex items-center gap-2 mx-auto"
                >
                  <span>Iniciar Briefing</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Module Grid */}
        <ModuleGrid
          activePanel={activePanel}
          onPanelToggle={handlePanelToggle}
          briefing={briefing}
          generated={generated}
          isAuthenticated={isAuthenticated}
        />

        {/* Panels */}
        <div className="mt-6 space-y-4">
          {activePanel === "briefing" && (
            <BriefingPanel
              briefing={briefing}
              onUpdate={handleBriefingUpdate}
              onClose={() => setActivePanel(null)}
              onComplete={() => setActivePanel("colors")}
            />
          )}

          {activePanel === "colors" && (
            <ColorsPanel
              briefing={briefing}
              onUpdate={handleBriefingUpdate}
              onClose={() => setActivePanel(null)}
              onComplete={() => setActivePanel("typography")}
            />
          )}

          {activePanel === "typography" && (
            <TypographyPanel
              briefing={briefing}
              onUpdate={handleBriefingUpdate}
              onClose={() => setActivePanel(null)}
              onComplete={() => setActivePanel("geometry")}
            />
          )}

          {activePanel === "geometry" && (
            <GeometryPanel
              briefing={briefing}
              onUpdate={handleBriefingUpdate}
              onClose={() => setActivePanel(null)}
              onComplete={() => setActivePanel("naming")}
            />
          )}

          {activePanel === "naming" && (
            <NamingPanel
              briefing={briefing}
              onUpdate={handleBriefingUpdate}
              onClose={() => setActivePanel(null)}
              onComplete={() => setActivePanel("style")}
              projectId={currentProject?.id}
              onProjectCreated={(id, name) => {
                setCurrentProject(prev => prev ? { ...prev, id, name } : { id, name, status: "draft", briefingData: briefing, generatedConcept: null, generatedNaming: null, generatedLogoSvg: null, generatedMockupUrl: null, generatedBrandGuide: null, currentStep: 5 });
              }}
            />
          )}

          {activePanel === "style" && (
            <StylePanel
              briefing={briefing}
              onUpdate={handleBriefingUpdate}
              onClose={() => setActivePanel(null)}
              onComplete={handleFullGeneration}
            />
          )}

          {activePanel === "editor" && (
            <EditorPanel
              briefing={briefing}
              generated={generated}
              onUpdate={handleBriefingUpdate}
              onClose={() => setActivePanel(null)}
              onRegenerate={handleFullGeneration}
              isGenerating={isGenerating}
            />
          )}

          {activePanel === "export" && (
            <ExportPanel
              briefing={briefing}
              generated={generated}
              projectId={currentProject?.id}
              onClose={() => setActivePanel(null)}
            />
          )}

          {activePanel === "projects" && (
            <ProjectsPanel
              onLoadProject={handleProjectLoad}
              onClose={() => setActivePanel(null)}
              currentProjectId={currentProject?.id}
            />
          )}
        </div>
      </main>

      {/* Login Overlay for non-authenticated users */}
      {!isAuthenticated && !loading && (
        <LoginOverlay />
      )}
    </div>
  );
}
