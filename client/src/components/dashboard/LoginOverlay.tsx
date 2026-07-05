import { LogIn, Zap, Shield, Sparkles } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function LoginOverlay() {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{
        background: "oklch(0.07 0.01 260 / 0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl text-center"
        style={{
          background: "oklch(0.12 0.015 260 / 0.95)",
          border: "1px solid oklch(0.65 0.22 40 / 0.5)",
          boxShadow: "0 0 40px oklch(0.65 0.22 40 / 0.2), 0 20px 60px oklch(0 0 0 / 0.5)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: "linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)",
            boxShadow: "0 0 30px oklch(0.65 0.22 40 / 0.5)",
          }}
        >
          <Zap size={28} className="text-black" />
        </div>

        <h2 className="text-2xl font-bold font-display mb-2" style={{ color: "oklch(0.95 0.005 260)" }}>
          Brand Identity API
        </h2>
        <p className="text-sm mb-1" style={{ color: "oklch(0.65 0.22 40)" }}>
          TSolutions IPIDD
        </p>
        <p className="text-sm mb-8" style={{ color: "oklch(0.60 0.01 260)" }}>
          Genera identidades de marca profesionales impulsadas por IA con personalización ≥89%
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <Sparkles size={16} />, text: "IA Avanzada" },
            { icon: <Shield size={16} />, text: "Proyectos guardados" },
            { icon: <Zap size={16} />, text: "Exportación múltiple" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl text-center"
              style={{
                background: "oklch(0.65 0.22 40 / 0.08)",
                border: "1px solid oklch(0.65 0.22 40 / 0.2)",
              }}
            >
              <div className="flex justify-center mb-1" style={{ color: "#FF6B00" }}>
                {item.icon}
              </div>
              <p className="text-xs font-medium" style={{ color: "oklch(0.70 0.01 260)" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <a
          href={getLoginUrl()}
          className="btn-neon w-full flex items-center justify-center gap-2 text-base"
          style={{ display: "flex" }}
        >
          <LogIn size={18} />
          Iniciar sesión para comenzar
        </a>

        <p className="text-xs mt-4" style={{ color: "oklch(0.45 0.01 260)" }}>
          Autenticación segura para Render + OpenAI
        </p>
      </div>
    </div>
  );
}
