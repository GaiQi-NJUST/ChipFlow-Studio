# ChipFlow Studio — Claude Code 风格 AI-Native 芯片设计平台 SPEC v1.0

## Context

用户需求：构建一个类似 STM32CubeMX 的在线 Web 应用，核心差异化在于内置 AI Agent（像 Claude Code 一样智能），拥有 23 个 Skill 覆盖从方案分析→芯片选型→管脚分配→原理图→PCB→BOM→固件代码生成的完整硬件开发流程。

**用户确认的关键决策：**
- 产出层级：仅设计方案（SPEC 文档）
- 引脚可视化：CubeMX 级别（芯片封装俯视图 + 颜色标记 + 拖拽分配 + 冲突检测）
- MCU 生态：MVP 仅 STM32 全系列
- 需支持固件代码编辑和工程管理

**两份输入文档：**
- v0.1 SPEC（ChipFlow-Studio-SPEC.md）：Industrial Dark 主题 + 固定三栏布局 + 22(实际23)个 Skill
- v0.2 重构方案（用户提供）：Claude 暖色调 + Flow/Studio 双模式 + AI 为核心交互范式 + 完整的可访问性/性能/安全规范

**v0.1 → v0.2 关键冲突与结论：**
| 维度 | v0.1 | v0.2 | 结论 |
|------|------|------|------|
| 视觉风格 | Industrial Dark (#0a0e27) | Claude 暖色画布 (#faf9f5) | ✅ 采用 v0.2 |
| 布局架构 | 固定三栏 | Flow/Studio 双模式 | ✅ 采用 v0.2 |
| AI 角色 | 右侧常驻面板 | 核心交互范式 | ✅ 采用 v0.2 |
| Skill 数量 | 22（实际23） | 23 | ✅ 修正为 23 |
| 技术栈 | Next.js+FastAPI | 保持不变 | ✅ 保持 v0.1 |
| 商业模式 | 4 层定价 | 未变更 | ✅ 保持 v0.1 |
| MVP 路线 | 3 阶段 | 兼容 | ✅ 保持 v0.1 框架 |

---

## 1. 产品定位与命名

**ChipFlow Studio** — AI-Native 芯片设计工作流平台

> 像 Claude Code 一样自然协作、像 STM32CubeMX 一样严谨执行的 AI 驱动硬件开发工作台。

**核心差异化：** 对话负责意图，画布负责事实。每次 AI 修改都可检查（Proposal → Review → Apply → Undo）。

---

## 2. 技术栈

```
前端:  Next.js 14 + TypeScript + TailwindCSS + Shadcn/ui (Radix)
       ReactFlow (管脚/时钟节点画布) + Monaco Editor (代码编辑)
       Zustand (状态管理) + TanStack React Virtual (虚拟列表)

后端:  Python FastAPI (主后端，科学计算) + Node.js 轻量网关
       PostgreSQL + pgvector (RAG 芯片语义搜索)
       Redis (会话缓存) + MinIO/S3 (文件存储)

AI:    Claude API (主模型，Agent 推理)
       LangGraph (Skill 编排)
       RAG Pipeline (芯片数据手册/参考设计知识库)

基础设施: Docker + K8s + GitHub Actions + Clerk (认证)
```

---

## 3. 视觉设计系统

### 3.1 设计哲学

不再使用"深蓝黑 + 科技蓝 + PCB 绿"的工业暗色模板。新方案以 **Claude Code 的暖色工作画布为骨架**：暖色负责思考与交流，深色技术表面负责代码与专业图形，珊瑚色负责 AI 与主动作。工业感来自真实的芯片数据与工程 Artifact，而非全屏发光蓝。

### 3.2 颜色令牌

**画布层次（Warm Paper）：**
| 令牌 | 色值 | 用途 |
|------|------|------|
| `canvas-0` | `#faf9f5` | 页面背景 |
| `canvas-1` | `#f3f1ec` | 卡片、侧栏背景 |
| `canvas-2` | `#ebe8e1` | 悬停态 |
| `canvas-3` | `#e2ded5` | 按下态、激活行 |
| `canvas-inverse` | `#181715` | 代码区、终端、工具提示 |

**品牌色（Coral）：**
| 令牌 | 色值 | 用途 |
|------|------|------|
| `brand-500` | `#e0583e` | 主 CTA、链接、激活态 |
| `brand-600` | `#c4452c` | 悬停 |
| `brand-700` | `#a03522` | 按下、聚焦环 |

**文字：**
| 令牌 | 色值 | 用途 |
|------|------|------|
| `text-primary` | `#1a1817` | 标题、正文 |
| `text-secondary` | `#6b6560` | 描述、标签 |
| `text-tertiary` | `#a0988c` | 占位符、禁用 |

**语义色：**
| 令牌 | 色值 | 用途 |
|------|------|------|
| `success-500` | `#2d8a4e` | 验证通过、GPIO 已分配 |
| `warning-500` | `#d4930e` | 冲突、待确认 |
| `error-500` | `#d43535` | 阻断错误、电源引脚 |
| `info-500` | `#3b82c4` | 调试引脚 |

**深色模式：** 通过 CSS 自定义属性反转实现，`[data-theme="dark"]` 块内覆盖画布和文字令牌。不需要维护两套独立设计系统。

### 3.3 字体与间距

- UI 文本：`Inter, -apple-system, sans-serif`，正文 15-16px，行高 1.6
- 代码：`JetBrains Mono, Fira Code, monospace`，14px
- 间距：4px 基础网格 → 4/8/12/16/24/32px
- 阴影：仅浮层、拖拽物、激活模式切换使用（普通区域靠色块+1px边框分层）
- 圆角：列表项 8px，输入框/卡片 12-14px，胶囊标签全圆角

---

## 4. 布局架构：Flow / Studio 双模式

### 4.1 核心理念

v0.1 的错误是将 AI 永久挤在狭窄右栏。修正后的架构：

- **Flow 模式**：AI 对话占据中央主工作区 — 需求澄清、方案选型、任务编排
- **Studio 模式**：原理图/管脚/代码/时钟/BOM/PCB 占据中央画布 — AI 作为可折叠右侧协作栏

### 4.2 AppShell 组件树

```
AppShell
  GlobalHeader (56px)
    LogoMark | ProjectSwitcher | ModeToggle [Flow|Studio] | ViewBreadcrumb
    | Spacer | GlobalCommandBar (⌘K) | NotificationBell | UserMenu
  MainContent (剩余高度)
    FlowView          ← /flow/:projectId
    StudioView        ← /studio/:projectId/:view
    DashboardPage     ← /dashboard
    SettingsPage      ← /project/:id/settings, /settings
    SkillMarketPage   ← /market
  StatusBar (28px)
    ProjectChip | GitBranch | CursorPosition | ConnectionStatus | SkillActivity
```

### 4.3 Flow 模式布局

```
┌────────────────────────────────────────────┐
│ [Header]                                   │
├────┬──────────────────────────┬────────────┤
│会话 │    AI Chat (max 960px)    │ 项目摘要    │
│列表 │    - 消息流              │ (可收起)    │
│    │    - Artifact 卡片       │            │
│    │    - Skill 执行过程       │            │
│    │                         │            │
├────┴──────────────────────────┴────────────┤
│ [Chat Input — 固定底部, max 1040px]         │
└────────────────────────────────────────────┘
```

### 4.4 Studio 模式布局

```
┌──────────────────────────────────────────────┐
│ [Header]                                     │
├──────┬──────────────────────────┬────────────┤
│项目树 │   Canvas (多 Tab)        │ AI 协作栏   │
│+Skill│   ┌─ Pinmap   ─────────┐ │ (可收起)    │
│面板  │   │ 芯片封装 SVG       │ │ Chat       │
│      │   │ 引脚 × 100        │ │ Skills     │
│      │   │ 颜色标记 + 冲突    │ │ References │
│      │   └───────────────────┘ │            │
│      │   ┌─ Code ─────────────┐ │            │
│      │   │ Monaco Editor      │ │            │
│      │   │ STM32 HAL/C 代码   │ │            │
│      │   └───────────────────┘ │            │
├──────┴──────────────────────────┴────────────┤
│ [Output Drawer — 可拖动, 180-420px]           │
│  Problems | Skill Log | Terminal | Simulation │
└──────────────────────────────────────────────┘
```

### 4.5 URL 路由

| 路由 | 页面 | 布局 |
|------|------|------|
| `/` | 启动页（自然语言描述项目需求） | 无壳 |
| `/dashboard` | 项目中心 | AppShell |
| `/flow/:projectId` | Flow 对话 | Flow 布局 |
| `/studio/:projectId/pinmap` | 管脚分配画布 | Studio 布局 |
| `/studio/:projectId/code` | 固件代码编辑器 | Studio 布局 |
| `/studio/:projectId/schematic` | 原理图查看 | Studio 布局 |
| `/studio/:projectId/clock` | 时钟树配置 | Studio 布局 |
| `/studio/:projectId/bom` | BOM 表格 | Studio 布局 |
| `/studio/:projectId/pcb` | PCB 预览 | Studio 布局 |
| `/market` | Skill 中心 | AppShell |
| `/settings` | 设置 | AppShell |

### 4.6 模式切换行为

| 过渡 | 行为 |
|------|------|
| Flow → Studio | 对话面板最小化到右侧栏，画布打开上次查看的 Tab，对话状态保留 |
| Studio → Flow | 画布状态冻结，对话面板扩展至全宽 |
| Studio Tab 切换 | 画布内切换，每视图状态独立保存在 canvasStore |
| 切换项目 | 全量状态刷新，未保存更改弹确认框 |
| 浏览器刷新 | Zustand 从 localStorage 恢复，项目数据从 API 重新拉取 |

### 4.7 响应式断点

- **≥1440px**：完整三栏，左 260px + 中 + 右 360px
- **900–1440px**：左栏缩至 220px 或图标栏 48px，右栏变为浮层抽屉
- **<900px**：单面板模式，左栏变底部 Sheet，画布单 Tab，所有浮层全屏模态

---

## 5. 引脚可视化系统（CubeMX 级别）

### 5.1 渲染技术选型

**SVG，非 Canvas。**
- SVG 元素是 DOM 节点，CSS 可样式化，无障碍可访问，DevTools 可检查
- 缩放平移通过 SVG viewBox 操作，无需 Canvas 重绘
- 每个引脚是一个 `<g>` 元素，原生 React 事件处理
- 性能：176 引脚 LQFP ≈ 176 个 SVG 组，60fps 无压力

### 5.2 支持的封装类型

| Phase 1（MVP） | Phase 2 |
|----------------|---------|
| LQFP-48/64/100/144/176 | BGA-100/132/144/169 |
| TQFP-32/48/64/100 | QFN-28/32/36/48/68 |
| | WLCSP, UFBGA, LGA |

### 5.3 引脚颜色编码

| 类别 | 色值 | 说明 |
|------|------|------|
| 电源输入 | `#d43535` | VDD, VDDA, VBAT |
| 地 | `#3d3835` | VSS, VSSA |
| 复位 | `#d4930e` | NRST |
| 调试 | `#3b82c4` | SWCLK, SWDIO, JTAG |
| GPIO 未分配 | `#a0988c` | 灰色 |
| GPIO 已分配 | `#2d8a4e` | 绿色 |
| 模拟 | `#7c5cbf` | ADC_IN, DAC_OUT |
| 通信 | `#e0583e` | USART, SPI, I2C, CAN |
| 定时器 | `#d4730e` | TIM_CH, PWM |
| 时钟 | `#0891b2` | OSC_IN, OSC_OUT |

### 5.4 引脚交互模型

| 手势 | 结果 |
|------|------|
| **悬停 (200ms)** | 工具提示：引脚号、名称、当前功能、可用 AF |
| **单击** | 选中引脚，详情面板展开 |
| **双击** | 打开引脚分配对话框 |
| **拖拽外设到引脚** | 从左侧外设列表拖拽 USART2_TX 到目标引脚 |
| **右键** | 上下文菜单：锁定/解锁/重置/查看数据手册 |
| **Ctrl+滚轮** | 缩放封装视图 |
| **方向键** | 在相邻引脚间导航 |
| **Shift+Click** | 多选批量操作 |

### 5.5 冲突检测

**检测类型：** 功能冲突、AF 冲突、电压域不匹配、重映射限制、ADC 通道冲突、定时器通道冲突

**视觉反馈：** 冲突引脚红色边框脉冲动画、冲突计数徽章、冲突面板列出所有冲突及"解决"按钮

**AI 冲突处理：** Agent 自动感知冲突，在对话中提出备选方案

---

## 6. 固件代码编辑与工程管理

### 6.1 Monaco Editor 集成

- 语言：C/C++（STM32 HAL/LL）
- STM32 专用自动补全：HAL_GPIO_*, HAL_UART_*, CMSIS 寄存器
- 代码片段：init-gpio, init-uart, init-spi, init-i2c, init-tim, init-adc, init-dma
- 尊重 CubeMX 用户代码标记 `/* USER CODE BEGIN */ /* USER CODE END */`
- HAL 函数跳转到定义、寄存器悬停提示

### 6.2 工程文件树

```
project-name/
  .chipflow/          # ChipFlow 元数据
  Core/Inc/  Core/Src/  Core/Startup/
  Drivers/CMSIS/  Drivers/STM32F4xx_HAL_Driver/
  .ioc                # CubeMX 兼容项目文件
```

### 6.3 AI 代码 Diff 审查流程

1. AI 生成代码 → 在 Monaco diff 编辑器中以绿色天沟标记显示
2. 用户逐行审查 → 接受/拒绝单行或"全部接受"
3. 接受后写入实际文件，作为单个原子操作进入 undo 栈
4. 所有 AI 代码修改遵循 Proposal → Review → Apply 模式

### 6.4 .ioc 导入/导出

- **导入**：解析 XML → 提取 MCU 型号、引脚分配、时钟配置、外设使能 → 填充 ChipFlow 项目
- **导出**：序列化项目状态 → CubeMX 兼容 XML → 下载
- **往返保真度**：导入 → 在 ChipFlow 编辑 → 导出 → CubeMX 中打开，保持兼容

---

## 7. AI Agent 交互设计

### 7.1 核心交互模式

```
用户: "我要做一个智能灌溉控制器，太阳能供电，需要低功耗"
      "/chip-select"

Agent: 🔍 正在分析需求...
       ✅ 提取关键约束：低功耗、太阳能输入、GPIO ≥ 8、ADC ≥ 2
       📊 搜索芯片数据库...

       推荐 Top 3：
       1. STM32L431CBT6 — 超低功耗，12bit ADC，¥18.5
       2. MSP430FR5994 — FRAM，最低功耗，¥22.0 （品牌暂不支持，仅供参考）
       3. nRF52840 — BLE + 低功耗，¥25.0 （品牌暂不支持，仅供参考）

       我推荐 STM32L431，因为你还需要 ADC 采集土壤湿度，
       且 ST 的生态对新手友好。要我详细对比吗？

用户: "就 STM32L431 吧，帮我做管脚分配"

Agent: ✅ 已锁定芯片：STM32L431CBT6
       🦶 正在分配管脚...

       ⚠️ 检测到冲突：PA2 同时被 USART2_TX 和 ADC_IN2 占用
       💡 建议：USART2_TX 移到 PA9

       管脚分配完成。[查看画布 →]
```

### 7.2 AI 输出格式

遵循"结论→证据→风险→下一步"结构：
1. **推荐摘要**：首选 + 理由 + 置信度
2. **候选对比表**：价格/封装/频率/Flash/RAM/ADC/通信/功耗/供货
3. **约束覆盖表**：明确哪些需求满足/部分满足/不满足
4. **数据来源**：可点击到数据手册具体章节
5. **操作按钮**：采用/加入对比/打开详情/继续提问

### 7.3 Skill 触发方式

| 方式 | 操作 | 场景 |
|------|------|------|
| `/skill名` | AI 对话中输入 | 熟练用户 |
| 点击 Skill 列表 | 右侧面板/Skill 面板点击图标 | 浏览发现 |
| 自然语言 | 直接描述需求 | 新手，Agent 自动路由 |
| 右键菜单 | 画布元素右键 | 上下文敏感操作 |

---

## 8. 23 个 Skill 体系

### 方案与选型（6 个）
1. `/req` — 需求分析：对话式澄清→提取约束→生成规格书
2. `/chip-select` — 芯片选型：RAG 搜索→多维评分排序→Top 5 推荐
3. `/arch` — 架构设计：推理最优架构→生成框图→检查冲突
4. `/compare` — 方案对比：多方案参数对比表
5. `/research` — 技术调研：搜索数据手册/参考设计
6. `/risk` — 风险分析：识别技术风险+缓解建议

### 硬件设计（8 个）
7. `/schematic` — 原理图设计：生成 Netlist + 设计说明
8. `/pinmap` — 管脚分配：自动分配→冲突智能检测→CubeMX 兼容导出
9. `/clock` — 时钟树配置：计算分频/倍频→精度误差检查
10. `/power` — 电源设计：功耗估算 + 电源拓扑建议
11. `/pcb` — PCB 布局：信号流分析→分区建议→走线策略
12. `/si` — 信号完整性：阻抗/串扰/反射分析
13. `/emc` — EMC/EMI：布局布线规则检查
14. `/thermal` — 热分析：功耗→温升估算

### 生产与验证（6 个）
15. `/bom` — BOM 生成：识别元件→匹配封装→实时价格
16. `/cost` — 成本估算：BOM 成本 + 制造成本
17. `/procure` — 元件采购：LCSC/Mouser 比价
18. `/gerber` — Gerber 审查：解析→规则检查→修复建议
19. `/dfm` — DFM 检查：可制造性审查
20. `/testpoint` — 测试点规划：关键节点测试点建议

### 固件与软件（3 个）
21. `/driver` — 外设驱动代码生成：HAL 层初始化代码
22. `/rtos` — RTOS 配置：FreeRTOS 任务/队列/定时器
23. `/bootloader` — Bootloader 设计：OTA/串口/USB 升级

---

## 9. 状态管理架构

### Zustand Store 划分

```
projectStore     — 项目元数据、MCU、引脚分配、时钟、外设、文件树、保存状态
chatStore        — 对话历史、流式内容、Skill 历史、待审批 Proposal
canvasStore      — 当前模式、激活视图、缩放/平移/选中、操作历史(undo/redo)
uiStore          — 主题、侧栏显隐、底部面板、命令面板、Toast
mcuStore         — STM32 全系列数据库(只读)、封装几何模板、AF 映射表、冲突规则
authStore        — 用户、会话、登录状态
```

### AI → 画布数据流

```
用户输入 → chatStore.sendMessage() → API → Claude → Tool Call
  → Backend 生成 CanvasOperation → SSE 推送
  → canvasStore.operations.push(op) → UI 渲染幽灵预览
  → 用户点击 [Accept] → canvasStore.applyOperation(op)
  → mcuStore.checkConflict() 重新校验 → projectStore 更新 → 画布重渲染
```

### CanvasOperation（类型化命令模式）

每个 AI 驱动的画布修改都是一个 CanvasOperation：
```typescript
{ id, type, payload, timestamp, agentGenerated, inverse[] }
```
- 支持 undo/redo（历史上限 100 条）
- AI 操作可批量回退
- 历史持久化到 localStorage

---

## 10. MVP Phase 1 范围（STM32 Only）

### Weeks 1-2：基础设施
- Next.js 14 脚手架 + 设计令牌系统（CSS 自定义属性 + Tailwind 主题）
- Clerk 认证 + PostgreSQL/pgvector 建表
- FastAPI 骨架 + AppShell 布局 + Dashboard 页面

### Weeks 3-4：核心功能
- Flow 模式 AI 对话面板 + Claude API 流式聊天
- `/` 斜杠命令 Skill 菜单 + 6 个核心 Skill（req, chip-select, arch, pinmap, driver, bom）
- STM32 MCU 数据库（F0-F7, G0-G4, H7, L0-L5, U5, WB, WL ~150 款）
- 工程文件树 + Studio 基础布局

### Weeks 5-6：引脚可视化 MVP
- LQFP 封装 SVG 渲染（48/64/100/144 引脚）
- 引脚颜色编码 + 悬停工具提示 + 单击选中详情面板
- AI 驱动引脚分配：Proposal → Ghost Overlay → Accept/Reject
- Monaco Editor 代码读写 + 项目管理
- .ioc 导入/导出

### Phase 1 不包含
- BGA/QFN 封装 → Phase 2
- 拖拽式引脚分配 → Phase 2
- 原理图/时钟树/PCB/3D 可视化 → Phase 2
- 价格 API 集成 → Phase 2
- 团队协作/Skill 市场 → Phase 3

---

## 11. 商业模式

| 层级 | 价格 | 内容 |
|------|------|------|
| Free | ¥0 | 10 次 AI 对话/月, 3 个项目, 基础芯片库 |
| Pro | ¥49/月 | 无限对话, 无限项目, 全部 23 Skill, 完整芯片库 |
| Team | ¥149/月 | Pro + 团队协作 + 权限管理 |
| Enterprise | 定制 | 私有部署 + SSO + 专属知识库 |

---

## 12. 竞品对比

| 维度 | STM32CubeMX | 立创EDA | ChipFlow Studio |
|------|-------------|---------|-----------------|
| AI 智能辅助 | ❌ | ❌ 基础 | ✅ **深度 Agent + 23 Skill** |
| 芯片选型 | 仅 ST | 全品牌 | **AI 推荐 + 多维度对比** |
| 管脚自动分配 | ✅ | ❌ | ✅ **冲突智能检测与建议** |
| 原理图/PCB | ❌ | ✅ | ✅ **AI 审查与建议** |
| 固件代码生成 | ✅ 基础 | ❌ | ✅ **上下文感知代码生成** |
| 在线协作 | ❌ | ❌ 有限 | ✅ **实时同步** |
| Skill 生态 | ❌ | ❌ | ✅ **社区市场** |
| 界面风格 | 传统 IDE | 传统 EDA | **Claude 式暖色 + Flow/Studio** |

---

## 13. 风险与缓解

| 风险 | 等级 | 缓解 |
|------|------|------|
| 芯片数据库质量 | 高 | 爬取+人工审核，Phase 1 仅 STM32 全系列 ~150 款 |
| AI 输出准确性 | 高 | 标注置信度 + 人工复核提示 + AF 映射表服务端校验 |
| 封装 SVG 渲染保真度 | 中 | Phase 1 仅 LQFP，Phase 2 参照封装机械数据 PDF |
| .ioc XML 格式未文档化 | 中 | 逆向 CubeMX 输出，全系列往返测试 |
| Claude API 调用成本 | 中 | 免费额度控制 + 缓存 + Pro 套餐 |
| Monaco Editor 包体积 | 中 | next/dynamic 动态导入，首次打开 Code Tab 时按需加载 |

---

## 14. 验收标准

### 核心体验（P0）
- 新用户 3 分钟内：描述需求 → 回答首轮问题 → 获得候选芯片 → 采用一款芯片 → 得到完整引脚分配
- 已有项目用户 10 秒内：确认当前芯片、当前 Artifact、未解决冲突、AI 执行任务
- 工程师可追溯任何 AI 结论的数据来源、预览 AI 修改的影响、拒绝或回退修改、明确知道画布是草稿还是已批准版本
- 视觉上像一张安静可信的工程工作桌，不像聊天网页，也不像传统拥挤 IDE

### 布局（P1）
- Flow/Studio 切换平滑，对话不丢失
- 三断点响应式正确（≥1440 / 900-1440 / <900）
- 深色模式一键切换无闪烁

### 引脚可视化（P0）
- LQFP-100 正确渲染 100 个引脚，颜色编码准确
- 悬停 300ms 内显示工具提示
- 单击选中、键盘导航、冲突引脚红色脉冲

### AI Agent（P0）
- 芯片选型返回 Top 3 + 对比表
- 引脚分配生成幽灵预览 + Accept/Reject
- 代码生成显示 Diff + 逐行审查
- 对话跨模式持久化

---

*Version: 1.0.0 | Date: 2026-07-21 | Status: Design-Complete SPEC | Based on: v0.1 + v0.2 重构方案 + 用户确认需求*