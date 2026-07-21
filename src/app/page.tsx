"use client";

import Link from "next/link";
import { ArrowRight, Cpu, CpuIcon, MessageSquare, CircuitBoard, GitBranch, Workflow, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: Cpu, title: "AI 芯片选型", desc: "自然语言描述需求，Agent 从 28 款 STM32 MCU 中智能推荐最佳方案" },
  { icon: MessageSquare, title: "Flow 对话工作台", desc: "像 Claude Code 一样的自然协作体验，需求澄清、方案讨论、计划制定" },
  { icon: CircuitBoard, title: "CubeMX 级引脚可视化", desc: "芯片封装 SVG 渲染，颜色编码，冲突智能检测，拖拽分配" },
  { icon: GitBranch, title: "23 个内置 Skill", desc: "覆盖方案选型、硬件设计、生产验证、固件开发全流程" },
  { icon: Workflow, title: "Proposal → Review → Apply", desc: "每次 AI 修改都可检查、可比较、可回退，工程师永远有最终控制权" },
  { icon: Zap, title: "STM32 HAL 代码生成", desc: "上下文感知的驱动代码生成，Monaco Editor 内 Diff 审查" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--canvas-0)]">
      {/* Nav */}
      <nav className="h-16 flex items-center justify-between px-6 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-500)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">CF</span>
          </div>
          <span className="font-semibold text-lg text-[var(--ink)]">ChipFlow Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">项目中心</Button>
          </Link>
          <Link href="/market">
            <Button variant="ghost" size="sm">Skills</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm">开始使用 <ArrowRight size={14} className="ml-1" /></Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6 max-w-[960px] mx-auto text-center">
        <Badge variant="secondary" className="mb-6 text-[13px] font-normal">
          AI-Native 芯片设计工作流平台 · STM32 MVP
        </Badge>
        <h1 className="text-[56px] leading-[1.1] font-bold tracking-tight text-[var(--ink)] mb-6">
          像 Claude Code 一样思考
          <br />
          <span className="text-[var(--brand-500)]">像 CubeMX 一样严谨</span>
        </h1>
        <p className="text-[18px] text-[var(--body)] max-w-[640px] mx-auto mb-10 leading-relaxed">
          面向嵌入式工程师的 AI 驱动硬件开发工作台。自然语言描述需求，
          Agent 自动完成芯片选型、管脚分配、原理图设计和固件生成。
        </p>
        <div className="flex items-center justify-center gap-3 mb-16">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 text-[15px]">开始新项目 <ArrowRight size={16} className="ml-1.5" /></Button>
          </Link>
          <Link href="/flow/demo-1">
            <Button variant="outline" size="lg" className="h-12 px-8 text-[15px]">查看演示 <ChevronRight size={16} className="ml-1" /></Button>
          </Link>
        </div>

        {/* Hero visual */}
        <div className="relative w-full max-w-[720px] mx-auto aspect-[2.2/1] bg-[var(--canvas-1)] rounded-2xl border border-[var(--hairline)] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-50)]/40 via-transparent to-transparent" />
          <div className="relative text-center">
            <CpuIcon size={64} className="text-[var(--brand-500)] mx-auto mb-3 opacity-80" />
            <p className="text-[var(--muted)] text-[14px] font-mono">
              STM32F407VET6 · LQFP-100 · Cortex-M4 · 168MHz
            </p>
            <p className="text-[var(--muted)]/60 text-[12px] mt-1">芯片封装预览区域 — 即将上线</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 max-w-[1080px] mx-auto">
        <h2 className="text-[28px] font-semibold text-center mb-12 text-[var(--ink)]">
          为嵌入式工程师设计的每一个细节
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="group p-6 rounded-xl bg-white border border-[var(--hairline)] hover:border-[var(--brand-500)]/30 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-[var(--brand-50)] flex items-center justify-center mb-4 group-hover:bg-[var(--brand-100)] transition-colors">
                <f.icon size={20} className="text-[var(--brand-500)]" />
              </div>
              <h3 className="font-semibold text-[16px] text-[var(--ink)] mb-2">{f.title}</h3>
              <p className="text-[14px] text-[var(--body)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Showcase */}
      <section className="py-16 px-6 max-w-[1080px] mx-auto">
        <div className="bg-[var(--canvas-1)] rounded-2xl p-10 border border-[var(--hairline)]">
          <h2 className="text-[24px] font-semibold text-center mb-3 text-[var(--ink)]">23 个内置 Skill，覆盖全流程</h2>
          <p className="text-center text-[var(--body)] mb-8 text-[15px]">从需求分析到 PCB 审查，每个环节都有 AI 深度辅助</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-[720px] mx-auto">
            {["/req 需求分析", "/chip-select 芯片选型", "/arch 架构设计", "/pinmap 管脚分配", "/clock 时钟树", "/power 电源设计", "/pcb PCB 布局", "/bom BOM 生成", "/driver 驱动生成", "/gerber Gerber 审查", "/si 信号完整性", "/emc EMC/EMI"].map((s) => (
              <div key={s} className="text-center py-2 px-3 text-[13px] font-mono text-[var(--body)] bg-white/60 rounded-md border border-[var(--hairline)] hover:border-[var(--brand-500)]/30 transition-colors">{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-[32px] font-semibold mb-4 text-[var(--ink)]">准备好开始你的下一个嵌入式项目了吗？</h2>
        <p className="text-[var(--body)] mb-8 text-[16px]">免费开始，内置 STM32 全系列 28 款 MCU 数据库</p>
        <Link href="/dashboard">
          <Button size="lg" className="h-12 px-10 text-[15px]">免费开始 <ArrowRight size={16} className="ml-1.5" /></Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--hairline)] text-center text-[13px] text-[var(--muted)]">
        ChipFlow Studio · AI-Native 芯片设计平台 · Powered by Claude
      </footer>
    </div>
  );
}
