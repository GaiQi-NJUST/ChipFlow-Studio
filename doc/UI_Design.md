
# ChipFlow Studio 最终 UI 布局与交互规范

## 1. 最终产品结构

ChipFlow Studio 只保留两个核心工作模式：Flow 与 Studio。二者不是同一套三栏布局换内容，而是针对两种思维状态设计的两套工作空间。

- Flow 负责讨论、调研、需求澄清、芯片选型、技术方案、风险分析与实施计划。界面完全以聊天为中心，不显示固定项目摘要栏，不展示复杂工程画布，不把二十多个 Skill 铺在屏幕上。
- Studio 负责真正操作项目：浏览源代码、修改 C/C++、配置 Pinmap 和 Clock、查看 Hardware、设计 PCB、处理 BOM、执行验证并审查 AI 修改。界面采用类似 VS Code 的项目树、标签页、主编辑器、AI Agent 与底部状态栏。
- Flow 可以读取工程上下文，也可以生成对工程的修改建议；实际写入通过 Manual、Accept edits、Plan、Bypass permissions 四种模式控制。任何修改都必须留下记录，可定位、可比较、可撤销。

用户的自然路径是：在 Flow 中想清楚并形成计划，在 Studio 中检查并完成工程。两种模式共享同一个项目、会话上下文、模型状态和变更历史，切换时不丢失内容。

## 2. 共享应用外壳

两种模式共享顶部应用栏和全局状态，但内容布局不同。标准桌面窗口宽度按 1440–1920px 设计，高度适配 800px 以上。

顶部栏高度 56px。左侧为 ChipFlow Studio 标记与当前项目选择器；中部为 Flow / Studio 双段切换器；其后显示面包屑，例如“智能灌溉控制器 / Pinmap”或“智能灌溉控制器 / 低功耗方案讨论”；右侧为全局命令搜索、帮助、通知、设置和账户。

Flow / Studio 切换器在两个模式中保持完全相同的位置，避免切换时视线跳动。Flow 激活时使用浅珊瑚底色；Studio 激活时同样使用浅珊瑚底色。切换只改变主体工作区，不重新加载项目。

全局命令搜索支持项目、会话、文件、芯片、器件、引脚、Skill 与命令。例如输入 PA9 可打开相关 Pinmap；输入 main.c 可跳转 Studio；输入“低功耗讨论”可返回 Flow 会话。

## 3. Flow 模式：完全以聊天为中心

### 3.1 Flow 的定位

Flow 页面在视觉与使用方式上完整参考 Claude Desktop。它首先是一张安静、宽阔、适合阅读长文和制定计划的对话纸面，而不是项目仪表盘。Flow 中不设置右侧 Project Brief，不放五阶段进度条，不显示常驻工程属性，也不把聊天压缩进狭窄栏位。

主界面仅由三个部分组成：

1. 左侧会话侧栏。
2. 中央聊天正文。
3. 底部固定输入与模式控制区。

工程状态通过会话标题旁的项目标签、消息内 Artifact、文件引用和底部模式控制表达。用户需要查看管脚、代码或 PCB 时，点击 Artifact 或文件链接进入 Studio。

### 3.2 Flow 左侧会话栏

左栏默认宽度 300px，可在 260–360px 之间拖动。背景为 #f7f6f2，与主画布通过一条 #e6dfd8 的细线区分。侧栏独立滚动，顶部操作和底部账户始终固定。

侧栏顶部依次放置：

- “New session”：创建空白对话，并继承当前项目上下文；右侧下拉菜单可选择无项目会话或指定项目。
- “Projects”：进入项目管理页，可新建、导入、重命名、复制、归档和删除工程。
- “Customize”：管理模型、全局指令、Skill、知识库、连接器、权限策略和快捷键。

其下按项目分组显示会话。每个项目可展开，例如“智能灌溉控制器”下包含“需求分析”“低功耗方案”“芯片选型”“Pinmap 冲突”“BOM 降本”等会话。没有归属项目的内容放在 Ungrouped。

会话行高度 38–42px，只显示单行标题。当前会话使用浅米色背景和 8px 圆角；悬停时行尾出现重命名、移动、固定、导出和归档菜单。长标题省略，但悬停显示完整内容。正在执行的会话可显示小型旋转状态，不使用彩色大徽章。

底部固定显示 Gateway、当前组织或账户。展开后可切换本地/云端执行环境、查看连接状态和退出。离线状态使用图标与“离线，本地保存”文字共同表达。

### 3.3 会话头部

中央聊天区顶部为轻量会话头部，最小高度 64px。左侧显示会话标题，例如“智能灌溉控制器低功耗设计方案”；标题后放当前项目标签“智能灌溉控制器”和执行设备标签。标题单行省略，可双击重命名。

右侧动作参考 Claude Desktop：终端/日志入口、Artifacts、运行或继续、更多菜单。Flow 不直接展示终端面板，点击终端后以底部抽屉临时展开；点击 Artifact 显示本次会话产生的计划、规格书、代码补丁和配置提案。

头部随聊天内容滚动保持固定，背景使用接近不透明的暖白色，底部只保留极淡分隔线。危险操作不放一级按钮。

### 3.4 中央消息流

Flow 使用文档式消息流，不使用左右聊天气泡。正文容器最大宽度 1080px，推荐阅读宽度 880–980px，并在大屏中水平居中。消息滚动区在输入框后保留 150px 底部安全距离。

用户消息以略高字重呈现，可在旁边显示附件、文件引用和项目标签；AI 回复直接排版在画布上。正文使用 16px 人文无衬线字体，行高 1.65，中文每行约 38–50 字。标题、列表、表格、引用、代码和分隔线完全按照长文阅读设计。

AI 可以在回复中展示：

- Markdown 标题、段落与列表。
- 芯片参数、方案对比和风险清单表格。
- Mermaid 系统框图与流程图。
- 代码块、配置片段和终端输出。
- 数据手册引用和来源链接。
- Plan、Artifact、Diff 与应用结果。

表格使用浅灰单元格、1px 间隔与左对齐文字，不做重阴影。代码块和终端片段使用 #181715 深色技术表面，带语言名、文件路径、复制和“在 Studio 打开”操作。长内容默认自然滚动，超长代码块在内部横向滚动。

AI 思考和工具执行以折叠行出现，例如“正在读取工程文件”“正在核对 STM32 数据手册”“正在生成 Pinmap Proposal”。默认只显示动作摘要、耗时和状态；展开后查看日志、引用和影响对象。界面不展示内部推理全文。

### 3.5 Flow 输入区

输入区固定在主内容底部，最大宽度 1120px，与正文居中对齐。输入框最小高度 78px，随内容增加到窗口高度的 40%，背景为白色，边框 #d9d5ce，圆角 14px。

占位文案为“输入消息，或使用 / 调用 Skill”。支持 Enter 发送、Shift+Enter 换行；输入法组合状态下不得误发送。输入框支持拖入 C/C++ 文件、数据手册、截图、.ioc、KiCad、Gerber、BOM 和整个目录。

输入框下方左侧显示当前执行模式和附件按钮，右侧显示模型、思考强度、上下文占用和发送/停止按钮。发送按钮在有内容时使用珊瑚色；运行中切换为停止方形图标。

### 3.6 四种执行模式

模式选择菜单完全参考 Claude Desktop，放在输入框左下角。菜单从下向上弹出，包含名称、快捷键和当前勾选状态。


| 模式               | 行为                                                   | 适用场景                     |
| -------------------- | -------------------------------------------------------- | ------------------------------ |
| Manual             | 每一次文件或工程修改都单独询问，工具执行也按权限请求   | 初次使用、高风险硬件修改     |
| Accept edits       | AI 可生成并应用普通文件编辑，但关键工程对象仍需批准    | 修改代码、文档、配置文件     |
| Plan               | 只读取、分析和写计划，不改变工程，不运行有副作用的命令 | 方案设计、架构分析、实施规划 |
| Bypass permissions | 允许 AI 直接执行批准范围内的操作                       | 用户明确授权的自动化流程     |

Plan 是 Flow 的核心模式。激活后，输入框左下显示“Plan”胶囊标签，聊天区顶部可出现极轻提示“Plan mode：不会修改工程”。AI 可以读取项目文件、搜索知识库、分析依赖和提出步骤，但不能写入 Src、Inc、Pinmap、Clock、Hardware、PCB 或 BOM。

Bypass permissions 使用低饱和琥珀色提示，不使用刺眼红色。首次开启必须展示范围说明；关闭应用或切换项目后是否保留由用户设置决定。

### 3.7 Plan 输出与应用到工程

Plan 不是普通聊天段落，而是一种可保存 Artifact。标准 Plan 包含：

1. 目标与范围。
2. 已确认约束。
3. 涉及文件和工程对象。
4. 分步骤实施方案。
5. 验证方法。
6. 风险与回退方式。

Plan 末尾提供“保存计划”“复制”“在 Studio 打开”“应用计划”四个操作。“保存计划”写入项目的 plans 目录，但不执行内容；“在 Studio 打开”进入 Studio 并显示受影响的文件与 Artifact；“应用计划”先展示影响摘要，再要求用户选择 Manual 或 Accept edits。

当用户应用 Plan 后，Flow 保持聊天页面，不突然变成工程画布。消息流中出现任务进度块：

- 正在更新 Pinmap。
- 正在生成 clock_config.c。
- 正在修改 main.c 与 main.h。
- 正在运行冲突检测。

每一步可展开查看 Diff。成功后显示“已应用到工程”和“在 Studio 查看”；部分失败时明确列出已完成、未完成和回退操作。用户可在 Flow 中撤销整次 Plan，也可进入 Studio 撤销单个修改。

### 3.8 Flow 中的 Artifact

芯片选型、需求规格书、架构图、Pinmap、Clock 配置、BOM 和代码修改都使用轻量描边 Artifact 卡片。卡片只展示标题、版本、摘要、状态和一个主动作，不把 Flow 变成卡片仪表盘。

例如“Pinmap Proposal v3 · 2 个冲突”的主动作是“在 Studio 审查”；“实施计划 v2”的主动作是“应用计划”；“芯片选型”的主动作是“采用 STM32L431”。应用后卡片显示已写入的项目位置和撤销入口。

### 3.9 新会话、空状态与项目上下文

Flow 新会话的空状态也应接近 Claude Desktop，而不是展示项目统计图。内容区域垂直居中偏上，显示一句简短欢迎语和当前上下文，例如“今天想为智能灌溉控制器解决什么问题？”。下方最多给出四个建议：“完善需求”“比较芯片”“制定 Pinmap 计划”“审查当前风险”。建议项使用纯文字和小图标，不做大型彩色卡片。

新建会话时，用户可以选择“使用当前项目上下文”或“无项目对话”。使用项目上下文时，AI 默认能读取已授权的项目摘要、文件树和已批准 Artifact，但不会自动加载全部文件内容。输入框上方用一个可移除的项目 Chip 表明上下文，例如“智能灌溉控制器 · STM32L431CBT6”。用户可以继续附加 main.c、Pinmap v3 或一份数据手册，所有上下文对象都能逐个移除，避免模型误用过期信息。

当上下文超过容量时，界面显示明确的使用量和压缩状态。系统优先保留用户的当前问题、已确认工程约束和最近引用的文件；较早内容被摘要后应提供“查看摘要”入口。不得在无提示的情况下丢弃关键 Pinmap、Clock 或电气约束。

Plan 的生命周期包括 Draft、Ready、Applying、Partially applied、Applied、Superseded。Draft 可继续讨论；Ready 表示范围和验证步骤完整；Applying 显示每一步执行状态；Partially applied 必须提供继续、回退和进入 Studio 修复；Applied 保留对应提交或工程版本；新的 Plan 替代旧计划后，旧版本进入 Superseded，但仍可查看和比较。

Flow 的错误状态使用内联恢复方式。网络中断时保留输入草稿和未发送附件；Skill 失败时显示失败步骤、已完成产物和重试入口；权限被拒绝时允许改用 Plan 或 Manual，而不是清空任务。长任务可以在后台继续，侧栏会话行显示运行状态，用户返回后从原位置继续阅读。

## 4. Studio 模式：VS Code 式工程工作台

### 4.1 Studio 总体布局

Studio 保持现有预览图的方向：顶部全局栏、左侧项目资源管理器、中央多标签编辑器、右侧 AI Agent、底部 Output 抽屉与状态栏。标准桌面布局为：

- 左侧资源管理器 260–300px。
- 中央编辑器占剩余主要空间。
- 右侧 AI Agent 默认 360px，可在 320–520px 调整或完全收起。
- 底部状态栏 28px。
- Output 抽屉关闭时只显示标签，展开高度 180–420px。

Studio 的视觉仍然使用暖白产品外壳，但代码编辑器、终端和部分 PCB 视图允许使用深色技术表面。不能将整个应用恢复成传统深蓝黑 IDE。

### 4.2 左侧 Projects 与工程树

左栏顶部显示 Projects、+ New Project、搜索、过滤和更多菜单。用户可从空白工程、模板、.ioc、KiCad 或已有 STM32 工程创建项目。

当前工程根节点下按真实工程结构显示：

- Pinmap。
- Src：main.c、stm32l4xx_it.c、app_control.cpp 等。
- Inc：main.h、stm32l4xx_it.h、app_control.hpp 等。
- Hardware。
- PCB。
- BOM。
- Docs。
- .ioc。

Src 与 Inc 使用明确的文件夹、C/C++ 和头文件图标。Hardware 展开后包含 Schematic、Clock、Power、Peripherals、Signal Integrity、EMC、Thermal；PCB 展开后包含 Layout、Layers、Rules、Gerber、DFM、3D Preview。

当前文件或画布使用浅珊瑚背景。被 AI 修改但尚未保存的文件显示圆点；存在冲突的工程对象显示文字计数。树节点支持右键新建、重命名、复制路径、在 Flow 中讨论、让 AI 分析和删除。

### 4.3 中央多标签编辑器

中央顶部是标签栏，支持 Pinmap、Code、Clock、Schematic、PCB、BOM 和 Diff 同时打开。每个标签显示文件/对象图标、名称、修改状态和关闭按钮；标签可拖动、分屏和固定。

第二行是当前编辑器工具栏。例如 Pinmap 显示版本、Proposal、Compare、Validate、Review & Apply；Code 显示文件路径、语言、格式化、编译和运行；PCB 显示层、网络、测距、规则和 2D/3D 切换。

中央内容按对象使用专用编辑器：

- Pinmap：芯片封装俯视图、四周引脚、颜色分类、拖拽分配、冲突和 AI Ghost Proposal。
- Code：Monaco Editor，支持 C/C++、HAL/LL、CMSIS、跳转定义、自动补全和 AI Diff。
- Clock：结构化时钟树、PLL 倍频/分频、误差、非法组合与频率约束。
- Schematic：分层原理图、网络高亮、ERC 与 AI 修改覆盖层。
- PCB：2D 布局为主、3D 预览为辅，支持层、网络、器件、规则和问题定位。
- BOM：虚拟化数据表，包含料号、封装、数量、价格、库存、生命周期和替代料。

### 4.4 右侧 AI Agent

AI Agent 只存在于 Studio，承担围绕当前画布的上下文操作。顶部包含 Chat、Skills、References 三个标签。

Chat 显示当前选中对象，例如 PA2、某段代码、一个 BOM 行或 PCB 网络。Skills 只展示与当前编辑器相关的操作。References 显示数据手册、参考设计、规则来源和引用页码。

右栏顶部保留 One-click Actions，并随页面变化：

- Pinmap：配置 Clock、优化 Pinmap、激活外设、生成驱动。
- Code：解释代码、修复问题、生成单元测试、应用 Diff。
- PCB：生成布局建议、检查 DFM、检查 EMC、规划测试点。
- BOM：寻找替代料、降低成本、检查生命周期、采购比价。

安全编辑可直接应用，并显示 Auto Apply: Safe edits；高风险修改必须进入 Proposal。每个建议都说明将修改哪些对象，例如“将 USART2_TX 移至 PA9，并同步更新 .ioc 与初始化代码”。操作按钮使用“查看影响”“直接应用”；应用后提供撤销。

### 4.5 Output、Problems、Terminal 与状态栏

底部抽屉包含 Problems、Skill Log、Terminal、Simulation。Problems 聚合代码、Pinmap、电气、PCB 和制造问题；点击直接定位。Skill Log 显示 Agent 的公开执行步骤和工具结果。Terminal 提供真实命令行。Simulation 展示 SPICE 或测试输出。

状态栏左侧显示同步与 Git/版本，中部显示 MCU、当前对象和审查状态，右侧显示冲突、活动 Skill、连接与模型。例如：“已同步 · STM32L431CBT6 · Pinmap Review · 2 conflicts · 1 Skill running”。

### 4.6 项目管理与版本审计

点击 Projects 或 + New Project 打开覆盖主区的项目页面，而不是另开风格不同的网站。项目页提供最近工程、搜索、状态筛选、导入工程和模板创建。项目卡片只显示名称、目标芯片、最近修改时间、未解决问题和同步状态；主要动作是“打开”，次要操作收进菜单。

创建工程可以从自然语言、空白 STM32 工程、.ioc、Git 仓库、KiCad 或立创 EDA 文件开始。导入流程先预检文件结构和兼容性，再展示将创建的 Src、Inc、Hardware、PCB、BOM 与 Docs，用户确认后才写入项目。

Studio 中每次 AI 直接应用都生成一条审计记录，包含时间、模型、Skill、输入上下文、修改对象、验证结果和逆向操作。History 面板可以按文件、Artifact 或一次 Plan 查看变更。多文件修改以一个原子批次撤销，单个文件也可以从 Diff 中局部恢复。工程师必须能区分用户编辑、AI 编辑、导入变化和自动生成内容。

## 5. Flow 与 Studio 的切换规则

从 Flow 点击文件、代码块或 Artifact 时进入 Studio，并打开准确目标；返回 Flow 后恢复原滚动位置、输入草稿和模式。Studio 中右键对象选择“在 Flow 中讨论”，会创建带对象引用的新消息。

Plan 应用时可直接跳转 Studio 的 Diff，也可继续留在 Flow 观察任务。Studio 的 AI Agent 与 Flow 使用同一会话上下文，但呈现不同：Flow 展示完整讨论，Studio 只展示围绕当前对象的上下文片段。

切换项目时，如果存在未保存更改或未完成的 Plan，必须明确提示保存、放弃或留在后台。后台 Skill 不因切换页面自动终止。

两个模式共享统一的“当前工程版本”。Flow 中引用的文件名、行号、Pinmap 版本和 BOM 行都携带稳定 ID；进入 Studio 后准确定位，即使文件后来被重命名，也能通过历史映射找到对象。Studio 修改完成后，Flow 消息中的 Artifact 状态实时更新为 Applied、Changed 或 Outdated，避免用户继续依据旧结果讨论。

如果 Studio 的修改使已有 Plan 失效，例如目标芯片被替换或引脚功能发生变化，返回 Flow 时在相关计划上显示“工程已变化，需要重新验证”。用户可以要求 AI 只重新计算受影响步骤，而不是重新生成整份计划。

## 6. 视觉系统


| 令牌          | 色值    | 用途                 |
| --------------- | --------- | ---------------------- |
| Canvas        | #faf9f5 | Flow 主画布          |
| Canvas Subtle | #fcfbf8 | Studio 编辑背景      |
| Sidebar       | #f6f4ef | 左右栏               |
| Card          | #ffffff | 输入框、卡片、浮层   |
| Soft Surface  | #efe9de | 选中、悬停、标签     |
| Ink           | #141413 | 主文字               |
| Body          | #3d3d3a | 正文                 |
| Muted         | #6c6a64 | 次要信息             |
| Hairline      | #e6dfd8 | 边框                 |
| Coral         | #e0583e | 品牌、AI、主操作     |
| Dark          | #181715 | 代码、终端、芯片主体 |
| Success       | #2d8a4e | 通过、已应用         |
| Warning       | #d4930e | 冲突、权限提示       |
| Error         | #d43535 | 阻断错误             |

字体使用 Inter、Segoe UI、PingFang SC、Microsoft YaHei；代码使用 JetBrains Mono、Consolas。正文 15–16px，辅助文字 12–13px，代码 13–14px。基础间距为 4px，常用 8、12、16、24、32px。普通区域主要靠色块和细边框分层，阴影只用于浮层、拖拽对象与模式菜单。

## 7. 响应式、无障碍与性能

1440px 以上显示完整 Studio 三栏；1100–1439px 收窄左右栏；900–1099px 将 Studio AI Agent 改为覆盖抽屉；900px 以下以 Flow 阅读和轻量操作为主，复杂 Pinmap、Schematic 和 PCB 编辑提示使用桌面端。

Flow 在窄屏隐藏左栏，通过顶部按钮打开会话抽屉，正文保持单栏。输入模式、模型和停止按钮始终可见。

所有图标按钮提供 aria-label、Tooltip 和可见焦点环；颜色不是唯一状态信号。树、标签页、表格、模式菜单和编辑器支持键盘操作。常用交互 INP 目标小于 200ms；Monaco、PCB 3D 和大型数据表按需加载；长会话与 BOM 使用虚拟化，但不得破坏文本搜索和滚动定位。

## 8. 推荐组件结构

- AppShell
  - GlobalHeader
  - ModeSwitcher
  - FlowWorkspace
    - ConversationSidebar
    - ConversationHeader
    - MessageScroller
    - MarkdownMessage
    - PlanArtifact
    - DiffArtifact
    - FlowComposer
    - PermissionModeMenu
  - StudioWorkspace
    - ProjectExplorer
    - EditorTabs
    - PinmapEditor
    - MonacoEditor
    - ClockEditor
    - SchematicViewer
    - PcbEditor
    - BomTable
    - AiAgentSidecar
    - OutputDrawer
    - StatusBar

## 9. 最终验收标准

Flow 打开后第一眼必须像 Claude Desktop：左侧会话、中央长文聊天、底部输入框，没有右侧仪表盘和工程画布。用户能在输入框旁明确选择 Manual、Accept edits、Plan 或 Bypass permissions；Plan 模式不会修改项目；应用计划时能看到影响、进度、Diff 和撤销。

Studio 打开后第一眼必须像现代 VS Code 工程工作台：真实项目树、Src/Inc 文件、多标签编辑器、专业 Pinmap/Clock/PCB/BOM 画布、右侧上下文 AI Agent、底部问题与状态。用户能从 AI 建议直接定位并修改工程，也能审查和回退。

最终体验应形成清晰心智模型：Flow 是“和工程搭档一起想清楚”，Studio 是“把想法准确写进工程”。两者视觉统一、职责分离、状态连续。
