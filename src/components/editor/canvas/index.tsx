import useComponentStore, { Component } from "@/stores/component";
import useComponentConfigStore, {
	ComponentConfigStore,
} from "@/stores/component-config";
import React, { useState, useCallback, Dispatch } from "react";
import ActiveMask from "../active-mask";
import useElementObserver from "@/hooks/useElementObserver";
import HoverMask from "../hover-mask";

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
		comp.styles = {
			...compConfig.defaultStyles,
			...(comp.styles || {}),
		};
		// console.log(comp.styles);

		const props = {
			key: comp.id,
			// 传递一个data属性，方便后续查找
			"data-component-id": comp.id,
			name: comp.name,
			style: comp.styles,
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
		activePosition,
		hoverPosition,
		searchComponent,
		setActiveComponent,
		setHoverComponent,
		setActivePosition,
		setHoverPosition,
		deleteComponent,
	} = useComponentStore();
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
				updatePosition(element, setHoverPosition);
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
				setActiveElement(element);
				updatePosition(element, setActivePosition);
				break;
			}
		}
	};

	function updatePosition(
		element: HTMLElement,
		setPosition: Dispatch<DOMRect>
	) {
		if (!element) return;

		// 更新当前元素的位置
		const rect = element.getBoundingClientRect();
		setPosition(rect);
	}

	// 使用自定义hook来观察活动元素的变化
	const updatePositionCallback = useCallback(() => {
		if (activeElement) {
			setActivePosition(activeElement.getBoundingClientRect());
		}
	}, [activeElement, setActivePosition]);

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
			{hoverComponent && <HoverMask position={hoverPosition} />}
			{activeComponent && (
				<ActiveMask
					position={activePosition}
					hoverComponent={activeComponent}
					onDelete={handleDeleteComponent}
					onClose={() => {
						setActiveComponent(undefined);
						setActivePosition(null);
					}}
				/>
			)}
		</div>
	);
}
