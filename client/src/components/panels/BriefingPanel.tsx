import { useState } from "react";
import { X, ChevronRight, FileText, Building2, Target, Users } from "lucide-react";
import type { BriefingFormData } from "../../../../shared/brandData";
import { INDUSTRIES } from "../../../../shared/brandData";
import PanelWrapper from "./PanelWrapper";

interface Props {
  briefing: BriefingFormData;
  onUpdate: (data: Partial<BriefingFormData>) => void;
  onClose: () => void;
  onComplete: () => void;
}

export default function BriefingPanel({ briefing, onUpdate, onClose, onComplete }: Props) {
  const [subStep, setSubStep] = useState(0);

  const subSteps = [
    { icon: <FileText size={16} />, label: "Básico" },
    { icon: <Building2 size={16} />, label: "Industria" },
    { icon: <Target size={16} />, label: "Valores" },
    { icon: <Users size={16} />, label: "Público" },
  ];

  return (
    <PanelWrapper title="Briefing de Marca" icon={<FileText size={18} />} onClose={onClose} color="#FF6B00">
      {/* Sub-step tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {subSteps.map((s, i) => (
          <button
            key={i}
            onClick={() => setSubStep(i)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
            style={{
              background: subStep === i ? "oklch(0.65 0.22 40 / 0.15)" : "oklch(0.65 0.22 40 / 0.05)",
              border: `1px solid ${subStep === i ? "oklch(0.65 0.22 40 / 0.5)" : "oklch(1 0 0 / 0.06)"}`,
              color: subStep === i ? "#FF6B00" : "oklch(0.60 0.01 260)",
            }}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Step 0: Basic data */}
      {subStep === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
                Nombre de la marca *
              </label>
              <input
                className="neon-input"
                placeholder="Ej: TechNova, Lumina, Apex..."
                value={briefing.brandName}
                onChange={e => onUpdate({ brandName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
                Sector / Categoría
              </label>
              <input
                className="neon-input"
                placeholder="Ej: Tecnología, Salud, Moda..."
                value={briefing.sector}
                onChange={e => onUpdate({ sector: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
              Descripción del negocio
            </label>
            <textarea
              className="neon-input resize-none"
              rows={3}
              placeholder="¿Qué hace tu empresa? ¿Cuál es su propuesta de valor única?"
              value={briefing.description}
              onChange={e => onUpdate({ description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
              Palabras clave de la marca
            </label>
            <input
              className="neon-input"
              placeholder="Ej: innovación, confianza, velocidad, calidad..."
              value={briefing.keywords}
              onChange={e => onUpdate({ keywords: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
              Competidores principales
            </label>
            <input
              className="neon-input"
              placeholder="Ej: Apple, Nike, Spotify... (separados por coma)"
              value={briefing.competitors}
              onChange={e => onUpdate({ competitors: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Step 1: Industry */}
      {subStep === 1 && (
        <div>
          <p className="text-sm mb-4" style={{ color: "oklch(0.60 0.01 260)" }}>
            Selecciona la industria principal de tu marca:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {INDUSTRIES.map(ind => (
              <button
                key={ind.key}
                onClick={() => onUpdate({ industry: ind.key })}
                className="selectable-card text-left"
                style={{
                  borderColor: briefing.industry === ind.key ? "oklch(0.65 0.22 40)" : undefined,
                  background: briefing.industry === ind.key ? "oklch(0.65 0.22 40 / 0.08)" : undefined,
                }}
              >
                <div className="text-2xl mb-2">{ind.icon}</div>
                <p className="text-sm font-semibold leading-tight" style={{ color: "oklch(0.85 0.005 260)" }}>
                  {ind.nombre}
                </p>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: "oklch(0.50 0.01 260)" }}>
                  {ind.descripcion}
                </p>
              </button>
            ))}
          </div>
          {briefing.industry === "otro" && (
            <div className="mt-4">
              <input
                className="neon-input"
                placeholder="Describe tu industria personalizada..."
                value={briefing.industryCustom}
                onChange={e => onUpdate({ industryCustom: e.target.value })}
              />
            </div>
          )}
        </div>
      )}

      {/* Step 2: Values */}
      {subStep === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
              Valores de la marca
            </label>
            <textarea
              className="neon-input resize-none"
              rows={3}
              placeholder="Ej: Innovación, Transparencia, Sostenibilidad, Excelencia..."
              value={briefing.values}
              onChange={e => onUpdate({ values: e.target.value })}
            />
            <p className="text-xs mt-1" style={{ color: "oklch(0.45 0.01 260)" }}>
              Los valores definen la personalidad y el carácter de tu marca
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
              ¿Qué diferencia a tu marca de la competencia?
            </label>
            <textarea
              className="neon-input resize-none"
              rows={3}
              placeholder="Describe tu ventaja competitiva única..."
              value={briefing.differentiation}
              onChange={e => onUpdate({ differentiation: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Step 3: Target audience */}
      {subStep === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
                Rango de edad
              </label>
              <select
                className="neon-input"
                value={briefing.targetAge}
                onChange={e => onUpdate({ targetAge: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                <option value="13-17">13-17 años (Gen Z joven)</option>
                <option value="18-24">18-24 años (Gen Z)</option>
                <option value="25-34">25-34 años (Millennials)</option>
                <option value="35-44">35-44 años (Millennials mayores)</option>
                <option value="45-54">45-54 años (Gen X)</option>
                <option value="55+">55+ años (Baby Boomers)</option>
                <option value="todos">Todas las edades</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
                Género
              </label>
              <select
                className="neon-input"
                value={briefing.targetGender}
                onChange={e => onUpdate({ targetGender: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                <option value="masculino">Principalmente masculino</option>
                <option value="femenino">Principalmente femenino</option>
                <option value="todos">Todos los géneros</option>
                <option value="no_binario">No binario / diverso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
                Ubicación geográfica
              </label>
              <input
                className="neon-input"
                placeholder="Ej: México, LATAM, Global..."
                value={briefing.targetLocation}
                onChange={e => onUpdate({ targetLocation: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
                Nivel socioeconómico
              </label>
              <select
                className="neon-input"
                value={briefing.targetIncome}
                onChange={e => onUpdate({ targetIncome: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                <option value="bajo">Bajo (A/B)</option>
                <option value="medio_bajo">Medio-Bajo (C-)</option>
                <option value="medio">Medio (C)</option>
                <option value="medio_alto">Medio-Alto (C+)</option>
                <option value="alto">Alto (A/B)</option>
                <option value="premium">Premium / Lujo</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
              Intereses y comportamientos
            </label>
            <textarea
              className="neon-input resize-none"
              rows={2}
              placeholder="Ej: tecnología, viajes, fitness, sustentabilidad..."
              value={briefing.targetInterests}
              onChange={e => onUpdate({ targetInterests: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.01 260)" }}>
              Pain points / Problemas que resuelves
            </label>
            <textarea
              className="neon-input resize-none"
              rows={2}
              placeholder="¿Qué problema principal resuelve tu marca para este público?"
              value={briefing.targetPain}
              onChange={e => onUpdate({ targetPain: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid oklch(1 0 0 / 0.06)" }}>
        <button
          onClick={() => subStep > 0 ? setSubStep(s => s - 1) : onClose()}
          className="btn-neon-outline text-sm py-2 px-4"
        >
          {subStep > 0 ? "← Anterior" : "Cerrar"}
        </button>
        <div className="flex gap-1">
          {subSteps.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === subStep ? "#FF6B00" : i < subStep ? "#10B981" : "oklch(0.30 0.01 260)",
                boxShadow: i === subStep ? "0 0 6px #FF6B00" : undefined,
              }}
            />
          ))}
        </div>
        {subStep < subSteps.length - 1 ? (
          <button
            onClick={() => setSubStep(s => s + 1)}
            className="btn-neon text-sm py-2 px-4 flex items-center gap-2"
          >
            Siguiente <ChevronRight size={15} />
          </button>
        ) : (
          <button
            onClick={onComplete}
            disabled={!briefing.brandName}
            className="btn-neon text-sm py-2 px-4 flex items-center gap-2"
            style={{ opacity: briefing.brandName ? 1 : 0.5 }}
          >
            Continuar con Colores <ChevronRight size={15} />
          </button>
        )}
      </div>
    </PanelWrapper>
  );
}
