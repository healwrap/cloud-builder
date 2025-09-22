import React, { useMemo } from "react";
import { Tree, type TreeDataNode } from "antd";
import useComponentStore, { Component } from "@/stores/component";
import { getObjectById } from "@/lib/utils";

export default function Outline() {
	const { 
		components, 
		activeComponent, 
		setActiveComponent, 
		setHoverComponent,
		setActivePosition,
		setHoverPosition
	} = useComponentStore();

	// 根据组件ID查找对应的DOM元素并更新位置
	const updateComponentPosition = (componentId: string, isActive: boolean = false) => {
		// 查找具有对应 data-component-id 的元素
		const element = document.querySelector(`[data-component-id="${componentId}"]`) as HTMLElement;
		if (element) {
			const rect = element.getBoundingClientRect();
			if (isActive) {
				setActivePosition(rect);
			} else {
				setHoverPosition(rect);
			}
		}
	};

	// 将组件数据转换为 Tree 数据格式
	const treeData = useMemo(() => {
		const convertToTreeData = (component: Component): TreeDataNode => {
			return {
				key: component.id,
				title: component.desc,
				children: component.children?.map((child) => convertToTreeData(child)),
			};
		};

		return components.map((component) => convertToTreeData(component));
	}, [components]);

	// 自定义标题渲染，防止换行并添加悬停事件
	const titleRender = (nodeData: TreeDataNode) => {
		const component = getObjectById<Component>(components, nodeData.key as string);
		return (
			<div
				className="inline-flex justify-center items-center truncate text-sm"
				title={nodeData.title as string}
				onMouseEnter={() => {
					if (component) {
						setHoverComponent(component);
						updateComponentPosition(component.id, false);
					}
				}}
				onMouseLeave={() => {
					setHoverComponent();
					setHoverPosition(null);
				}}
			>
				{nodeData.title as string}
			</div>
		);
	};

	// 处理节点选择
	const onSelect = (selectedKeys: React.Key[]) => {
		if (selectedKeys.length > 0) {
			const selectedId = selectedKeys[0] as string;
			const component = getObjectById<Component>(components, selectedId);
			if (component) {
				setActiveComponent(component);
				updateComponentPosition(component.id, true);
			}
		}
	};

	return (
		<div className="overflow-auto h-full w-full">
			<Tree
				showLine
				treeData={treeData}
				selectedKeys={activeComponent ? [activeComponent.id] : []}
				onSelect={onSelect}
				titleRender={titleRender}
				defaultExpandAll
				blockNode
			/>
		</div>
	);
}
