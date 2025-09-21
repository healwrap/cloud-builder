import { create } from "zustand";
import Container from "@/components/material/container";
import Button from "@/components/material/button";
import Page from "@/components/material/page";

export interface ComponentSetter {
	name: string;
	label: string;
	type: string;
	[key: string]: unknown;
}

export interface ComponentConfig {
	name: ComponentName;
	defaultProps: Record<string, unknown>;
	desc: string;
	setter?: ComponentSetter[];
	styleSetter?: ComponentSetter[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: React.ComponentType<any>;
}

export type ComponentName = "Button" | "Page" | "Container";

export interface ComponentConfigStore {
	componentConfig: {
		[key in ComponentName]?: ComponentConfig;
	};
	registerComponent: (
		name: ComponentName,
		componentConfig: ComponentConfig
	) => void;
}

/**
 * 用于存储组件映射关系，可以从配置中获取真实组件
 */
const useComponentConfigStore = create<ComponentConfigStore>((set) => ({
	componentConfig: {
		Container: {
			name: "Container",
			defaultProps: {},
			desc: "容器",
			component: Container,
		},
		Button: {
			name: "Button",
			defaultProps: {
				text: "按钮",
				type: "primary",
			},
			desc: "按钮",
			component: Button,
		},
		Page: {
			name: "Page",
			defaultProps: {},
			desc: "页面",
			component: Page,
		},
	},
	registerComponent(name, componentConfig) {
		set((state) => {
			return {
				...state,
				componentConfig: {
					...state.componentConfig,
					[name]: componentConfig,
				},
			};
		});
	},
}));

export default useComponentConfigStore;
