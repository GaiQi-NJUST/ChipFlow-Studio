"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, MoreHorizontal, FolderGit2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useProjectStore, type Project } from "@/stores/projectStore";
import { AppShell } from "@/components/shell/AppShell";

const stageLabels: Record<Project["stage"], string> = {
  init: "需求阶段",
  planning: "方案阶段",
  design: "设计阶段",
  review: "审查阶段",
  done: "已完成",
};

const stageColors: Record<Project["stage"], string> = {
  init: "bg-gray-100 text-gray-600",
  planning: "bg-blue-50 text-blue-600",
  design: "bg-[var(--brand-50)] text-[var(--brand-600)]",
  review: "bg-amber-50 text-amber-600",
  done: "bg-green-50 text-green-600",
};

export default function DashboardPage() {
  const router = useRouter();
  const { projects, setActiveProject } = useProjectStore();
  const [search, setSearch] = useState("");

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.targetMCU ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const openProject = (p: Project) => {
    setActiveProject(p.id);
    router.push(`/flow/${p.id}`);
  };

  return (
    <AppShell>
      <div className="max-w-[1080px] mx-auto p-6 pt-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-semibold text-[var(--ink)] mb-1">项目中心</h1>
            <p className="text-[15px] text-[var(--body)]">
              管理你的嵌入式工程，或从自然语言描述开始一个新项目
            </p>
          </div>
          <Button className="gap-1.5 h-10" onClick={() => {
            const id = `proj-${Date.now()}`;
            useProjectStore.getState().addProject({
              id, name: "新项目", description: "",
              targetMCU: null, package: null, stage: "init",
              createdAt: Date.now(), updatedAt: Date.now(), skillsUsed: [],
            });
            setActiveProject(id);
            router.push(`/flow/${id}`);
          }}>
            <Plus size={16} /> 新建项目
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            placeholder="搜索项目名称、芯片型号…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 max-w-[480px]"
          />
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card
              key={p.id}
              className="p-5 cursor-pointer hover:border-[var(--brand-500)]/40 hover:shadow-sm transition-all group"
              onClick={() => openProject(p)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--brand-50)] flex items-center justify-center group-hover:bg-[var(--brand-100)] transition-colors">
                  <FolderGit2 size={20} className="text-[var(--brand-500)]" />
                </div>
                <Badge className={`text-[11px] font-normal ${stageColors[p.stage]}`}>
                  {stageLabels[p.stage]}
                </Badge>
              </div>
              <h3 className="font-semibold text-[16px] text-[var(--ink)] mb-1">{p.name}</h3>
              <p className="text-[13px] text-[var(--body)] mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center gap-2 text-[12px] text-[var(--muted)]">
                {p.targetMCU && (
                  <span className="font-mono bg-[var(--canvas-2)] px-1.5 py-0.5 rounded">
                    {p.targetMCU}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(p.updatedAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              {p.skillsUsed.length > 0 && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {p.skillsUsed.map((s) => (
                    <span key={s} className="text-[11px] font-mono text-[var(--brand-600)] bg-[var(--brand-50)] px-1.5 py-0.5 rounded">
                      /{s}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center text-[13px] text-[var(--brand-600)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                打开项目 <ArrowRight size={14} className="ml-1" />
              </div>
            </Card>
          ))}

          {/* New Project Card */}
          <Card
            className="p-5 border-dashed border-2 border-[var(--hairline)] flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-[var(--brand-500)]/40 hover:bg-[var(--brand-50)]/20 transition-all"
            onClick={() => {
              const id = `proj-${Date.now()}`;
              useProjectStore.getState().addProject({
                id, name: "新项目", description: "",
                targetMCU: null, package: null, stage: "init",
                createdAt: Date.now(), updatedAt: Date.now(), skillsUsed: [],
              });
              setActiveProject(id);
              router.push(`/flow/${id}`);
            }}
          >
            <Plus size={28} className="text-[var(--muted)] mb-2" />
            <span className="text-[14px] text-[var(--muted)]">新建项目</span>
            <span className="text-[12px] text-[var(--muted)]/60 mt-1">从自然语言描述开始</span>
          </Card>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <FolderGit2 size={40} className="text-[var(--muted)] mx-auto mb-3 opacity-40" />
            <p className="text-[var(--muted)]">没有找到匹配的项目</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
