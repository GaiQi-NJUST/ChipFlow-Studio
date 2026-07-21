"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Search, Bell, User, Command as Cmd, Menu, PanelLeftClose, PanelLeftOpen, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore, type AppMode } from "@/stores/uiStore";
import { useProjectStore } from "@/stores/projectStore";

export function GlobalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, mode, setMode, leftSidebarOpen, toggleLeftSidebar, toggleCommandPalette } = useUIStore();
  const { projects, activeProjectId } = useProjectStore();
  const activeProject = projects.find((p) => p.id === activeProjectId);

  const isProjectRoute = pathname.includes("/flow/") || pathname.includes("/studio/");

  const handleModeSwitch = (m: AppMode) => {
    setMode(m);
    if (activeProjectId) {
      router.push(m === "flow" ? `/flow/${activeProjectId}` : `/studio/${activeProjectId}/pinmap`);
    }
  };

  return (
    <header className="h-14 shrink-0 border-b border-[var(--hairline)] bg-white/80 backdrop-blur-sm flex items-center px-3 gap-2 z-50">
      {/* Left: Logo + Sidebar toggle + Breadcrumb */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0 mr-1">
        <div className="w-7 h-7 rounded-md bg-[var(--brand-500)] flex items-center justify-center">
          <span className="text-white font-bold text-xs">CF</span>
        </div>
        <span className="font-semibold text-[15px] text-[var(--ink)] hidden sm:inline">
          ChipFlow
        </span>
      </Link>

      {isProjectRoute && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleLeftSidebar}>
          {leftSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </Button>
      )}

      {/* Mode Switcher (only when inside a project) */}
      {isProjectRoute && (
        <div className="flex items-center bg-[var(--canvas-2)] rounded-lg p-0.5 mx-2">
          <button
            onClick={() => handleModeSwitch("flow")}
            className={`px-3 py-1 text-[13px] rounded-md font-medium transition-all ${
              mode === "flow"
                ? "bg-white text-[var(--brand-600)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            Flow
          </button>
          <button
            onClick={() => handleModeSwitch("studio")}
            className={`px-3 py-1 text-[13px] rounded-md font-medium transition-all ${
              mode === "studio"
                ? "bg-white text-[var(--brand-600)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            Studio
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      {isProjectRoute && activeProject && (
        <div className="hidden md:flex items-center gap-1 text-[13px] text-[var(--muted)]">
          <span className="text-[var(--ink)] font-medium">{activeProject.name}</span>
          {mode === "studio" && (
            <>
              <span>/</span>
              <span className="text-[var(--brand-600)]">
                {pathname.split("/").pop()?.replace(/-/g, " ") ?? "pinmap"}
              </span>
            </>
          )}
        </div>
      )}

      <div className="flex-1" />

      {/* Right: Global search + actions */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-2 text-[var(--muted)] text-[13px] hidden md:flex"
        onClick={toggleCommandPalette}
      >
        <Search size={14} />
        <span>搜索项目、芯片、命令…</span>
        <kbd className="ml-4 text-[11px] bg-[var(--canvas-2)] px-1.5 py-0.5 rounded font-mono">
          ⌘K
        </kbd>
      </Button>

      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Bell size={16} />
      </Button>

      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      </Button>

      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
        <User size={16} />
      </Button>
    </header>
  );
}
