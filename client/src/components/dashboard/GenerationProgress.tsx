import { Sparkles } from "lucide-react";

interface Props {
  step: string;
  progress: number;
}

export default function GenerationProgress({ step, progress }: Props) {
  return (
    <div
      className="mb-6 p-4 rounded-xl border"
      style={{
        background: "oklch(0.13 0.015 260 / 0.9)",
        borderColor: "oklch(0.65 0.22 40 / 0.5)",
        boxShadow: "0 0 20px oklch(0.65 0.22 40 / 0.2)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "oklch(0.65 0.22 40 / 0.2)", border: "1px solid oklch(0.65 0.22 40 / 0.4)" }}
        >
          <Sparkles size={16} style={{ color: "#FF6B00" }} className="animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold font-display" style={{ color: "oklch(0.95 0.005 260)" }}>
            Generando identidad de marca con IA
          </p>
          <p className="text-xs truncate" style={{ color: "oklch(0.65 0.22 40)" }}>
            {step || "Iniciando..."}
          </p>
        </div>
        <span className="text-sm font-bold font-mono flex-shrink-0" style={{ color: "#FF6B00" }}>
          {progress}%
        </span>
      </div>
      <div className="neon-progress">
        <div
          className="neon-progress-bar"
          style={{ width: `${progress}%`, transition: "width 0.8s cubic-bezier(0.23, 1, 0.32, 1)" }}
        />
      </div>
    </div>
  );
}
