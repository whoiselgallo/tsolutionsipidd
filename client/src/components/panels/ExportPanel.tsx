import { Download, FileImage, FileCode, FileJson, Package, Check } from "lucide-react";
import { toast } from "sonner";
import type { BriefingFormData } from "../../../../shared/brandData";
import type { GeneratedBrand } from "@/pages/Dashboard";
import PanelWrapper from "./PanelWrapper";

interface Props {
  briefing: BriefingFormData;
  generated: Partial<GeneratedBrand>;
  projectId?: number;
  onClose: () => void;
}

interface ExportItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  format: string;
  color: string;
  available: boolean;
  action: () => void;
}

export default function ExportPanel({ briefing, generated, projectId, onClose }: Props) {
  const brandName = briefing.nameSelected || briefing.brandName || "marca";

  // ── SVG Export ──────────────────────────────────────────────────────────────
  const exportSvg = () => {
    if (!generated.logoSvg) { toast.error("Genera el logotipo primero"); return; }
    const blob = new Blob([generated.logoSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandName}-logo.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Logo SVG descargado");
  };

  // ── PNG Export (via canvas) ─────────────────────────────────────────────────
  const exportPng = async (size: number = 512) => {
    if (!generated.logoSvg) { toast.error("Genera el logotipo primero"); return; }
    try {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size / 2;
      const ctx = canvas.getContext("2d")!;
      const img = new Image();
      const svgBlob = new Blob([generated.logoSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); resolve(); };
        img.onerror = reject;
        img.src = url;
      });
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${brandName}-logo-${size}px.png`;
        a.click();
        toast.success(`Logo PNG ${size}px descargado`);
      }, "image/png");
    } catch {
      toast.error("Error al exportar PNG");
    }
  };

  // ── JPEG Export ─────────────────────────────────────────────────────────────
  const exportJpeg = async () => {
    if (!generated.logoSvg) { toast.error("Genera el logotipo primero"); return; }
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 600;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const img = new Image();
      const svgBlob = new Blob([generated.logoSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); resolve(); };
        img.onerror = reject;
        img.src = url;
      });
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${brandName}-logo.jpg`;
        a.click();
        toast.success("Logo JPEG descargado");
      }, "image/jpeg", 0.95);
    } catch {
      toast.error("Error al exportar JPEG");
    }
  };

  // ── JSON Brand Data Export ──────────────────────────────────────────────────
  const exportJson = () => {
    const data = {
      brand: {
        name: brandName,
        briefing,
        concept: generated.concept,
        brandGuide: generated.brandGuide,
        generatedAt: new Date().toISOString(),
        version: "1.0",
        generator: "Brand Identity API — TSolutions IPIDD",
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${brandName}-brand-data.json`;
    a.click();
    toast.success("Datos de marca JSON descargados");
  };

  // ── Color Palette JSON ──────────────────────────────────────────────────────
  const exportColorPalette = () => {
    const concept = generated.concept;
    const palette = concept?.paleta_cromatica ?? {};
    const data = {
      brand: brandName,
      palette,
      primaryColors: briefing.primaryColors,
      secondaryColors: briefing.secondaryColors,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${brandName}-color-palette.json`;
    a.click();
    toast.success("Paleta de colores descargada");
  };

  // ── Brand Guide JSON ────────────────────────────────────────────────────────
  const exportBrandGuide = () => {
    if (!generated.brandGuide) { toast.error("Genera la guía de marca primero"); return; }
    const blob = new Blob([JSON.stringify(generated.brandGuide, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${brandName}-brand-guide.json`;
    a.click();
    toast.success("Guía de marca descargada");
  };

  // ── Figma JSON Export ───────────────────────────────────────────────────────
  const exportFigmaJson = () => {
    const concept = generated.concept;
    const figmaData = {
      name: `${brandName} Brand System`,
      version: "0.1.0",
      metadata: { generator: "Brand Identity API — TSolutions IPIDD", date: new Date().toISOString() },
      colors: concept?.paleta_cromatica
        ? Object.entries(concept.paleta_cromatica)
            .filter(([k, v]: any) => v?.hex)
            .map(([key, val]: any) => ({
              name: val.nombre || key,
              value: val.hex,
              type: "COLOR",
              description: val.uso || "",
            }))
        : [],
      typography: concept?.tipografia
        ? [
            { name: "Primary Font", fontFamily: concept.tipografia.principal?.nombre, fontWeight: "700", type: "TYPOGRAPHY" },
            { name: "Secondary Font", fontFamily: concept.tipografia.secundaria?.nombre, fontWeight: "400", type: "TYPOGRAPHY" },
          ]
        : [],
      logoSvg: generated.logoSvg || "",
    };
    const blob = new Blob([JSON.stringify(figmaData, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${brandName}-figma-tokens.json`;
    a.click();
    toast.success("Tokens Figma descargados");
  };

  // ── All in one ZIP (using multiple downloads) ───────────────────────────────
  const exportAll = async () => {
    toast.info("Descargando todos los archivos...");
    if (generated.logoSvg) exportSvg();
    await new Promise(r => setTimeout(r, 500));
    if (generated.logoSvg) await exportPng(1024);
    await new Promise(r => setTimeout(r, 500));
    exportJson();
    await new Promise(r => setTimeout(r, 500));
    exportColorPalette();
    if (generated.brandGuide) {
      await new Promise(r => setTimeout(r, 500));
      exportBrandGuide();
    }
    toast.success("¡Todos los archivos descargados!");
  };

  const hasLogo = !!generated.logoSvg;
  const hasConcept = !!generated.concept;
  const hasGuide = !!generated.brandGuide;

  const exportItems: ExportItem[] = [
    {
      id: "svg",
      icon: <FileCode size={20} />,
      title: "Logo SVG",
      description: "Vector escalable, editable en Illustrator, Figma, Inkscape",
      format: ".svg",
      color: "#FF6B00",
      available: hasLogo,
      action: exportSvg,
    },
    {
      id: "png-512",
      icon: <FileImage size={20} />,
      title: "Logo PNG 512px",
      description: "Transparente, ideal para web y redes sociales",
      format: ".png",
      color: "#06B6D4",
      available: hasLogo,
      action: () => exportPng(512),
    },
    {
      id: "png-1024",
      icon: <FileImage size={20} />,
      title: "Logo PNG 1024px",
      description: "Alta resolución para presentaciones e impresión",
      format: ".png",
      color: "#06B6D4",
      available: hasLogo,
      action: () => exportPng(1024),
    },
    {
      id: "jpeg",
      icon: <FileImage size={20} />,
      title: "Logo JPEG",
      description: "Fondo blanco, compatible con todos los programas",
      format: ".jpg",
      color: "#10B981",
      available: hasLogo,
      action: exportJpeg,
    },
    {
      id: "json-brand",
      icon: <FileJson size={20} />,
      title: "Datos de Marca JSON",
      description: "Briefing completo, concepto y guía en formato JSON",
      format: ".json",
      color: "#7C3AED",
      available: hasConcept,
      action: exportJson,
    },
    {
      id: "json-palette",
      icon: <FileJson size={20} />,
      title: "Paleta de Colores JSON",
      description: "Colores con HEX, uso y justificación",
      format: ".json",
      color: "#EC4899",
      available: hasConcept,
      action: exportColorPalette,
    },
    {
      id: "json-guide",
      icon: <FileJson size={20} />,
      title: "Guía de Marca JSON",
      description: "Manual de uso del logotipo, tipografía y tono",
      format: ".json",
      color: "#F59E0B",
      available: hasGuide,
      action: exportBrandGuide,
    },
    {
      id: "figma",
      icon: <FileJson size={20} />,
      title: "Tokens Figma JSON",
      description: "Design tokens compatibles con Figma y Style Dictionary",
      format: ".json",
      color: "#0EA5E9",
      available: hasConcept,
      action: exportFigmaJson,
    },
  ];

  return (
    <PanelWrapper title="Exportar Entregables" icon={<Download size={18} />} onClose={onClose} color="#06B6D4">
      <div className="space-y-4">
        {/* Export all button */}
        <div
          className="p-4 rounded-xl flex items-center justify-between"
          style={{ background: "oklch(0.06 0.18 195 / 0.08)", border: "1px solid oklch(0.06 0.18 195 / 0.3)" }}
        >
          <div>
            <p className="text-sm font-bold font-display" style={{ color: "oklch(0.85 0.005 260)" }}>
              Descargar todo el paquete de identidad
            </p>
            <p className="text-xs" style={{ color: "oklch(0.55 0.01 260)" }}>
              SVG + PNG 1024px + JSON de marca + Paleta + Guía
            </p>
          </div>
          <button
            onClick={exportAll}
            disabled={!hasLogo && !hasConcept}
            className="btn-neon flex items-center gap-2 text-sm flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
              boxShadow: "0 0 15px oklch(0.06 0.18 195 / 0.4)",
              opacity: (hasLogo || hasConcept) ? 1 : 0.5,
            }}
          >
            <Package size={16} />
            Descargar Todo
          </button>
        </div>

        {/* Individual exports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exportItems.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl flex items-center gap-4 transition-all"
              style={{
                background: item.available ? "oklch(0.13 0.015 260 / 0.6)" : "oklch(0.10 0.01 260 / 0.4)",
                border: `1px solid ${item.available ? "oklch(1 0 0 / 0.08)" : "oklch(1 0 0 / 0.04)"}`,
                opacity: item.available ? 1 : 0.5,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: item.available ? `${item.color}15` : "oklch(0.15 0.01 260)",
                  border: `1px solid ${item.available ? `${item.color}30` : "oklch(1 0 0 / 0.05)"}`,
                  color: item.available ? item.color : "oklch(0.35 0.01 260)",
                }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold" style={{ color: item.available ? "oklch(0.85 0.005 260)" : "oklch(0.45 0.01 260)" }}>
                    {item.title}
                  </p>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-mono"
                    style={{ background: `${item.color}15`, color: item.color }}
                  >
                    {item.format}
                  </span>
                  {item.available && <Check size={12} style={{ color: "#10B981" }} />}
                </div>
                <p className="text-xs truncate" style={{ color: "oklch(0.50 0.01 260)" }}>
                  {item.description}
                </p>
              </div>
              <button
                onClick={item.action}
                disabled={!item.available}
                className="flex-shrink-0 p-2 rounded-lg transition-all"
                style={{
                  background: item.available ? `${item.color}15` : "transparent",
                  border: `1px solid ${item.available ? `${item.color}30` : "transparent"}`,
                  color: item.available ? item.color : "oklch(0.30 0.01 260)",
                }}
                title={item.available ? `Descargar ${item.title}` : "Genera la identidad primero"}
              >
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>

        {!hasLogo && !hasConcept && (
          <div
            className="p-4 rounded-xl text-center"
            style={{ background: "oklch(0.65 0.22 40 / 0.05)", border: "1px solid oklch(0.65 0.22 40 / 0.2)" }}
          >
            <p className="text-sm" style={{ color: "oklch(0.60 0.01 260)" }}>
              Completa el briefing y genera la identidad de marca para habilitar las exportaciones
            </p>
          </div>
        )}
      </div>
    </PanelWrapper>
  );
}
