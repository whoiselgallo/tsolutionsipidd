import { useState, useMemo } from "react";
import { PenTool, RefreshCw, Image, BookOpen, Sparkles, Type, Palette, Shapes, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import type { BriefingFormData } from "../../../../shared/brandData";
import type { GeneratedBrand } from "@/pages/Dashboard";
import { BRAND_COLORS, BRAND_TYPOGRAPHY, BRAND_GEOMETRY, type GeometryData } from "../../../../shared/brandData";
import PanelWrapper from "./PanelWrapper";
import { toast } from "sonner";

interface Props {
  briefing: BriefingFormData;
  generated: Partial<GeneratedBrand>;
  onUpdate: (data: Partial<BriefingFormData>) => void;
  onClose: () => void;
  onRegenerate: () => void;
  isGenerating: boolean;
}

type EditorTab = "logo" | "mockup" | "guide";

const BG_PRESETS = [
  { label: "Oscuro", value: "#0F172A" },
  { label: "Blanco", value: "#FFFFFF" },
  { label: "Gris claro", value: "#F3F4F6" },
  { label: "Azul oscuro", value: "#1E3A5F" },
  { label: "Negro", value: "#000000" },
];

export default function EditorPanel({ briefing, generated, onUpdate, onClose, onRegenerate, isGenerating }: Props) {
  const [activeTab, setActiveTab] = useState<EditorTab>("logo");
  const [bgColor, setBgColor] = useState("#0F172A");
  const [showColorControls, setShowColorControls] = useState(false);
  const [showTypoControls, setShowTypoControls] = useState(false);
  const [showGeomControls, setShowGeomControls] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const tabs = [
    { id: "logo" as EditorTab, icon: <PenTool size={15} />, label: "Logotipo" },
    { id: "mockup" as EditorTab, icon: <Image size={15} />, label: "Mockup" },
    { id: "guide" as EditorTab, icon: <BookOpen size={15} />, label: "Guía de Marca" },
  ];

  const concept = generated.concept;
  const brandGuide = generated.brandGuide?.brand_guide;

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast.success(`Color ${hex} copiado`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Compute modified SVG with selected colors
  const modifiedSvg = useMemo(() => {
    if (!generated.logoSvg) return null;
    let svg = generated.logoSvg;
    const primary = briefing.primaryColors?.[0];
    const secondary = briefing.primaryColors?.[1] ?? briefing.secondaryColors?.[0];
    // Replace common placeholder colors with selected brand colors
    if (primary) {
      svg = svg.replace(/#FF6B00/gi, primary).replace(/oklch\(0\.65 0\.22 40\)/gi, primary);
    }
    return svg;
  }, [generated.logoSvg, briefing.primaryColors, briefing.secondaryColors]);

  const ControlSection = ({ title, icon, isOpen, onToggle, children }: any) => (
    <div style={{ background: "oklch(0.13 0.015 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.07)", borderRadius: "12px", overflow: "hidden" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 transition-colors"
        style={{ color: "oklch(0.80 0.005 260)" }}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold font-display">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={14} style={{ color: "#FF6B00" }} /> : <ChevronDown size={14} style={{ color: "oklch(0.40 0.01 260)" }} />}
      </button>
      {isOpen && (
        <div className="px-3 pb-3 pt-1" style={{ borderTop: "1px solid oklch(1 0 0 / 0.05)" }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <PanelWrapper title="Editor Visual Interactivo" icon={<PenTool size={18} />} onClose={onClose} color="#FF6B00">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? "oklch(0.65 0.22 40 / 0.15)" : "oklch(0.65 0.22 40 / 0.05)",
              border: `1px solid ${activeTab === tab.id ? "oklch(0.65 0.22 40 / 0.5)" : "oklch(1 0 0 / 0.06)"}`,
              color: activeTab === tab.id ? "#FF6B00" : "oklch(0.60 0.01 260)",
              boxShadow: activeTab === tab.id ? "0 0 10px oklch(0.65 0.22 40 / 0.2)" : undefined,
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "oklch(0.65 0.22 40 / 0.08)",
            border: "1px solid oklch(0.65 0.22 40 / 0.3)",
            color: "#FF6B00",
            opacity: isGenerating ? 0.6 : 1,
          }}
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
          Regenerar
        </button>
      </div>

      {/* No content yet */}
      {!generated.logoSvg && !generated.mockupUrl && !generated.concept && (
        <div className="text-center py-16">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "oklch(0.65 0.22 40 / 0.1)", border: "1px solid oklch(0.65 0.22 40 / 0.3)" }}
          >
            <Sparkles size={28} style={{ color: "#FF6B00" }} />
          </div>
          <p className="text-base font-semibold font-display mb-2" style={{ color: "oklch(0.80 0.005 260)" }}>
            Aún no hay identidad generada
          </p>
          <p className="text-sm mb-6" style={{ color: "oklch(0.50 0.01 260)" }}>
            Completa el briefing y haz clic en "Generar Identidad" para ver los resultados aquí
          </p>
          <button
            onClick={onRegenerate}
            className="btn-neon flex items-center gap-2 mx-auto"
          >
            <Sparkles size={16} />
            Generar Identidad de Marca
          </button>
        </div>
      )}

      {/* ─── Tab: Logo ─────────────────────────────────────────────────────────── */}
      {activeTab === "logo" && (generated.logoSvg || generated.concept) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Logo preview + editor controls */}
          <div className="space-y-4">
            <p className="text-sm font-semibold font-display" style={{ color: "oklch(0.85 0.005 260)" }}>
              Vista previa del logotipo
            </p>

            {/* Background selector */}
            <div className="flex items-center gap-2 flex-wrap">
              {BG_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => setBgColor(preset.value)}
                  title={preset.label}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    background: preset.value,
                    border: `2px solid ${bgColor === preset.value ? "#FF6B00" : "oklch(1 0 0 / 0.15)"}`,
                    boxShadow: bgColor === preset.value ? "0 0 6px #FF6B00" : undefined,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                />
              ))}
              <input
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                title="Color personalizado"
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  border: "1px solid oklch(1 0 0 / 0.15)",
                  cursor: "pointer",
                  padding: "1px",
                  background: "transparent",
                }}
              />
              <span className="text-xs" style={{ color: "oklch(0.50 0.01 260)" }}>Fondo de previsualización</span>
            </div>

            {/* Logo canvas */}
            <div
              style={{
                background: bgColor,
                borderRadius: "12px",
                padding: "2rem",
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid oklch(1 0 0 / 0.08)",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {modifiedSvg ? (
                <div
                  className="w-full max-w-xs mx-auto"
                  dangerouslySetInnerHTML={{ __html: modifiedSvg }}
                  style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.4))" }}
                />
              ) : (
                <p className="text-sm text-center" style={{ color: "oklch(0.40 0.01 260)" }}>
                  Logo SVG en generación...
                </p>
              )}
            </div>

            {/* ─── Editing Controls ─── */}
            <div className="space-y-2">
              {/* Color controls */}
              <ControlSection
                title="Colores de la marca"
                icon={<Palette size={14} style={{ color: "#EC4899" }} />}
                isOpen={showColorControls}
                onToggle={() => setShowColorControls(v => !v)}
              >
                <div className="space-y-3 mt-2">
                  <div>
                    <p className="text-xs mb-2" style={{ color: "oklch(0.55 0.01 260)" }}>Color primario</p>
                    <div className="flex flex-wrap gap-2">
                      {BRAND_COLORS.slice(0, 12).map(c => (
                        <button
                          key={c.hex}
                          title={c.nombre}
                          onClick={() => {
                            const current = briefing.primaryColors ?? [];
                            onUpdate({ primaryColors: [c.hex, ...(current.slice(1))] });
                          }}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            background: c.hex,
                            border: `2px solid ${briefing.primaryColors?.[0] === c.hex ? "#FF6B00" : "transparent"}`,
                            boxShadow: briefing.primaryColors?.[0] === c.hex ? `0 0 8px ${c.hex}80` : undefined,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs mb-2" style={{ color: "oklch(0.55 0.01 260)" }}>Color secundario</p>
                    <div className="flex flex-wrap gap-2">
                      {BRAND_COLORS.slice(12, 24).map(c => (
                        <button
                          key={c.hex}
                          title={c.nombre}
                          onClick={() => {
                            const current = briefing.primaryColors ?? [];
                            onUpdate({ primaryColors: [current[0] ?? c.hex, c.hex] });
                          }}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            background: c.hex,
                            border: `2px solid ${briefing.primaryColors?.[1] === c.hex ? "#FF6B00" : "transparent"}`,
                            boxShadow: briefing.primaryColors?.[1] === c.hex ? `0 0 8px ${c.hex}80` : undefined,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </ControlSection>

              {/* Typography controls */}
              <ControlSection
                title="Tipografía"
                icon={<Type size={14} style={{ color: "#06B6D4" }} />}
                isOpen={showTypoControls}
                onToggle={() => setShowTypoControls(v => !v)}
              >
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {BRAND_TYPOGRAPHY.slice(0, 6).map(font => (
                    <button
                      key={font.nombre}
                      onClick={() => onUpdate({ typographySelected: font.nombre })}
                      className="flex items-center justify-between p-2 rounded-lg transition-all text-left"
                      style={{
                        background: briefing.typographySelected === font.nombre ? "oklch(0.65 0.18 200 / 0.12)" : "oklch(0.13 0.015 260 / 0.4)",
                        border: `1px solid ${briefing.typographySelected === font.nombre ? "#06B6D4" : "oklch(1 0 0 / 0.06)"}`,
                      }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: briefing.typographySelected === font.nombre ? "#06B6D4" : "oklch(0.80 0.005 260)", fontFamily: font.nombre }}>
                          {font.nombre}
                        </p>
                        <p className="text-xs" style={{ color: "oklch(0.45 0.01 260)" }}>{font.familia}</p>
                      </div>
                      {briefing.typographySelected === font.nombre && (
                        <Check size={14} style={{ color: "#06B6D4" }} />
                      )}
                    </button>
                  ))}
                </div>
              </ControlSection>

              {/* Geometry controls */}
              <ControlSection
                title="Geometría del logo"
                icon={<Shapes size={14} style={{ color: "#7C3AED" }} />}
                isOpen={showGeomControls}
                onToggle={() => setShowGeomControls(v => !v)}
              >
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {BRAND_GEOMETRY.slice(0, 8).map((geom: GeometryData) => (
                    <button
                      key={geom.key}
                      onClick={() => {
                        const current = briefing.geometrySelected ?? [];
                        const isSelected = current.includes(geom.key);
                        onUpdate({
                          geometrySelected: isSelected
                            ? current.filter(g => g !== geom.key)
                            : [...current, geom.key],
                        });
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg transition-all text-left"
                      style={{
                        background: (briefing.geometrySelected ?? []).includes(geom.key) ? "oklch(0.55 0.18 290 / 0.12)" : "oklch(0.13 0.015 260 / 0.4)",
                        border: `1px solid ${(briefing.geometrySelected ?? []).includes(geom.key) ? "#7C3AED" : "oklch(1 0 0 / 0.06)"}`,
                      }}
                    >
                      <span style={{ fontSize: "1rem" }}>◆</span>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: (briefing.geometrySelected ?? []).includes(geom.key) ? "#7C3AED" : "oklch(0.75 0.005 260)" }}>
                          {geom.nombre}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </ControlSection>
            </div>
          </div>

          {/* Right: Concept info */}
          {concept && (
            <div className="space-y-4">
              {concept.concepto && (
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "oklch(0.13 0.015 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#FF6B00" }}>
                    Concepto de marca
                  </p>
                  <p className="text-lg font-bold font-display mb-1" style={{ color: "oklch(0.95 0.005 260)" }}>
                    {concept.concepto?.titulo}
                  </p>
                  <p className="text-sm" style={{ color: "oklch(0.65 0.01 260)" }}>
                    {concept.concepto?.esencia}
                  </p>
                </div>
              )}

              {concept.concepto?.personalidad && (
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "oklch(0.13 0.015 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#FF6B00" }}>
                    Personalidad de marca
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {concept.concepto.personalidad.map((p: string) => (
                      <span
                        key={p}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ background: "oklch(0.65 0.22 40 / 0.12)", color: "#FF6B00", border: "1px solid oklch(0.65 0.22 40 / 0.3)" }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {concept.paleta_cromatica && (
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "oklch(0.13 0.015 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#FF6B00" }}>
                    Paleta cromática generada
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {Object.values(concept.paleta_cromatica).filter((v: any) => v?.hex).map((color: any, i: number) => (
                      <button
                        key={i}
                        className="flex flex-col items-center gap-1 group"
                        onClick={() => copyHex(color.hex)}
                        title={`Copiar ${color.hex}`}
                      >
                        <div
                          className="w-12 h-12 rounded-xl transition-transform group-hover:scale-110"
                          style={{ background: color.hex, boxShadow: `0 2px 8px ${color.hex}60` }}
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono" style={{ color: "oklch(0.55 0.01 260)" }}>{color.hex}</span>
                          {copiedHex === color.hex ? <Check size={10} style={{ color: "#10B981" }} /> : <Copy size={10} style={{ color: "oklch(0.40 0.01 260)" }} />}
                        </div>
                        <span className="text-xs text-center" style={{ color: "oklch(0.45 0.01 260)", maxWidth: "60px" }}>{color.nombre}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {concept.naming?.slogan_principal && (
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "oklch(0.13 0.015 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#FF6B00" }}>
                    Slogan principal
                  </p>
                  <p className="text-base font-bold italic font-display" style={{ color: "oklch(0.90 0.005 260)" }}>
                    "{concept.naming.slogan_principal}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Mockup ──────────────────────────────────────────────────────── */}
      {activeTab === "mockup" && (
        <div>
          {generated.mockupUrl ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold font-display" style={{ color: "oklch(0.85 0.005 260)" }}>
                Mockup visual de identidad
              </p>
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                <img
                  src={generated.mockupUrl}
                  alt="Mockup de identidad de marca"
                  className="w-full"
                  style={{ display: "block" }}
                />
              </div>
              {concept?.propuesta_de_valor && (
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "oklch(0.13 0.015 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#FF6B00" }}>
                    Propuesta de valor
                  </p>
                  <p className="text-sm" style={{ color: "oklch(0.70 0.01 260)" }}>
                    {concept.propuesta_de_valor}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image size={32} className="mx-auto mb-3" style={{ color: "oklch(0.30 0.01 260)" }} />
              <p className="text-sm" style={{ color: "oklch(0.50 0.01 260)" }}>
                Mockup en generación...
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Brand Guide ─────────────────────────────────────────────────── */}
      {activeTab === "guide" && (
        <div className="space-y-4">
          {brandGuide ? (
            <>
              {/* Brand overview */}
              {brandGuide.marca && (
                <div
                  className="p-5 rounded-xl"
                  style={{ background: "oklch(0.13 0.015 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#FF6B00" }}>
                    Identidad de marca
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {brandGuide.marca.nombre && (
                      <div>
                        <p className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 260)" }}>Nombre</p>
                        <p className="text-base font-bold font-display" style={{ color: "oklch(0.95 0.005 260)" }}>{brandGuide.marca.nombre}</p>
                      </div>
                    )}
                    {brandGuide.marca.slogan && (
                      <div>
                        <p className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 260)" }}>Slogan</p>
                        <p className="text-sm italic" style={{ color: "oklch(0.75 0.005 260)" }}>"{brandGuide.marca.slogan}"</p>
                      </div>
                    )}
                    {brandGuide.marca.mision && (
                      <div className="sm:col-span-2">
                        <p className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 260)" }}>Misión</p>
                        <p className="text-sm" style={{ color: "oklch(0.65 0.01 260)" }}>{brandGuide.marca.mision}</p>
                      </div>
                    )}
                    {brandGuide.marca.vision && (
                      <div className="sm:col-span-2">
                        <p className="text-xs mb-1" style={{ color: "oklch(0.50 0.01 260)" }}>Visión</p>
                        <p className="text-sm" style={{ color: "oklch(0.65 0.01 260)" }}>{brandGuide.marca.vision}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Color palette */}
              {brandGuide.paleta_cromatica && (
                <div
                  className="p-5 rounded-xl"
                  style={{ background: "oklch(0.13 0.015 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#FF6B00" }}>
                    Paleta cromática oficial
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {Object.entries(brandGuide.paleta_cromatica).map(([key, color]: [string, any]) => (
                      color?.hex && (
                        <button
                          key={key}
                          onClick={() => copyHex(color.hex)}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div
                            className="w-14 h-14 rounded-xl transition-transform group-hover:scale-105"
                            style={{ background: color.hex, boxShadow: `0 4px 12px ${color.hex}50` }}
                          />
                          <span className="text-xs font-mono" style={{ color: "oklch(0.55 0.01 260)" }}>{color.hex}</span>
                          <span className="text-xs text-center" style={{ color: "oklch(0.45 0.01 260)", maxWidth: "64px" }}>{color.nombre ?? key}</span>
                        </button>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Typography */}
              {brandGuide.tipografia && (
                <div
                  className="p-5 rounded-xl"
                  style={{ background: "oklch(0.13 0.015 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#FF6B00" }}>
                    Sistema tipográfico
                  </p>
                  <div className="space-y-3">
                    {Object.entries(brandGuide.tipografia).map(([key, font]: [string, any]) => (
                      font?.nombre && (
                        <div key={key} className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "oklch(0.65 0.18 200 / 0.1)", border: "1px solid oklch(0.65 0.18 200 / 0.2)" }}
                          >
                            <Type size={14} style={{ color: "#06B6D4" }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold" style={{ color: "oklch(0.85 0.005 260)", fontFamily: font.nombre }}>
                              {font.nombre}
                            </p>
                            <p className="text-xs" style={{ color: "oklch(0.50 0.01 260)" }}>
                              {key} · {font.uso}
                            </p>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Voice and tone */}
              {brandGuide.voz_tono && (
                <div
                  className="p-5 rounded-xl"
                  style={{ background: "oklch(0.13 0.015 260 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#FF6B00" }}>
                    Voz y tono de comunicación
                  </p>
                  {brandGuide.voz_tono.adjetivos && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {brandGuide.voz_tono.adjetivos.map((adj: string) => (
                        <span
                          key={adj}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: "oklch(0.65 0.22 40 / 0.10)", color: "#FF6B00", border: "1px solid oklch(0.65 0.22 40 / 0.25)" }}
                        >
                          {adj}
                        </span>
                      ))}
                    </div>
                  )}
                  {brandGuide.voz_tono.descripcion && (
                    <p className="text-sm" style={{ color: "oklch(0.65 0.01 260)" }}>{brandGuide.voz_tono.descripcion}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <BookOpen size={32} className="mx-auto mb-3" style={{ color: "oklch(0.30 0.01 260)" }} />
              <p className="text-sm" style={{ color: "oklch(0.50 0.01 260)" }}>
                Guía de marca en generación...
              </p>
            </div>
          )}
        </div>
      )}
    </PanelWrapper>
  );
}
