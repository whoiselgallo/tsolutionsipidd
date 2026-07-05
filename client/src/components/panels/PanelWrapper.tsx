import { X } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  onClose: () => void;
  color?: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function PanelWrapper({ title, icon, onClose, color = "#FF6B00", children, maxWidth }: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden panel-enter"
      style={{
        background: "oklch(0.11 0.012 260 / 0.95)",
        border: `1px solid ${color}40`,
        boxShadow: `0 0 30px ${color}15, 0 20px 60px oklch(0 0 0 / 0.4)`,
        backdropFilter: "blur(24px)",
        maxWidth: maxWidth,
      }}
    >
      {/* Panel Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: `1px solid ${color}20`,
          background: `linear-gradient(135deg, ${color}08 0%, transparent 100%)`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: `${color}20`,
              border: `1px solid ${color}40`,
              color: color,
            }}
          >
            {icon}
          </div>
          <h3 className="font-bold font-display text-base" style={{ color: "oklch(0.95 0.005 260)" }}>
            {title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "oklch(1 0 0 / 0.05)",
            border: "1px solid oklch(1 0 0 / 0.08)",
            color: "oklch(0.50 0.01 260)",
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Panel Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
