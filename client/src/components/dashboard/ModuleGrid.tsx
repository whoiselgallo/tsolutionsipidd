import {
  FileText, Palette, Type, Shapes, Lightbulb,
  Layers, PenTool, Download, CheckCircle2, Circle,
  ChevronDown, ChevronUp, Sparkles
} from "lucide-react";
import type { ActivePanel } from "@/pages/Dashboard";
import type { BriefingFormData } from "../../../../shared/brandData";

interface ModuleConfig {
  id: ActivePanel;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  glowColor: string;
  checkFn: (b: BriefingFormData, g: any) => boolean;
  step: number;
}

const MODULES: ModuleConfig[] = [
  {
    id: "briefing",
    icon: <FileText size={22} />,
    title: "Briefing",
    subtitle: "Datos básicos de la marca",
    color: "#FF6B00",
    glowColor: "rgba(255,107,0,",
    checkFn: (b) => !!b.brandName && !!b.sector,
    step: 1,
  },
  {
    id: "colors",
    icon: <Palette size={22} />,
    title: "Colores",
    subtitle: "Paleta cromática",
    color: "#EC4899",
    glowColor: "rgba(236,72,153,",
    checkFn: (b) => (b.primaryColors?.length ?? 0) > 0,
    step: 2,
  },
  {
    id: "typography",
    icon: <Type size={22} />,
    title: "Tipografía",
    subtitle: "Fuentes de la marca",
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,",
    checkFn: (b) => !!b.typographySelected,
    step: 3,
  },
  {
    id: "geometry",
    icon: <Shapes size={22} />,
    title: "Geometría",
    subtitle: "Formas del logotipo",
    color: "#7C3AED",
    glowColor: "rgba(124,58,237,",
    checkFn: (b) => (b.geometrySelected?.length ?? 0) > 0,
    step: 4,
  },
  {
    id: "naming",
    icon: <Lightbulb size={22} />,
    title: "Naming",
    subtitle: "Brainstorming de nombres",
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,",
    checkFn: (b) => !!b.nameSelected || !!b.brandName,
    step: 5,
  },
  {
    id: "style",
    icon: <Layers size={22} />,
    title: "Estilo",
    subtitle: "Estilo visual del logo",
    color: "#10B981",
    glowColor: "rgba(16,185,129,",
    checkFn: (b) => !!b.logoStyle,
    step: 6,
  },
  {
    id: "editor",
    icon: <PenTool size={22} />,
    title: "Editor",
    subtitle: "Editor visual interactivo",
    color: "#FF6B00",
    glowColor: "rgba(255,107,0,",
    checkFn: (_, g) => !!g?.logoSvg,
    step: 7,
  },
  {
    id: "export",
    icon: <Download size={22} />,
    title: "Exportar",
    subtitle: "Descargar entregables",
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,",
    checkFn: (_, g) => !!g?.logoSvg,
    step: 8,
  },
];

interface Props {
  activePanel: ActivePanel;
  onPanelToggle: (panel: ActivePanel) => void;
  briefing: BriefingFormData;
  generated: any;
  isAuthenticated: boolean;
}

export default function ModuleGrid({ activePanel, onPanelToggle, briefing, generated, isAuthenticated }: Props) {
  return (
    <div>
      {/* Section title */}
      <div className="flex items-center gap-3 mb-5">
        <div className="neon-divider flex-1" />
        <div className="flex items-center gap-2">
          <Sparkles size={12} style={{ color: "#FF6B00" }} />
          <span className="text-xs font-display font-semibold uppercase tracking-widest" style={{ color: "#FF6B00" }}>
            Módulos de Identidad
          </span>
          <Sparkles size={12} style={{ color: "#FF6B00" }} />
        </div>
        <div className="neon-divider flex-1" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {MODULES.map((mod) => {
          const isActive = activePanel === mod.id;
          const isCompleted = mod.checkFn(briefing, generated);

          return (
            <button
              key={mod.id}
              onClick={() => onPanelToggle(mod.id)}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${mod.glowColor}0.12) 0%, oklch(0.13 0.015 260 / 0.95) 100%)`
                  : "oklch(0.13 0.015 260 / 0.7)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: `1px solid ${isActive ? mod.color + "cc" : "oklch(1 0 0 / 0.07)"}`,
                borderRadius: "14px",
                boxShadow: isActive
                  ? `0 0 20px ${mod.glowColor}0.35), 0 0 50px ${mod.glowColor}0.15), 0 0 100px ${mod.glowColor}0.06), inset 0 1px 0 ${mod.glowColor}0.15)`
                  : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                cursor: "pointer",
                padding: "0.875rem 0.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                userSelect: "none",
                textAlign: "left",
                transition: "all 0.25s cubic-bezier(0.23, 1, 0.32, 1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.borderColor = mod.color + "80";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${mod.glowColor}0.25), 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.borderColor = "oklch(1 0 0 / 0.07)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }
              }}
            >
              {/* Top glow line when active */}
              {isActive && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${mod.color}, transparent)`,
                  boxShadow: `0 0 8px ${mod.color}`,
                }} />
              )}

              {/* Step badge + status */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontSize: "0.65rem",
                  fontFamily: "'Orbitron', monospace",
                  color: isActive ? mod.color : "oklch(0.40 0.01 260)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}>
                  {String(mod.step).padStart(2, "0")}
                </span>
                {isCompleted ? (
                  <CheckCircle2 size={13} style={{ color: "#10B981", filter: "drop-shadow(0 0 4px #10B98180)" }} />
                ) : (
                  <Circle size={13} style={{ color: "oklch(0.30 0.01 260)" }} />
                )}
              </div>

              {/* Icon */}
              <div style={{
                color: isActive ? mod.color : "oklch(0.55 0.01 260)",
                filter: isActive ? `drop-shadow(0 0 10px ${mod.color}90)` : undefined,
                transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              }}>
                {mod.icon}
              </div>

              {/* Text */}
              <div>
                <p style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  fontFamily: "'Syne', sans-serif",
                  lineHeight: 1.2,
                  color: isActive ? "oklch(0.95 0.005 260)" : "oklch(0.75 0.005 260)",
                  marginBottom: "0.125rem",
                }}>
                  {mod.title}
                </p>
                <p className="hidden lg:block" style={{
                  fontSize: "0.6875rem",
                  lineHeight: 1.3,
                  color: isActive ? "oklch(0.60 0.01 260)" : "oklch(0.45 0.01 260)",
                }}>
                  {mod.subtitle}
                </p>
              </div>

              {/* Active indicator */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isActive ? (
                  <ChevronUp size={13} style={{ color: mod.color }} />
                ) : (
                  <ChevronDown size={13} style={{ color: "oklch(0.30 0.01 260)" }} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
