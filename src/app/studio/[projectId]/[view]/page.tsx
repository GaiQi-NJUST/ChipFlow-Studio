"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Cpu, Code2, Clock3, CircuitBoard, Table2, Layers, FolderGit2, File, FileCode, ChevronRight, ChevronDown, Terminal, AlertTriangle, Info, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/stores/projectStore";
import { useUIStore } from "@/stores/uiStore";

type StudioTab = "pinmap" | "code" | "clock" | "schematic" | "pcb" | "bom";

const tabs: { id: StudioTab; label: string; icon: React.ElementType }[] = [
  { id: "pinmap", label: "Pinmap", icon: Cpu },
  { id: "code", label: "Code", icon: Code2 },
  { id: "clock", label: "Clock", icon: Clock3 },
  { id: "schematic", label: "Schematic", icon: CircuitBoard },
  { id: "pcb", label: "PCB", icon: Layers },
  { id: "bom", label: "BOM", icon: Table2 },
];

export default function StudioPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const viewParam = params?.view as string;
  const { projects } = useProjectStore();
  const { setMode, rightSidebarOpen, toggleRightSidebar } = useUIStore();
  const project = projects.find((p) => p.id === projectId);
  const [activeTab, setActiveTab] = useState<StudioTab>(
    (tabs.find((t) => t.id === viewParam)?.id as StudioTab) ?? "pinmap",
  );

  const TabIcon = tabs.find((t) => t.id === activeTab)?.icon ?? Cpu;

  return (
    <div className="h-full flex">
      {/* Left Sidebar — Project Explorer */}
      <aside className="w-64 shrink-0 border-r border-[var(--hairline)] bg-[var(--canvas-1)] flex flex-col">
        <div className="p-3 border-b border-[var(--hairline)]">
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">
            {project?.name ?? "Project"}
          </h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {[
              { id: "src", label: "Src", children: ["main.c", "stm32l4xx_it.c", "gpio.c"] },
              { id: "inc", label: "Inc", children: ["main.h", "stm32l4xx_it.h", "gpio.h"] },
              { id: "hardware", label: "Hardware", children: ["Schematic", "Clock", "Power"] },
              { id: "docs", label: "Docs", children: ["STM32L431-DS.pdf", "ref-manual.pdf"] },
            ].map((folder) => (
              <div key={folder.id} className="mb-1">
                <div className="flex items-center gap-1 px-2 py-1 text-[12px] font-medium text-[var(--ink)] cursor-pointer hover:bg-[var(--canvas-2)] rounded">
                  <ChevronDown size={12} />
                  <FolderGit2 size={14} className="text-amber-500" />
                  {folder.label}
                </div>
                {folder.children.map((file) => (
                  <div
                    key={file}
                    className="flex items-center gap-1 pl-7 pr-2 py-1 text-[12px] text-[var(--body)] cursor-pointer hover:bg-[var(--canvas-2)] rounded ml-2"
                    onClick={() => file.endsWith(".c") || file.endsWith(".h") ? setActiveTab("code") : null}
                  >
                    {file.endsWith(".c") || file.endsWith(".h") ? (
                      <FileCode size={12} className="text-blue-500" />
                    ) : (
                      <File size={12} className="text-[var(--muted)]" />
                    )}
                    {file}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Center — Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tab Bar */}
        <div className="h-9 shrink-0 border-b border-[var(--hairline)] flex items-center bg-[var(--canvas-1)] overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 h-full text-[12px] border-r border-[var(--hairline)] transition-colors shrink-0 ${
                activeTab === tab.id
                  ? "bg-white text-[var(--ink)] font-medium border-t-2 border-t-[var(--brand-500)]"
                  : "text-[var(--body)] hover:bg-[var(--canvas-2)]"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
          <div className="flex-1" />
        </div>

        {/* Canvas Content */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--brand-50)] flex items-center justify-center mb-4">
              <TabIcon size={28} className="text-[var(--brand-500)]" />
            </div>
            <h3 className="text-[18px] font-semibold text-[var(--ink)] mb-2">
              {tabs.find((t) => t.id === activeTab)?.label} 画布
            </h3>
            <p className="text-[14px] text-[var(--body)] max-w-[400px] mb-4">
              此区域将渲染专业的工程编辑器——芯片封装 SVG、Monaco 代码编辑器、时钟树、原理图或 BOM 表格。
            </p>
            <Badge variant="secondary" className="text-[12px]">
              Phase 1 MVP — 即将实现
            </Badge>
          </div>
        </div>

        {/* Bottom Output Drawer */}
        <div className="h-32 shrink-0 border-t border-[var(--hairline)] bg-[var(--canvas-1)]">
          <div className="flex items-center gap-2 px-3 h-8 border-b border-[var(--hairline)] text-[11px]">
            {["Problems", "Skill Log", "Terminal", "Simulation"].map((label, i) => (
              <button
                key={label}
                className={`px-2 py-1 rounded transition-colors ${i === 0 ? "bg-white text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--body)]"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-2 text-[12px] text-[var(--muted)] font-mono">
            <span className="text-amber-500">⚠</span> Pin conflict: PA2 (USART2_TX vs ADC_IN2) — <span className="text-[var(--brand-600)] cursor-pointer hover:underline">resolve</span>
            <br />
            <span className="text-green-600">✓</span> STM32L431CBT6 validated — 128KB Flash, 64KB RAM
          </div>
        </div>
      </div>

      {/* Right AI Sidebar */}
      {rightSidebarOpen && (
        <aside className="w-80 shrink-0 border-l border-[var(--hairline)] bg-[var(--canvas-1)] flex flex-col">
          <div className="flex items-center justify-between px-3 h-10 border-b border-[var(--hairline)]">
            <span className="text-[13px] font-medium text-[var(--ink)]">AI 协作</span>
            <div className="flex gap-1">
              {["Chat", "Skills", "Refs"].map((label) => (
                <button
                  key={label}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors ${label === "Chat" ? "bg-white text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--body)]"}`}
                >
                  {label}
                </button>
              ))}
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={toggleRightSidebar}>
                <X size={12} />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="text-[13px] text-[var(--body)] space-y-2">
              <p className="text-[var(--muted)] text-[12px]">当前上下文：{tabs.find((t) => t.id === activeTab)?.label}</p>
              <p>选中 AI 对话或点击 Skill 来操作当前画布。</p>
            </div>
          </ScrollArea>
          <div className="p-2 border-t border-[var(--hairline)]">
            <div className="flex gap-1">
              <Textarea
                placeholder="询问当前画布…"
                className="flex-1 border-[var(--hairline)] text-[13px] h-8 min-h-0 resize-none"
                rows={1}
              />
              <Button size="icon" className="h-8 w-8 shrink-0 rounded-lg">
                <Send size={14} />
              </Button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
