import { Type, ChevronRight, Check } from "lucide-react";
import type { BriefingFormData } from "../../../../shared/brandData";
import { BRAND_TYPOGRAPHY } from "../../../../shared/brandData";
import PanelWrapper from "./PanelWrapper";

interface Props {
  briefing: BriefingFormData;
  onUpdate: (data: Partial<BriefingFormData>) => void;
  onClose: () => void;
  onComplete: () => void;
}

export default function TypographyPanel({ briefing, onUpdate, onClose, onComplete }: Props) {
  const toggleSuggestion = (key: string) => {
    const current = briefing.typographySuggestions ?? [];
    const updated = current.includes(key)
      ? current.filter(k => k !== key)
      : current.length >= 3 ? [...current.slice(1), key] : [...current, key];
    onUpdate({ typographySuggestions: updated });
  };

  return (
    <PanelWrapper title="Tipografía de Marca" icon={<Type size={18} />} onClose={onClose} color="#06B6D4">
      <div className="space-y-6">
        <p className="text-sm" style={{ color: "oklch(0.60 0.01 260)" }}>
          Selecciona hasta 3 tipografías como sugerencias. Luego elige la principal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {BRAND_TYPOGRAPHY.map(font => {
            const isSuggested = briefing.typographySuggestions?.includes(font.key);
            const isSelected = briefing.typographySelected === font.key;
            return (
              <div
                key={font.key}
                className="p-4 rounded-xl transition-all cursor-pointer"
                style={{
                  background: isSelected
                    ? "oklch(0.06 0.18 195 / 0.15)"
                    : isSuggested
                      ? "oklch(0.06 0.18 195 / 0.08)"
                      : "oklch(0.13 0.015 260 / 0.6)",
                  border: `1px solid ${isSelected ? "#06B6D4" : isSuggested ? "oklch(0.06 0.18 195 / 0.4)" : "oklch(1 0 0 / 0.06)"}`,
                  boxShadow: isSelected ? "0 0 12px oklch(0.06 0.18 195 / 0.3)" : undefined,
                }}
                onClick={() => toggleSuggestion(font.key)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p
                      className="text-xl font-bold leading-none mb-1"
                      style={{ fontFamily: font.nombre, color: "oklch(0.90 0.005 260)" }}
                    >
                      {font.preview}
                    </p>
                    <p className="text-xs" style={{ color: "oklch(0.50 0.01 260)" }}>{font.familia}</p>
                  </div>
                  {isSuggested && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "#06B6D4", color: "black" }}
                    >
                      <Check size={12} />
                    </div>
                  )}
                </div>
                <p className="text-xs mb-2" style={{ color: "oklch(0.55 0.01 260)" }}>
                  {font.psicologia}
                </p>
                <div className="flex flex-wrap gap-1">
                  {font.ideal.slice(0, 2).map(i => (
                    <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "oklch(0.06 0.18 195 / 0.15)", color: "#06B6D4" }}>
                      {i}
                    </span>
                  ))}
                </div>

                {isSuggested && (
                  <button
                    onClick={e => { e.stopPropagation(); onUpdate({ typographySelected: font.key }); }}
                    className="mt-3 w-full text-xs py-1.5 rounded-lg transition-all"
                    style={{
                      background: isSelected ? "#06B6D4" : "oklch(0.06 0.18 195 / 0.15)",
                      color: isSelected ? "black" : "#06B6D4",
                      border: "1px solid oklch(0.06 0.18 195 / 0.3)",
                    }}
                  >
                    {isSelected ? "✓ Tipografía principal" : "Seleccionar como principal"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid oklch(1 0 0 / 0.06)" }}>
        <button onClick={onClose} className="btn-neon-outline text-sm py-2 px-4">← Cerrar</button>
        <button
          onClick={onComplete}
          className="btn-neon text-sm py-2 px-4 flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)", boxShadow: "0 0 15px oklch(0.06 0.18 195 / 0.4)" }}
        >
          Continuar con Geometría <ChevronRight size={15} />
        </button>
      </div>
    </PanelWrapper>
  );
}
