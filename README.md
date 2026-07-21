# ChipFlow Studio

> AI-Native 芯片设计工作流平台 — 像 Claude Code 一样智能、像 STM32CubeMX 一样严谨

面向嵌入式工程师的 AI 驱动硬件开发工作台。自然语言描述需求，Agent 自动完成芯片选型、管脚分配、原理图设计和固件生成。

## 技术栈

- **前端**: Next.js 16 + TypeScript + TailwindCSS v4 + Shadcn/ui + Zustand
- **AI**: Claude API（Agent 推理）+ 23 个内置 Skill
- **设计系统**: Warm Paper 暖色调 (#faf9f5) + Coral 珊瑚品牌色 (#e0583e)

## 快速开始

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 启动页 | 产品介绍、Features、CTA |
| `/dashboard` | 项目中心 | 项目列表、新建、搜索 |
| `/flow/:projectId` | Flow 对话 | Claude 风格 AI 聊天工作台 |
| `/studio/:projectId/:view` | Studio 画布 | VS Code 风格工程编辑 |
| `/market` | Skill 中心 | 23 个 Skill 目录 |

## MVP 状态

- [x] 设计令牌系统（30+ CSS 变量，浅色/深色双模式）
- [x] 28 款 STM32 MCU 数据库（F0-H7, G0-G4, L0-L5, U5, WB, WL）
- [x] Flow 模式（AI 对话 + 权限模式选择器）
- [x] Studio 模式（项目树 + 多 Tab 画布 + AI 侧栏 + Output 抽屉）
- [x] Landing Page + Dashboard + Skill 中心
- [x] 3 个 Zustand Store（UI, MCU, Project）
- [ ] 引脚可视化 SVG（Round 5）
- [ ] Monaco Editor 代码编辑
- [ ] Claude API 实时集成
- [ ] Clerk 用户认证

## 文档

- [SPEC v0.1](doc/ChipFlow-Studio-SPEC.md) — 原始产品规格
- [UI Design](doc/UI_Design.md) — 完整 UI 布局与交互规范
- [Plan v1.0](doc/Plan.md) — 重构方案终稿

## License

MIT
