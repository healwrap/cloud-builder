import useComponentStore, { Component } from "@/stores/component";
import useComponentConfigStore, {
	ComponentConfigStore,
	ComponentName,
} from "@/stores/component-config";
import React, { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { nanoid } from "nanoid";

/**
 * 将JSON树渲染为组件
 * @param components
 * @param config
 * @returns
 */
function renderComponent(
	components: Component[],
	config: ComponentConfigStore["componentConfig"]
): React.ReactNode {
	return components.map((comp) => {
		// 获取组件相应的配置
		const compConfig = config[comp.name];
		if (!compConfig || !compConfig.component) return null;
		const props = {
			key: comp.id,
			name: comp.name,
			styles: comp.styles,
			...compConfig.defaultProps,
			...comp.props,
		};
		// const children =
		return React.createElement(
			compConfig.component,
			props,
			renderComponent(comp.children || [], config)
		);
	});
}

export default function Canvas() {
	const { componentConfig } = useComponentConfigStore();
	const { components, addComponent } = useComponentStore();
	const dropRef = useRef<HTMLDivElement>(null);
	const [{ isOver }, drop] = useDrop(() => ({
		accept: ["Button", "Container"],
		drop: (item: { type: ComponentName }) => {
			// 在此处理拖拽放置逻辑
			console.log("Item dropped:", item);
			addComponent({
				id: nanoid(10),
				name: item.type,
				desc: componentConfig[item.type]?.desc || "",
				props: componentConfig[item.type]?.defaultProps || {},
				parentId: "1",
			});
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	// 将 drop 函数应用到 ref 上
	useEffect(() => {
		drop(dropRef);
	}, [drop]);

	return (
		<div
			ref={dropRef}
			className={`${
				isOver ? "border-2 border-blue-300" : "border-2 border-transparent"
			} h-full overflow-auto`}
		>
			<pre className="h-[50%] overflow-auto">{JSON.stringify(components, null, 2)}</pre>
			<div>{renderComponent(components, componentConfig)}</div>
		</div>
	);
}
