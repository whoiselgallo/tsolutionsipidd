import { Shapes, ChevronRight, Check } from "lucide-react";
import type { BriefingFormData } from "../../../../shared/brandData";
import { BRAND_GEOMETRY } from "../../../../shared/brandData";
import PanelWrapper from "./PanelWrapper";

interface Props {
  briefing: BriefingFormData;
  onUpdate: (data: Partial<BriefingFormData>) => void;
  onClose: () => void;
  onComplete: () => void;
}

export default function GeometryPanel({ briefing, onUpdate, onClose, onComplete }: Props) {
  const toggle = (key: string) => {
    const current = briefing.geometrySelected ?? [];
    const updated = current.includes(key)
      ? current.filter(k => k !== key)
      : current.length >= 3 ? [...current.slice(1), key] : [...current, key];
    onUpdate({ geometrySelected: updated });
  };

  return (
    <PanelWrapper title="Geometría del Logotipo" icon={<Shapes size={18} />} onClose={onClose} color="#7C3AED">
      <p className="text-sm mb-4" style={{ color: "oklch(0.60 0.01 260)" }}>
        Selecciona hasta 3 formas geométricas que representen tu marca. La IA combinará estas formas para crear tu logotipo.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {BRAND_GEOMETRY.map(geo => {
          const isSelected = briefing.geometrySelected?.includes(geo.key);
          return (
            <button
              key={geo.key}
              onClick={() => toggle(geo.key)}
              className="p-4 rounded-xl text-left transition-all relative"
              style={{
                background: isSelected ? "oklch(0.55 0.22 295 / 0.12)" : "oklch(0.13 0.015 260 / 0.6)",
                border: `1px solid ${isSelected ? "#7C3AED" : "oklch(1 0 0 / 0.06)"}`,
                boxShadow: isSelected ? "0 0 12px oklch(0.55 0.22 295 / 0.3)" : undefined,
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "#7C3AED" }}
                >
                  <Check size={11} className="text-white" />
                </div>
              )}
              {/* SVG Preview */}
              <div className="flex justify-center mb-3">
                <svg
                  viewBox="0 0 100 100"
                  width="48"
                  height="48"
                  fill="none"
                  stroke={isSelected ? "#7C3AED" : "oklch(0.50 0.01 260)"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={geo.svgPath} fill={isSelected ? "oklch(0.55 0.22 295 / 0.15)" : "none"} />
                </svg>
              </div>
              <p className="text-sm font-semibold text-center mb-1" style={{ color: isSelected ? "#7C3AED" : "oklch(0.80 0.005 260)" }}>
                {geo.nombre}
              </p>
              <p className="text-xs text-center" style={{ color: "oklch(0.50 0.01 260)" }}>
                {geo.significado}
              </p>
            </button>
          );
        })}
      </div>

      {(briefing.geometrySelected?.length ?? 0) > 0 && (
        <div className="mt-4 p-3 rounded-xl" style={{ background: "oklch(0.55 0.22 295 / 0.08)", border: "1px solid oklch(0.55 0.22 295 / 0.2)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "#7C3AED" }}>Formas seleccionadas:</p>
          <div className="flex flex-wrap gap-2">
            {briefing.geometrySelected?.map(key => {
              const g = BRAND_GEOMETRY.find(g => g.key === key);
              return g ? (
                <span key={key} className="text-xs px-2 py-1 rounded-lg" style={{ background: "oklch(0.55 0.22 295 / 0.15)", color: "#7C3AED", border: "1px solid oklch(0.55 0.22 295 / 0.3)" }}>
                  {g.nombre}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid oklch(1 0 0 / 0.06)" }}>
        <button onClick={onClose} className="btn-neon-outline text-sm py-2 px-4">← Cerrar</button>
        <button
          onClick={onComplete}
          className="btn-neon text-sm py-2 px-4 flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)", boxShadow: "0 0 15px oklch(0.55 0.22 295 / 0.4)" }}
        >
          Continuar con Naming <ChevronRight size={15} />
        </button>
      </div>
    </PanelWrapper>
  );
}
