import useMaterialDrop from "@/hooks/useMaterialDrop";
import useComponentStore, { Component } from "@/stores/component";
import useComponentConfigStore, {
	ComponentConfigStore,
} from "@/stores/component-config";
import React, { useState, useCallback } from "react";
import Mask from "../mask";
import useElementObserver from "@/hooks/useElementObserver";

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
		const style = {
			...compConfig.defaultStyles,
			...(comp.styles || {}),
		};
		// console.log(comp.styles);

		const props = {
			key: comp.id,
			// 传递一个data属性，方便后续查找
			"data-component-id": comp.id,
			name: comp.name,
			style,
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
	const {
		components,
		activeComponent,
		hoverComponent,
		searchComponent,
		setActiveComponent,
		setHoverComponent,
		deleteComponent,
	} = useComponentStore();
	const [position, setPosition] = useState<DOMRect | null>(null);
	const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);

	function handleMouseOver(e: React.MouseEvent) {
		const composedPath = e.nativeEvent.composedPath();
		for (const element of composedPath) {
			if (
				element instanceof HTMLElement &&
				element.hasAttribute("data-component-id")
			) {
				const id = element.getAttribute("data-component-id");
				const comp = searchComponent(id!);
				setHoverComponent(comp);
				// updatePosition(element);
				break;
			}
		}
	}

	function handleMouseLeave() {
		setHoverComponent(undefined);
	}

	const handleClick: React.MouseEventHandler = (e) => {
		const composedPath = e.nativeEvent.composedPath();
		for (const element of composedPath) {
			if (
				element instanceof HTMLElement &&
				element.hasAttribute("data-component-id")
			) {
				const id = element.getAttribute("data-component-id");
				const comp = searchComponent(id!);
				setActiveComponent(comp);
				updatePosition(element);
				// 当目标元素位置大小变化时，也要更新position
				break;
			}
		}
	};

	function updatePosition(element: HTMLElement) {
		if (!element) return;

		// 更新当前元素的位置
		const rect = element.getBoundingClientRect();
		setPosition(rect);
		setActiveElement(element);
	}

	// 使用自定义hook来观察活动元素的变化
	const updatePositionCallback = useCallback(() => {
		if (activeElement) {
			setPosition(activeElement.getBoundingClientRect());
		}
	}, [activeElement]);

	// 监听元素大小和位置变化
	useElementObserver(activeElement, updatePositionCallback, [activeComponent]);

	const handleDeleteComponent = (component: Component) => {
		if (component && component.id) {
			deleteComponent(component.id);
			setActiveComponent(undefined);
		}
	};

	return (
		<div className="h-full overflow-auto">
			<div
				className="canvas h-full flex items-center justify-center bg-gray-200 relative"
				onMouseOver={(e) => handleMouseOver(e)}
				onMouseLeave={() => handleMouseLeave()}
				onClick={handleClick}
			>
				{renderComponent(components, componentConfig)}
			</div>
			{activeComponent && (
				<Mask
					position={position}
					hoverComponent={activeComponent}
					onDelete={handleDeleteComponent}
					onClose={() => setActiveComponent(undefined)}
				/>
			)}
		</div>
	);
}
