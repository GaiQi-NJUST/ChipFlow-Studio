"use client";

import { useUIStore } from "@/stores/uiStore";
import { useProjectStore } from "@/stores/projectStore";
import { Circle, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export function StatusBar() {
  const { mode } = useUIStore();
  const { projects, activeProjectId } = useProjectStore();
  const project = projects.find((p) => p.id === activeProjectId);
  const mcuName = project?.targetMCU ?? "—";

  return (
    <footer className="h-7 shrink-0 border-t border-[var(--hairline)] bg-[var(--canvas-1)] flex items-center px-3 gap-4 text-[11px] text-[var(--muted)] select-none">
      <span className="flex items-center gap-1.5">
        <Circle size={8} className="text-green-500 fill-green-500" />
        已同步
      </span>
      <span className="hidden sm:block">{project?.name ?? "无项目"} · {mcuName}</span>
      <span className="hidden md:block">
        {mode === "flow" ? "Flow · 方案讨论" : "Studio · 工程编辑"}
      </span>
      <span className="flex items-center gap-1 hidden lg:flex">
        <AlertTriangle size={10} className="text-[var(--warning)]" />
        2 conflicts
      </span>
      <span className="flex items-center gap-1 ml-auto">
        <span className="hidden sm:inline">Claude Opus 4.8</span>
        <Circle size={6} className="text-green-500 fill-green-500" />
      </span>
    </footer>
  );
}
