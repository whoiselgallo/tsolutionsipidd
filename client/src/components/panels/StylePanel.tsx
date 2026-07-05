import { Layers, Sparkles, Check } from "lucide-react";
import type { BriefingFormData } from "../../../../shared/brandData";
import { LOGO_STYLES } from "../../../../shared/brandData";
import PanelWrapper from "./PanelWrapper";

interface Props {
  briefing: BriefingFormData;
  onUpdate: (data: Partial<BriefingFormData>) => void;
  onClose: () => void;
  onComplete: () => void;
}

export default function StylePanel({ briefing, onUpdate, onClose, onComplete }: Props) {
  return (
    <PanelWrapper title="Estilo del Logotipo" icon={<Layers size={18} />} onClose={onClose} color="#10B981">
      <p className="text-sm mb-4" style={{ color: "oklch(0.60 0.01 260)" }}>
        Selecciona el estilo visual que mejor representa la personalidad de tu marca:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LOGO_STYLES.map(style => {
          const isSelected = briefing.logoStyle === style.key;
          return (
            <button
              key={style.key}
              onClick={() => onUpdate({ logoStyle: style.key })}
              className="p-4 rounded-xl text-left transition-all relative overflow-hidden"
              style={{
                background: isSelected
                  ? `${style.previewBg}cc`
                  : "oklch(0.13 0.015 260 / 0.6)",
                border: `1px solid ${isSelected ? "#10B981" : "oklch(1 0 0 / 0.06)"}`,
                boxShadow: isSelected ? "0 0 15px oklch(0.65 0.18 145 / 0.3)" : undefined,
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "#10B981" }}
                >
                  <Check size={12} className="text-white" />
                </div>
              )}

              {/* Style preview */}
              <div
                className="h-16 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden"
                style={{ background: style.previewBg }}
              >
                <span
                  className="text-sm font-bold font-display"
                  style={{
                    color: style.previewText,
                    fontFamily: style.tipografias[0],
                    textShadow: style.previewBg === "#050510" ? `0 0 10px ${style.previewText}` : undefined,
                  }}
                >
                  {briefing.brandName || "MARCA"}
                </span>
              </div>

              <p className="text-sm font-bold font-display mb-1" style={{ color: isSelected ? "#10B981" : "oklch(0.85 0.005 260)" }}>
                {style.nombre}
              </p>
              <p className="text-xs mb-2" style={{ color: "oklch(0.55 0.01 260)" }}>
                {style.sensacion}
              </p>
              <p className="text-xs mb-2" style={{ color: "oklch(0.45 0.01 260)" }}>
                {style.descripcion}
              </p>
              <div className="flex flex-wrap gap-1">
                {style.ideal.slice(0, 2).map(i => (
                  <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "oklch(0.65 0.18 145 / 0.12)", color: "#10B981" }}>
                    {i}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid oklch(1 0 0 / 0.06)" }}>
        <button onClick={onClose} className="btn-neon-outline text-sm py-2 px-4">← Cerrar</button>
        <button
          onClick={onComplete}
          disabled={!briefing.logoStyle}
          className="btn-neon text-sm py-2 px-4 flex items-center gap-2"
          style={{
            background: briefing.logoStyle ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : undefined,
            boxShadow: briefing.logoStyle ? "0 0 15px oklch(0.65 0.18 145 / 0.4)" : undefined,
            opacity: briefing.logoStyle ? 1 : 0.5,
          }}
        >
          <Sparkles size={15} />
          Generar Identidad de Marca
        </button>
      </div>
    </PanelWrapper>
  );
}
