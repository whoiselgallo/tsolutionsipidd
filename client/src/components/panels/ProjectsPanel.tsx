import { useState } from "react";
import { FolderOpen, Plus, Trash2, Clock, CheckCircle2, Circle, Sparkles, Download, ChevronDown, ChevronUp, History } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import PanelWrapper from "./PanelWrapper";

interface Props {
  onClose: () => void;
  onLoadProject: (project: any) => void;
  currentProjectId?: number;
}

const GEN_TYPE_LABELS: Record<string, string> = {
  concept: "Concepto de marca",
  naming: "Naming",
  logo_svg: "Logotipo SVG",
  mockup: "Mockup visual",
  brand_guide: "Guía de marca",
  full: "Generación completa",
};

function ProjectHistory({ projectId }: { projectId: number }) {
  const { data: history, isLoading } = trpc.brandProjects.getHistory.useQuery({ projectId });
  if (isLoading) return <div className="text-xs py-2 text-center" style={{ color: "oklch(0.45 0.01 260)" }}>Cargando historial...</div>;
  if (!history || history.length === 0) return <div className="text-xs py-2 text-center" style={{ color: "oklch(0.40 0.01 260)" }}>Sin generaciones previas</div>;
  return (
    <div className="mt-2 space-y-1.5">
      {history.map((gen: any) => (
        <div key={gen.id} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "oklch(0.10 0.01 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.04)" }}>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: gen.generationType === "logo_svg" ? "#FF6B00" : gen.generationType === "concept" ? "#06B6D4" : gen.generationType === "brand_guide" ? "#7C3AED" : "#10B981" }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "oklch(0.75 0.005 260)" }}>
              {GEN_TYPE_LABELS[gen.generationType] ?? gen.generationType}
            </p>
            <p className="text-xs" style={{ color: "oklch(0.40 0.01 260)" }}>
              {new Date(gen.createdAt).toLocaleString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              {gen.tokensUsed ? ` · ${gen.tokensUsed} tokens` : ""}
            </p>
          </div>
          <span className="text-xs px-1.5 py-0.5 rounded font-mono flex-shrink-0" style={{ background: "oklch(0.15 0.01 260)", color: "oklch(0.50 0.01 260)" }}>
            {gen.modelUsed?.split("-").slice(0, 2).join("-") ?? "AI"}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ProjectsPanel({ onClose, onLoadProject, currentProjectId }: Props) {
  const [newProjectName, setNewProjectName] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);

  const { data: projects, refetch } = trpc.brandProjects.list.useQuery();
  const utils = trpc.useUtils();

  const createProject = trpc.brandProjects.create.useMutation({
    onSuccess: async (data) => {
      toast.success(`Proyecto "${data.name}" creado`);
      setNewProjectName("");
      refetch();
      // Fetch full project and load it
      setLoadingId(data.id);
      try {
        const fullProject = await utils.brandProjects.get.fetch({ id: data.id });
        if (fullProject) onLoadProject(fullProject);
        else onLoadProject({ id: data.id, name: data.name, status: "draft", briefingData: null, generatedConcept: null, generatedNaming: null, generatedLogoSvg: null, generatedMockupUrl: null, generatedBrandGuide: null, currentStep: 0 });
      } finally {
        setLoadingId(null);
      }
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const deleteProject = trpc.brandProjects.delete.useMutation({
    onSuccess: () => { toast.success("Proyecto eliminado"); refetch(); },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const handleCreate = () => {
    if (!newProjectName.trim()) return;
    createProject.mutate({ name: newProjectName.trim() });
  };

  const handleLoadProject = async (projectId: number) => {
    setLoadingId(projectId);
    try {
      const fullProject = await utils.brandProjects.get.fetch({ id: projectId });
      if (fullProject) {
        onLoadProject(fullProject);
        toast.success(`Proyecto "${fullProject.name}" cargado`);
      }
    } catch (err: any) {
      toast.error(`Error al cargar proyecto: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const statusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 size={14} style={{ color: "#10B981" }} />;
    if (status === "generating") return <Sparkles size={14} style={{ color: "#F59E0B" }} className="animate-pulse" />;
    return <Circle size={14} style={{ color: "oklch(0.40 0.01 260)" }} />;
  };

  const statusLabel = (status: string) => {
    if (status === "completed") return "Completado";
    if (status === "generating") return "Generando...";
    if (status === "in_progress") return "En progreso";
    return "Borrador";
  };

  return (
    <PanelWrapper title="Mis Proyectos" icon={<FolderOpen size={18} />} onClose={onClose} color="#FF6B00">
      <div className="space-y-4">
        {/* Create new project */}
        <div
          className="p-4 rounded-xl"
          style={{ background: "oklch(0.65 0.22 40 / 0.05)", border: "1px solid oklch(0.65 0.22 40 / 0.2)" }}
        >
          <p className="text-sm font-semibold font-display mb-3" style={{ color: "oklch(0.85 0.005 260)" }}>
            Nuevo proyecto de identidad
          </p>
          <div className="flex gap-2">
            <input
              className="neon-input flex-1"
              placeholder="Nombre del proyecto..."
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
            />
            <button
              onClick={handleCreate}
              disabled={createProject.isPending || !newProjectName.trim()}
              className="btn-neon flex items-center gap-2 text-sm py-2 px-4 flex-shrink-0"
              style={{ opacity: createProject.isPending || !newProjectName.trim() ? 0.5 : 1 }}
            >
              {createProject.isPending ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Crear
            </button>
          </div>
        </div>

        {/* Projects list */}
        <div>
          <p className="text-sm font-semibold font-display mb-3" style={{ color: "oklch(0.85 0.005 260)" }}>
            Proyectos guardados ({projects?.length ?? 0})
          </p>

          {!projects || projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen size={36} className="mx-auto mb-3" style={{ color: "oklch(0.30 0.01 260)" }} />
              <p className="text-sm" style={{ color: "oklch(0.50 0.01 260)" }}>
                No tienes proyectos guardados aún
              </p>
              <p className="text-xs mt-1" style={{ color: "oklch(0.40 0.01 260)" }}>
                Crea tu primer proyecto de identidad de marca
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.map((project: any) => {
                const isActive = project.id === currentProjectId;
                const isLoading = loadingId === project.id;
                return (
                  <div key={project.id}>
                    <div
                      className="p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all group"
                      style={{
                        background: isActive ? "oklch(0.65 0.22 40 / 0.08)" : "oklch(0.13 0.015 260 / 0.6)",
                        border: `1px solid ${isActive ? "oklch(0.65 0.22 40 / 0.4)" : "oklch(1 0 0 / 0.06)"}`,
                        boxShadow: isActive ? "0 0 12px oklch(0.65 0.22 40 / 0.15)" : undefined,
                      }}
                      onClick={() => !isLoading && handleLoadProject(project.id)}
                    >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold font-display text-sm"
                      style={{
                        background: isActive ? "oklch(0.65 0.22 40 / 0.2)" : "oklch(0.18 0.015 260)",
                        color: isActive ? "#FF6B00" : "oklch(0.60 0.01 260)",
                        border: `1px solid ${isActive ? "oklch(0.65 0.22 40 / 0.3)" : "oklch(1 0 0 / 0.06)"}`,
                      }}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#FF6B00", borderTopColor: "transparent" }} />
                      ) : (
                        project.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold truncate" style={{ color: isActive ? "#FF6B00" : "oklch(0.85 0.005 260)" }}>
                          {project.name}
                        </p>
                        {isActive && (
                          <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "oklch(0.65 0.22 40 / 0.15)", color: "#FF6B00" }}>
                            Activo
                          </span>
                        )}
                        {project.status === "completed" && (
                          <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "oklch(0.65 0.18 145 / 0.15)", color: "#10B981" }}>
                            <Download size={10} className="inline mr-0.5" />
                            Listo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {statusIcon(project.status)}
                        <span className="text-xs" style={{ color: "oklch(0.50 0.01 260)" }}>
                          {statusLabel(project.status)}
                        </span>
                        <span className="text-xs" style={{ color: "oklch(0.35 0.01 260)" }}>·</span>
                        <Clock size={11} style={{ color: "oklch(0.35 0.01 260)" }} />
                        <span className="text-xs" style={{ color: "oklch(0.40 0.01 260)" }}>
                          {new Date(project.updatedAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setExpandedHistory(expandedHistory === project.id ? null : project.id);
                        }}
                        className="p-2 rounded-lg transition-all"
                        style={{ color: "oklch(0.50 0.01 260)", background: "oklch(0.15 0.01 260)" }}
                        title="Ver historial de generaciones"
                      >
                        {expandedHistory === project.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar el proyecto "${project.name}"?`)) {
                            deleteProject.mutate({ id: project.id });
                          }
                        }}
                        className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        style={{ color: "oklch(0.45 0.01 260)", background: "oklch(0.15 0.01 260)" }}
                        title="Eliminar proyecto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    </div>
                    {expandedHistory === project.id && (
                      <div className="px-4 pb-3 -mt-2">
                        <ProjectHistory projectId={project.id} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PanelWrapper>
  );
}
