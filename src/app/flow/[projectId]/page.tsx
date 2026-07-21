"use client";

import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, SlidersHorizontal, Mic, StopCircle, Sparkles, Cpu, FileCode, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectStore } from "@/stores/projectStore";
import { useUIStore } from "@/stores/uiStore";

type PermissionMode = "manual" | "accept" | "plan" | "bypass";
type Message = { role: "user" | "ai"; content: string; timestamp: number };

const demoConversation: Message[] = [
  { role: "user", content: "我要做一个智能灌溉控制器，太阳能供电，需要低功耗，采集土壤湿度和环境温度，通过无线模块上报数据", timestamp: Date.now() - 300000 },
  { role: "ai", content: "🔍 正在分析需求…\n\n✅ **提取关键约束：**\n- 电源：太阳能 + 电池供电 → 需要低功耗 MCU\n- 传感器：土壤湿度 (ADC) + 环境温度 (I2C/I2C)\n- 无线通信：需要 UART 接口连接无线模块\n- GPIO：至少 8 个（控制继电器、指示灯等）\n- ADC：至少 2 通道\n\n📊 搜索 STM32 数据库…\n\n推荐 **STM32L431CBT6**：\n- 超低功耗 Cortex-M4 @ 80MHz\n- 128KB Flash + 64KB RAM\n- 12bit ADC × 10ch\n- 3× UART, 3× I2C, 3× SPI\n- ¥18.5\n\n要我详细对比其他候选芯片，还是直接采用 STM32L431？", timestamp: Date.now() - 280000 },
  { role: "user", content: "就 STM32L431 吧！帮我做管脚分配 /pinmap", timestamp: Date.now() - 200000 },
  { role: "ai", content: "✅ 已锁定芯片：STM32L431CBT6 (LQFP-48)\n\n🦶 正在分配管脚…\n\n| 外设 | 功能 | 分配引脚 | 状态 |\n|------|------|---------|------|\n| ADC1_IN1 | 土壤湿度 | PA0 | ✅ |\n| I2C1_SCL | 温度传感器 | PB6 | ✅ |\n| I2C1_SDA | 温度传感器 | PB7 | ✅ |\n| USART2_TX | 无线模块 | PA2 | ⚠️ 与 ADC_IN2 冲突 |\n| GPIO_OUT | 继电器1 | PC13 | ✅ |\n| GPIO_OUT | LED | PA5 | ✅ |\n\n⚠️ **检测到 1 个冲突：** PA2 同时被 USART2_TX 和 ADC_IN2 占用\n💡 **建议：** USART2_TX 移到 PA9（默认 USART1_TX），释放 PA2 给 ADC_IN2\n\n[查看管脚画布 →] [接受建议] [手动调整]", timestamp: Date.now() - 180000 },
];

const permissionModes: { value: PermissionMode; label: string; desc: string }[] = [
  { value: "manual", label: "Manual", desc: "每次修改都单独询问" },
  { value: "accept", label: "Accept Edits", desc: "生成草稿，应用前批准" },
  { value: "plan", label: "Plan", desc: "只分析，不写入工程" },
  { value: "bypass", label: "Bypass", desc: "直接执行已授权操作" },
];

export default function FlowPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const { projects } = useProjectStore();
  const { mode, setMode } = useUIStore();
  const project = projects.find((p) => p.id === projectId);

  const [messages, setMessages] = useState<Message[]>(demoConversation);
  const [input, setInput] = useState("");
  const [permMode, setPermMode] = useState<PermissionMode>("plan");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMode("flow");
  }, [setMode]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: Message = { role: "user", content: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "💡 这是一个 **演示模式**。在生产环境中，这里会连接到 Claude API，实现完整的 AI Agent 对话能力。\n\n你可以尝试：\n- `/chip-select` 搜索芯片\n- `/pinmap` 分配管脚\n- `/arch` 设计系统架构\n- `/bom` 生成 BOM 清单",
          timestamp: Date.now(),
        },
      ]);
      setIsStreaming(false);
    }, 1500);
  };

  return (
    <div className="h-full flex">
      {/* Left Sidebar — Conversations */}
      <aside className="w-72 shrink-0 border-r border-[var(--hairline)] bg-[var(--canvas-1)] flex flex-col">
        <div className="p-3 border-b border-[var(--hairline)]">
          <Button variant="ghost" size="sm" className="w-full justify-start text-[13px] gap-2">
            <Sparkles size={14} />
            新建会话
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="text-[11px] uppercase tracking-wider text-[var(--muted)] px-2 py-1">
              {project?.name ?? "项目"}
            </div>
            {["需求分析与芯片选型", "Pinmap 冲突方案", "低功耗策略讨论"].map((title, i) => (
              <div
                key={title}
                className={`px-3 py-2 rounded-md cursor-pointer text-[13px] transition-colors ${
                  i === 0
                    ? "bg-[var(--canvas-2)] text-[var(--ink)] font-medium"
                    : "text-[var(--body)] hover:bg-[var(--canvas-2)]"
                }`}
              >
                {title}
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Center — Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-14 shrink-0 border-b border-[var(--hairline)] flex items-center px-4 gap-2">
          <h2 className="font-medium text-[15px] text-[var(--ink)] truncate">
            需求分析与芯片选型
          </h2>
          {project && (
            <Badge variant="secondary" className="text-[11px] font-normal">
              {project.name}
            </Badge>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="max-w-[960px] mx-auto py-6 px-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === "user" ? "flex justify-end" : ""}`}>
                <div
                  className={`max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-[var(--canvas-2)] text-[var(--ink)] rounded-2xl rounded-br-md px-5 py-3"
                      : "text-[var(--ink)]"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div
                      className="text-[15px] leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br/>")
                          .replace(/✅/g, '<span class="text-green-600">✅</span>')
                          .replace(/⚠️/g, '<span class="text-amber-500">⚠️</span>')
                          .replace(/💡/g, '<span class="text-blue-500">💡</span>')
                          .replace(/🔍/g, "🔍")
                          .replace(/📊/g, "📊")
                          .replace(/🦶/g, "🦶"),
                      }}
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Streaming indicator */}
            {isStreaming && (
              <div className="flex items-center gap-2 text-[var(--muted)] text-[14px]">
                <Sparkles size={14} className="animate-pulse text-[var(--brand-500)]" />
                AI 正在思考…
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="shrink-0 border-t border-[var(--hairline)] bg-white/80 backdrop-blur-sm">
          <div className="max-w-[1040px] mx-auto p-4">
            {/* Permission Mode */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {permissionModes.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPermMode(m.value)}
                    className={`px-2.5 py-1 text-[12px] rounded-md transition-all ${
                      permMode === m.value
                        ? "bg-[var(--canvas-2)] text-[var(--ink)] font-medium"
                        : "text-[var(--muted)] hover:text-[var(--body)]"
                    }`}
                    title={m.desc}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              {permMode === "plan" && (
                <Badge variant="secondary" className="text-[10px] bg-[var(--brand-50)] text-[var(--brand-600)] border-0">
                  Plan mode：不会修改工程
                </Badge>
              )}
            </div>

            {/* Input */}
            <div className="flex items-end gap-2 bg-white border border-[var(--hairline)] rounded-2xl p-3 focus-within:border-[var(--brand-500)] focus-within:ring-2 focus-within:ring-[var(--brand-500)]/20 transition-all">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Paperclip size={16} />
              </Button>
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="输入消息，或使用 / 调用 Skill…"
                className="flex-1 border-0 shadow-none resize-none min-h-[40px] max-h-[200px] text-[15px] bg-transparent focus-visible:ring-0 p-0"
                rows={1}
              />
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 rounded-xl"
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
              >
                {isStreaming ? <StopCircle size={16} /> : <Send size={16} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar — Project brief (collapsed in Flow) */}
      <aside className="w-64 shrink-0 border-l border-[var(--hairline)] bg-[var(--canvas-1)] p-4 hidden xl:block">
        <h3 className="text-[13px] font-semibold text-[var(--ink)] mb-3">项目概要</h3>
        {project ? (
          <div className="space-y-3 text-[13px]">
            <div>
              <span className="text-[var(--muted)]">目标芯片</span>
              <p className="font-mono text-[var(--ink)]">{project.targetMCU ?? "未选定"}</p>
            </div>
            <div>
              <span className="text-[var(--muted)]">阶段</span>
              <p className="text-[var(--ink)]">{project.stage}</p>
            </div>
            <div>
              <span className="text-[var(--muted)]">已用 Skills</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.skillsUsed.map((s) => (
                  <span key={s} className="text-[11px] font-mono text-[var(--brand-600)] bg-[var(--brand-50)] px-1.5 py-0.5 rounded">
                    /{s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[var(--muted)] text-[13px]">未加载项目</p>
        )}
      </aside>
    </div>
  );
}
