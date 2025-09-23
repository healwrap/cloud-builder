import { getObjectById } from "@/lib/utils";
import { CSSProperties } from "react";
import { create } from "zustand";
import { ComponentName } from "./component-config";
import { nanoid } from "nanoid";

export interface Component {
	id: string;
	name: ComponentName;
	props: Record<string, unknown>;
	styles?: CSSProperties;
	desc: string;
	children?: Component[];
	parentId?: string | null;
}

interface ComponentStore {
	components: Component[];
	activeComponent: Component | null;
	hoverComponent: Component | null;
	activePosition: DOMRect | null;
	hoverPosition: DOMRect | null;
	addPage: () => void;
	addComponent: (
		component: Omit<Component, "id">,
		parentId?: string | null
	) => void;
	deleteComponent: (id: string) => void;
	updateComponent: (
		id: string,
		updates: { props?: Record<string, unknown>; styles?: CSSProperties }
	) => void;
	moveComponent: (
		componentId: string,
		newParentId: string | null,
		index?: number
	) => void;
	searchComponent: (id: string) => Component | undefined;
	setActiveComponent: (component?: Component) => void;
	setHoverComponent: (component?: Component) => void;
	setActivePosition: (position: DOMRect | null) => void;
	setHoverPosition: (position: DOMRect | null) => void;
	setComponents: (components: Component[]) => void;
	resetActiveStates: () => void;
}

/**
 * 存储组件JSON树，用于渲染页面
 */
const useComponentStore = create<ComponentStore>((set, get) => ({
	components: [
		{
			id: nanoid(10),
			name: "Page",
			props: {},
			desc: "页面",
		},
		{
			id: nanoid(10),
			name: "Page",
			props: {},
			desc: "页面",
		},
	],
	activeComponent: null,
	hoverComponent: null,
	activePosition: null,
	hoverPosition: null,
	addPage: () => {
		set((state) => ({
			components: [
				...state.components,
				{
					id: nanoid(10),
					name: "Page",
					props: {},
					desc: "页面",
				},
			],
		}));
	},
	addComponent: (component) => {
		set((state) => {
			const newComp = { ...component, id: nanoid(10) };
			const parentId = component.parentId;
			if (parentId) {
				// 获取到父级对象
				const parentComponent = getObjectById(state.components, parentId);
				if (parentComponent) {
					// eslint-disable-next-line @typescript-eslint/no-unused-expressions
					parentComponent.children
						? parentComponent.children.push(newComp)
						: (parentComponent.children = [newComp]);
				}
				// 给子对象添加父ID，方便查找
				newComp.parentId = parentId;
				return {
					components: [...state.components],
				};
			}
			// 如果没有传parentId，则添加到顶层
			return {
				components: [...state.components, newComp],
			};
		});
	},
	deleteComponent: (id) => {
		if (!id) return;
		// 先拿到子对象，再去找父对象
		const component = getObjectById(get().components, id);
		if (!component) return;
		if (!component.parentId) {
			// 顶层组件，直接删除
			set((state) => ({
				components: state.components.filter((c) => c.id !== id),
			}));
		} else {
			//递归查找父对象
			const parent = getObjectById(get().components, component.parentId);
			if (!parent || !parent.children) return;
			parent.children = parent.children.filter((c) => c.id !== id);
			set((state) => ({
				components: [...state.components],
			}));
		}
	},
	updateComponent: (id, updates) => {
		if (!id) return;
		const component = getObjectById(get().components, id);
		if (!component) return;

		console.log("Updating component:", {
			componentId: id,
			componentName: component.name,
			updates: updates,
		});

		// 更新 props
		if (updates.props) {
			// 处理空值删除逻辑
			const newProps = { ...component.props };
			Object.entries(updates.props).forEach(([key, value]) => {
				if (value === null || value === undefined || value === "") {
					delete newProps[key];
				} else {
					newProps[key] = value;
				}
			});
			component.props = newProps;
		}

		// 更新 styles
		if (updates.styles) {
			// 处理空值删除逻辑
			const newStyles = { ...(component.styles || {}) };
			Object.entries(updates.styles).forEach(([key, value]) => {
				if (value === null || value === undefined || value === "") {
					delete newStyles[key as keyof CSSProperties];
				} else {
					(newStyles as Record<string, unknown>)[key] = value;
				}
			});
			component.styles = newStyles;
		}

		console.log("Updated component:", {
			props: component.props,
			styles: component.styles,
		});

		set((state) => ({
			components: [...state.components],
		}));
	},
	searchComponent: (id) => {
		return getObjectById<Component>(get().components, id);
	},
	moveComponent: (componentId, newParentId, index) => {
		const { searchComponent } = get();
		const component = searchComponent(componentId);
		if (!component) return;

		// 1. 先从原位置移除组件
		if (component.parentId) {
			// 从父组件的children中移除
			const parent = searchComponent(component.parentId);
			if (parent?.children) {
				parent.children = parent.children.filter((c) => c.id !== componentId);
			}
		} else {
			// 从顶层移除
			set((state) => ({
				components: state.components.filter((c) => c.id !== componentId),
			}));
		}

		// 2. 添加到新位置
		component.parentId = newParentId;
		if (newParentId) {
			// 添加到指定父组件的children中
			const newParent = searchComponent(newParentId);
			if (newParent) {
				if (!newParent.children) {
					newParent.children = [];
				}
				if (index !== undefined && index >= 0) {
					newParent.children.splice(index, 0, component);
				} else {
					newParent.children.push(component);
				}
			}
		} else {
			// 添加到顶层
			set((state) => {
				const newComponents = [...state.components];
				if (index !== undefined && index >= 0) {
					newComponents.splice(index, 0, component);
				} else {
					newComponents.push(component);
				}
				return { components: newComponents };
			});
		}

		// 触发更新
		set((state) => ({
			components: [...state.components],
		}));
	},
	setActiveComponent: (component) =>
		set(() => ({
			activeComponent: component,
		})),
	setHoverComponent: (component) =>
		set(() => ({
			hoverComponent: component,
		})),
	setActivePosition: (position) =>
		set(() => ({
			activePosition: position,
		})),
	setHoverPosition: (position) =>
		set(() => ({
			hoverPosition: position,
		})),
	setComponents: (components) =>
		set(() => ({
			components,
		})),
	resetActiveStates: () =>
		set(() => ({
			activeComponent: null,
			hoverComponent: null,
			activePosition: null,
			hoverPosition: null,
		})),
}));

export default useComponentStore;
