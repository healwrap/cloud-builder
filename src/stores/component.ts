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
	addComponent: (component: Component, parentId?: string | null) => void;
	deleteComponent: (id: string) => void;
	updateComponent: (id: string, newProps: Record<string, unknown>) => void;
	searchComponent: (id: string) => Component | undefined;
	setActiveComponent: (component?: Component) => void;
	setHoverComponent: (component?: Component) => void;
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
	],
	activeComponent: null,
	hoverComponent: null,
	addComponent: (component) => {
		set((state) => {
			const parentId = component.parentId;
			if (parentId) {
				// 获取到父级对象
				const parentComponent = getObjectById(state.components, parentId);
				if (parentComponent) {
					// eslint-disable-next-line @typescript-eslint/no-unused-expressions
					parentComponent.children
						? parentComponent.children.push(component)
						: (parentComponent.children = [component]);
				}
				// 给子对象添加父ID，方便查找
				component.parentId = parentId;
				return {
					components: [...state.components],
				};
			}
			// 如果没有传parentId，则添加到顶层
			return {
				components: [...state.components, component],
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
	updateComponent: (id, newProps) => {
		if (!id) return;
		const component = getObjectById(get().components, id);
		if (!component) return;
		Object.assign(component.props, newProps);
		set((state) => ({
			components: [...state.components],
		}));
	},
	searchComponent: (id) => {
		return getObjectById<Component>(get().components, id);
	},
	setActiveComponent: (component) =>
		set(() => ({
			activeComponent: component,
		})),
	setHoverComponent: (component) =>
		set(() => ({
			hoverComponent: component,
		})),
}));

export default useComponentStore;
