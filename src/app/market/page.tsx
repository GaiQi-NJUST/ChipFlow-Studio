"use client";

import Link from "next/link";
import { ArrowLeft, Cpu, Search, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/shell/AppShell";

const skills = [
  { category: "方案与选型", items: [
    { name: "/req", desc: "需求分析", icon: "📋" },
    { name: "/chip-select", desc: "芯片选型", icon: "🔍" },
    { name: "/arch", desc: "架构设计", icon: "🏗️" },
    { name: "/compare", desc: "方案对比", icon: "⚖️" },
    { name: "/research", desc: "技术调研", icon: "📚" },
    { name: "/risk", desc: "风险分析", icon: "⚠️" },
  ]},
  { category: "硬件设计", items: [
    { name: "/schematic", desc: "原理图设计", icon: "📐" },
    { name: "/pinmap", desc: "管脚分配", icon: "📌" },
    { name: "/clock", desc: "时钟树配置", icon: "🕐" },
    { name: "/power", desc: "电源设计", icon: "⚡" },
    { name: "/pcb", desc: "PCB 布局", icon: "🟩" },
    { name: "/si", desc: "信号完整性", icon: "〰️" },
    { name: "/emc", desc: "EMC/EMI", icon: "🛡️" },
    { name: "/thermal", desc: "热分析", icon: "🌡️" },
  ]},
  { category: "生产与验证", items: [
    { name: "/bom", desc: "BOM 生成", icon: "📊" },
    { name: "/cost", desc: "成本估算", icon: "💰" },
    { name: "/procure", desc: "元件采购", icon: "🛒" },
    { name: "/gerber", desc: "Gerber 审查", icon: "📄" },
    { name: "/dfm", desc: "DFM 检查", icon: "✅" },
    { name: "/testpoint", desc: "测试点规划", icon: "🔬" },
  ]},
  { category: "固件与软件", items: [
    { name: "/driver", desc: "外设驱动生成", icon: "💻" },
    { name: "/rtos", desc: "RTOS 配置", icon: "⏱️" },
    { name: "/bootloader", desc: "Bootloader 设计", icon: "🚀" },
  ]},
];

export default function MarketPage() {
  return (
    <AppShell>
      <div className="max-w-[1080px] mx-auto p-6 pt-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button>
          </Link>
          <div>
            <h1 className="text-[28px] font-semibold text-[var(--ink)]">Skill 中心</h1>
            <p className="text-[15px] text-[var(--body)]">23 个内置 Skill，覆盖硬件开发全流程</p>
          </div>
        </div>

        <Input placeholder="搜索 Skill…" className="max-w-[400px] mb-8" />

        <div className="space-y-8">
          {skills.map((group) => (
            <div key={group.category}>
              <h2 className="text-[16px] font-semibold text-[var(--ink)] mb-3">{group.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.items.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[var(--hairline)] hover:border-[var(--brand-500)]/30 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <span className="text-2xl">{skill.icon}</span>
                    <div>
                      <div className="font-mono text-[14px] font-medium text-[var(--ink)]">{skill.name}</div>
                      <div className="text-[12px] text-[var(--body)]">{skill.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
