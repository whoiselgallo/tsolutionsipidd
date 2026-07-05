import { useState } from "react";
import { Lightbulb, ChevronRight, Sparkles, Plus, X, Check, Info } from "lucide-react";
import type { BriefingFormData } from "../../../../shared/brandData";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import PanelWrapper from "./PanelWrapper";

interface Props {
  briefing: BriefingFormData;
  onUpdate: (data: Partial<BriefingFormData>) => void;
  onClose: () => void;
  onComplete: () => void;
  projectId?: number;
  onProjectCreated?: (id: number, name: string) => void;
}

export default function NamingPanel({ briefing, onUpdate, onClose, onComplete, projectId, onProjectCreated }: Props) {
  const [customName, setCustomName] = useState("");
  const [aiNames, setAiNames] = useState<any[]>([]);
  const [localProjectId, setLocalProjectId] = useState<number | undefined>(projectId);

  const createProject = trpc.brandProjects.create.useMutation();
  const utils = trpc.useUtils();

  const generateNames = trpc.brandGeneration.generateNames.useMutation({
    onSuccess: (data) => {
      setAiNames(data.names);
      toast.success("¡Nombres generados con IA!");
    },
    onError: (err) => toast.error(`Error al generar nombres: ${err.message}`),
  });

  const addCustomName = () => {
    if (!customName.trim()) return;
    const current = briefing.nameSuggestions ?? [];
    if (!current.includes(customName.trim())) {
      onUpdate({ nameSuggestions: [...current, customName.trim()] });
    }
    setCustomName("");
  };

  const removeName = (name: string) => {
    onUpdate({
      nameSuggestions: (briefing.nameSuggestions ?? []).filter(n => n !== name),
      nameSelected: briefing.nameSelected === name ? "" : briefing.nameSelected,
    });
  };

  const selectAiName = (name: any) => {
    const current = briefing.nameSuggestions ?? [];
    const newSuggestions = current.includes(name.nombre) ? current : [...current, name.nombre];
    onUpdate({ nameSelected: name.nombre, nameSuggestions: newSuggestions });
  };

  const handleGenerateNames = async () => {
    if (!briefing.brandName && !briefing.sector) {
      toast.error("Completa al menos el nombre y sector de tu marca en el Briefing");
      return;
    }

    let pid = localProjectId ?? projectId;

    // Auto-create project if it doesn't exist yet
    if (!pid) {
      try {
        toast.info("Creando proyecto automáticamente...");
        const proj = await createProject.mutateAsync({
          name: briefing.brandName || "Mi Proyecto de Marca",
        });
        pid = proj.id;
        setLocalProjectId(pid);
        if (onProjectCreated) onProjectCreated(proj.id, proj.name);
        toast.success(`Proyecto "${proj.name}" creado`);
      } catch (err: any) {
        toast.error(`No se pudo crear el proyecto: ${err.message}`);
        return;
      }
    }

    generateNames.mutate({ projectId: pid, briefing });
  };

  const isLoading = generateNames.isPending || createProject.isPending;

  return (
    <PanelWrapper title="Brainstorming de Nombres" icon={<Lightbulb size={18} />} onClose={onClose} color="#F59E0B">
      <div className="space-y-6">
        {/* Info banner if no brand name */}
        {!briefing.brandName && (
          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "oklch(0.55 0.18 60 / 0.08)", border: "1px solid oklch(0.55 0.18 60 / 0.2)" }}>
            <Info size={16} style={{ color: "#F59E0B", flexShrink: 0, marginTop: "2px" }} />
            <p className="text-xs" style={{ color: "oklch(0.65 0.01 260)" }}>
              Para mejores resultados, completa el <strong style={{ color: "#F59E0B" }}>Briefing</strong> con el nombre provisional y sector de tu marca antes de generar nombres con IA.
            </p>
          </div>
        )}

        {/* AI Generation */}
        <div
          className="p-4 rounded-xl"
          style={{ background: "oklch(0.55 0.18 60 / 0.08)", border: "1px solid oklch(0.55 0.18 60 / 0.25)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold font-display" style={{ color: "oklch(0.85 0.005 260)" }}>
                Generación de nombres con IA
              </p>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.01 260)" }}>
                La IA generará 8 nombres únicos basados en tu briefing
              </p>
            </div>
            <button
              onClick={handleGenerateNames}
              disabled={isLoading}
              className="btn-neon text-sm py-2 px-4 flex items-center gap-2 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                boxShadow: "0 0 15px oklch(0.55 0.18 60 / 0.4)",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              {createProject.isPending ? "Creando proyecto..." : generateNames.isPending ? "Generando..." : "Generar con IA"}
            </button>
          </div>

          {aiNames.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {aiNames.map((name: any, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: briefing.nameSelected === name.nombre ? "oklch(0.55 0.18 60 / 0.15)" : "oklch(0.13 0.015 260 / 0.6)",
                    border: `1px solid ${briefing.nameSelected === name.nombre ? "#F59E0B" : "oklch(1 0 0 / 0.06)"}`,
                    boxShadow: briefing.nameSelected === name.nombre ? "0 0 10px rgba(245,158,11,0.2)" : undefined,
                  }}
                  onClick={() => selectAiName(name)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold font-display" style={{ color: briefing.nameSelected === name.nombre ? "#F59E0B" : "oklch(0.85 0.005 260)" }}>
                      {name.nombre}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "oklch(0.55 0.18 60 / 0.15)", color: "#F59E0B" }}>
                        {name.puntuacion}%
                      </span>
                      {briefing.nameSelected === name.nombre && (
                        <Check size={14} style={{ color: "#F59E0B" }} />
                      )}
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "oklch(0.55 0.01 260)" }}>{name.justificacion}</p>
                  <p className="text-xs mt-1 italic" style={{ color: "oklch(0.45 0.01 260)" }}>{name.tipo}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual suggestions */}
        <div>
          <p className="text-sm font-semibold font-display mb-3" style={{ color: "oklch(0.85 0.005 260)" }}>
            Agregar nombres manualmente
          </p>
          <div className="flex gap-2 mb-3">
            <input
              className="neon-input flex-1"
              placeholder="Escribe un nombre de marca..."
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCustomName()}
            />
            <button
              onClick={addCustomName}
              className="btn-neon py-2 px-4 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}
            >
              <Plus size={16} />
            </button>
          </div>

          {(briefing.nameSuggestions?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {briefing.nameSuggestions?.map(name => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: briefing.nameSelected === name ? "oklch(0.55 0.18 60 / 0.15)" : "oklch(0.13 0.015 260 / 0.6)",
                    border: `1px solid ${briefing.nameSelected === name ? "#F59E0B" : "oklch(1 0 0 / 0.08)"}`,
                    boxShadow: briefing.nameSelected === name ? "0 0 8px rgba(245,158,11,0.2)" : undefined,
                  }}
                  onClick={() => onUpdate({ nameSelected: name })}
                >
                  {briefing.nameSelected === name && <Check size={12} style={{ color: "#F59E0B" }} />}
                  <span className="text-sm" style={{ color: briefing.nameSelected === name ? "#F59E0B" : "oklch(0.75 0.005 260)" }}>
                    {name}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); removeName(name); }}
                    className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                    style={{ color: "oklch(0.50 0.01 260)" }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
            Notas adicionales sobre el naming
          </label>
          <textarea
            className="neon-input resize-none"
            rows={2}
            placeholder="Ej: Preferimos nombres en inglés, que evoquen velocidad y tecnología..."
            value={briefing.nameNotes}
            onChange={e => onUpdate({ nameNotes: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid oklch(1 0 0 / 0.06)" }}>
        <button onClick={onClose} className="btn-neon-outline text-sm py-2 px-4">← Cerrar</button>
        <button
          onClick={onComplete}
          className="btn-neon text-sm py-2 px-4 flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", boxShadow: "0 0 15px oklch(0.55 0.18 60 / 0.4)" }}
        >
          Continuar con Estilo <ChevronRight size={15} />
        </button>
      </div>
    </PanelWrapper>
  );
}
