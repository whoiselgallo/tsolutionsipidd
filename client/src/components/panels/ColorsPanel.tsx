import { Palette, ChevronRight, Check } from "lucide-react";
import type { BriefingFormData } from "../../../../shared/brandData";
import { BRAND_COLORS } from "../../../../shared/brandData";
import PanelWrapper from "./PanelWrapper";

interface Props {
  briefing: BriefingFormData;
  onUpdate: (data: Partial<BriefingFormData>) => void;
  onClose: () => void;
  onComplete: () => void;
}

export default function ColorsPanel({ briefing, onUpdate, onClose, onComplete }: Props) {
  const toggleColor = (key: string, type: "primary" | "secondary") => {
    const field = type === "primary" ? "primaryColors" : "secondaryColors";
    const current = briefing[field] ?? [];
    const updated = current.includes(key)
      ? current.filter(c => c !== key)
      : type === "primary" && current.length >= 2
        ? [...current.slice(1), key]
        : [...current, key];
    onUpdate({ [field]: updated });
  };

  return (
    <PanelWrapper title="Paleta Cromática" icon={<Palette size={18} />} onClose={onClose} color="#EC4899">
      <div className="space-y-6">
        {/* Primary colors */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold font-display" style={{ color: "oklch(0.85 0.005 260)" }}>
              Colores Primarios
            </h4>
            <span className="text-xs" style={{ color: "oklch(0.50 0.01 260)" }}>
              Selecciona hasta 2 — {briefing.primaryColors?.length ?? 0}/2 seleccionados
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {BRAND_COLORS.map(color => {
              const isSelected = briefing.primaryColors?.includes(color.key);
              return (
                <button
                  key={color.key}
                  onClick={() => toggleColor(color.key, "primary")}
                  className="p-3 rounded-xl text-left transition-all"
                  style={{
                    background: isSelected ? `${color.hex}15` : "oklch(0.13 0.015 260 / 0.6)",
                    border: `1px solid ${isSelected ? color.hex : "oklch(1 0 0 / 0.06)"}`,
                    boxShadow: isSelected ? `0 0 12px ${color.hex}30` : undefined,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 relative"
                      style={{ background: color.hex }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check size={14} className="text-white drop-shadow" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "oklch(0.85 0.005 260)" }}>
                        {color.nombre}
                      </p>
                      <p className="text-xs font-mono" style={{ color: "oklch(0.50 0.01 260)" }}>
                        {color.hex}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "oklch(0.55 0.01 260)" }}>
                    {color.impacto}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {color.emociones.slice(0, 2).map(e => (
                      <span
                        key={e}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: `${color.hex}20`, color: color.hex }}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary colors */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold font-display" style={{ color: "oklch(0.85 0.005 260)" }}>
              Colores Secundarios / Acento
            </h4>
            <span className="text-xs" style={{ color: "oklch(0.50 0.01 260)" }}>
              Opcional — {briefing.secondaryColors?.length ?? 0} seleccionados
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {BRAND_COLORS.map(color => {
              const isSelected = briefing.secondaryColors?.includes(color.key);
              return (
                <button
                  key={color.key}
                  onClick={() => toggleColor(color.key, "secondary")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all"
                  style={{
                    background: isSelected ? `${color.hex}15` : "oklch(0.13 0.015 260 / 0.6)",
                    border: `1px solid ${isSelected ? color.hex : "oklch(1 0 0 / 0.06)"}`,
                    color: isSelected ? color.hex : "oklch(0.60 0.01 260)",
                  }}
                >
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: color.hex }} />
                  {color.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected preview */}
        {(briefing.primaryColors?.length ?? 0) > 0 && (
          <div
            className="p-4 rounded-xl"
            style={{ background: "oklch(0.65 0.22 40 / 0.05)", border: "1px solid oklch(0.65 0.22 40 / 0.2)" }}
          >
            <p className="text-xs font-semibold mb-3" style={{ color: "oklch(0.65 0.22 40)" }}>
              Vista previa de paleta seleccionada:
            </p>
            <div className="flex gap-2">
              {[...(briefing.primaryColors ?? []), ...(briefing.secondaryColors ?? [])].map(key => {
                const color = BRAND_COLORS.find(c => c.key === key);
                if (!color) return null;
                return (
                  <div key={key} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-lg" style={{ background: color.hex }} />
                    <span className="text-xs" style={{ color: "oklch(0.55 0.01 260)" }}>{color.hex}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid oklch(1 0 0 / 0.06)" }}>
        <button onClick={onClose} className="btn-neon-outline text-sm py-2 px-4">
          ← Cerrar
        </button>
        <button
          onClick={onComplete}
          disabled={(briefing.primaryColors?.length ?? 0) === 0}
          className="btn-neon text-sm py-2 px-4 flex items-center gap-2"
          style={{ opacity: (briefing.primaryColors?.length ?? 0) > 0 ? 1 : 0.5 }}
        >
          Continuar con Tipografía <ChevronRight size={15} />
        </button>
      </div>
    </PanelWrapper>
  );
}
