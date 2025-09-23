# 云构 Cloud Builder - AI 开发指南

## 项目概述

这是一个基于 Next.js 15 的低代码可视化页面构建平台，使用拖拽方式创建组件树并实时预览。

## 核心架构模式

### 组件系统双存储模式

- **Component Store** (`src/stores/component.ts`): 存储组件树 JSON 结构，管理层级关系和属性
- **ComponentConfig Store** (`src/stores/component-config.ts`): 存储组件类型映射、默认属性和 Setter 配置
- 组件通过 `data-component-id` 属性连接 DOM 与存储，实现点击选中和 hover 效果

### Material 组件开发模式

```typescript
// 1. 创建组件 (src/components/material/*)
export interface ButtonProps {
  type: AntdButtonProps["type"];
  text: string;
}

// 2. 创建setter配置 (src/lib/*-setter.ts)
const ButtonSetter = [
  { name: "text", label: "按钮文本", type: "input" },
  { name: "type", label: "按钮类型", type: "select", options: [...] }
];

// 3. 在ComponentConfig中注册
{
  name: "Button",
  component: Button,
  hasChildren: false,  // 是否可嵌套子组件
  setter: ButtonSetter,
  styleSetter: ButtonStyleSetter
}
```

### 拖拽系统架构

- 使用 `react-dnd` + `HTML5Backend`
- `useMaterialDrop` hook 处理组件放置逻辑，自动寻找最近的可容纳父组件
- 支持嵌套拖拽，通过 `hasChildren` 配置控制可容纳性

## 关键开发流程

### 添加新 Material 组件

1. 在 `src/components/material/[name]/index.tsx` 创建组件
2. 在 `src/lib/[name]-setter.ts` 定义属性配置器
3. 在 `src/stores/component-config.ts` 注册组件映射
4. 组件必须接受 `data-component-id` 和 `style` props

### 认证与路由保护

- 使用 Clerk 进行身份验证，配置在 `src/middleware.ts`
- 公开路由: `/`, `/sign-in(.*)`, `/sign-up(.*)`
- 保护路由: `/dashboard`, `/editor` 等
- 登录后重定向到 `/dashboard`

### 编辑器布局结构

```
EditorPage (DndProvider)
├── EditorHeader (顶部工具栏)
├── Allotment (分割面板)
│   ├── ComponentPanel (左侧组件库)
│   ├── Canvas (中央画布) + ActiveMask + HoverMask
│   └── Setting (右侧属性编辑器)
```

## 技术栈约定

### 状态管理

- Zustand 用于全局状态，避免 Redux 复杂性
- 两个核心 store 分离关注点: 数据结构 vs 组件配置

### UI 组件库

- 主要使用 Ant Design (`antd`) 作为基础组件
- HeroUI (`@heroui/react`) 用于部分现代化组件
- Tailwind CSS + `tailwind-merge` 处理样式

### 开发命令

```bash
pnpm dev       # 开发服务器 (推荐使用pnpm)
pnpm build     # 生产构建
pnpm lint      # ESLint检查
```

## 常见模式

### 组件递归渲染

Canvas 使用 `renderComponent` 函数递归渲染 JSON 树，通过 `React.createElement` 动态创建组件实例。

### 位置追踪系统

- `useElementObserver` hook 监听 DOM 变化
- `ActiveMask`/`HoverMask` 提供视觉反馈
- 通过 `getBoundingClientRect()` 计算位置

### 属性更新机制

- Setter 配置驱动右侧属性面板生成
- 支持 input, select, color 等类型
- 空值自动删除，避免冗余属性存储

## 调试要点

- 组件选中问题: 检查 `data-component-id` 是否正确传递
- 拖拽不生效: 确认目标组件的 `hasChildren: true` 配置
- 样式不生效: 验证 `defaultStyles` 与 component props 的合并逻辑
