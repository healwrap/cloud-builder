import useMaterialDrop from "@/hooks/useMaterialDrop";
import useComponentStore, { Component } from "@/stores/component";
import useComponentConfigStore, {
	ComponentConfigStore,
} from "@/stores/component-config";
import React, { useState, useRef } from "react";
import HoverMask from "../hover-mask";
import useClickOutside from "@/hooks/useClickOutside";

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
			// 传递一个data属性，方便后续查找
			"data-component-id": comp.id,
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
	const tagRef = useRef<HTMLDivElement>(null);

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
				break;
			}
		}
	};

	const canvasRef = useClickOutside(() => {
		setActiveComponent(undefined);
		setHoverComponent(undefined);
	}, [tagRef]);

	function updatePosition(element: HTMLElement) {
		if (!element) return;
		const rect = element.getBoundingClientRect();
		setPosition(rect);
	}

	const handleDeleteComponent = (component: Component) => {
		if (component && component.id) {
			deleteComponent(component.id);
			setActiveComponent(undefined);
		}
	};

	return (
		<div className="h-full overflow-auto">
			{}
			<div
				ref={canvasRef}
				className="canvas h-full"
				onMouseOver={(e) => handleMouseOver(e)}
				onMouseLeave={() => handleMouseLeave()}
				onClick={handleClick}
			>
				{renderComponent(components, componentConfig)}
			</div>
			{/* {hoverComponent && (
				<HoverMask position={position} hoverComponent={hoverComponent} />
			)} */}
			{activeComponent && (
				<HoverMask
					position={position}
					hoverComponent={activeComponent}
					tagRef={tagRef}
					onDelete={handleDeleteComponent}
				/>
			)}
		</div>
	);
}
