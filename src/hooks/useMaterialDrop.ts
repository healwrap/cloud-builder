import useComponentStore from "@/stores/component";
import useComponentConfigStore, {
	ComponentName,
} from "@/stores/component-config";
import { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";

export default function useMaterialDrop() {
	const { componentConfig } = useComponentConfigStore();
	const { addComponent, searchComponent, setHoverComponent, setHoverPosition } =
		useComponentStore();
	const dropRef = useRef<HTMLDivElement>(null);
	const [{ isOver }, drop] = useDrop(() => ({
		accept: Object.keys(componentConfig) as ComponentName[],
		hover: (item: { type: ComponentName }, monitor) => {
			if (!monitor.isOver({ shallow: true })) {
				return;
			}

			// 获取拖拽目标元素
			const dropTarget = monitor.getClientOffset();
			if (!dropTarget) {
				return;
			}

			let dropElement = document.elementFromPoint(dropTarget.x, dropTarget.y);
			let targetId = dropElement?.getAttribute("data-component-id");

			// 递归查找最近的可添加子元素的父组件
			let parent = searchComponent(targetId || "");
			let parentConfig = parent ? componentConfig[parent.name] : undefined;
			while (parent && (!parentConfig || !parentConfig.hasChildren)) {
				// 向上查找父节点
				const parentElement = dropElement?.parentElement;
				if (!parentElement) break;
				dropElement = parentElement;
				targetId = dropElement.getAttribute("data-component-id");
				parent = searchComponent(targetId || "");
				parentConfig = parent ? componentConfig[parent.name] : undefined;
			}

			// 如果找到了可容纳的父组件，设置 hover 状态
			if (parent && parentConfig && parentConfig.hasChildren && dropElement) {
				setHoverComponent(parent);
				const rect = dropElement.getBoundingClientRect();
				setHoverPosition(rect);
			} else {
				// 如果没有找到可容纳的父组件，清除 hover 状态
				setHoverComponent(undefined);
			}
		},
		drop: (item: { type: ComponentName }, monitor) => {
			// 拖拽完成后清除 hover 状态
			setHoverComponent(undefined);

			// 如果已经被处理，则不再处理
			if (monitor.didDrop()) {
				return;
			}
			// 获取拖拽目标元素
			const dropTarget = monitor.getClientOffset();
			if (!dropTarget) {
				return;
			}
			let dropElement = document.elementFromPoint(dropTarget.x, dropTarget.y);
			let targetId = dropElement?.getAttribute("data-component-id");

			// 递归查找最近的可添加子元素的父组件
			let parent = searchComponent(targetId || "");
			let parentConfig = parent ? componentConfig[parent.name] : undefined;
			while (parent && (!parentConfig || !parentConfig.hasChildren)) {
				// 向上查找父节点
				const parentElement = dropElement?.parentElement;
				if (!parentElement) break;
				dropElement = parentElement;
				targetId = dropElement.getAttribute("data-component-id");
				parent = searchComponent(targetId || "");
				parentConfig = parent ? componentConfig[parent.name] : undefined;
			}

			if (!parent || !parentConfig || !parentConfig.hasChildren) {
				// 没有找到可添加子元素的父组件
				return;
			}

			addComponent({
				name: item.type,
				desc: componentConfig[item.type]?.desc || "",
				props: componentConfig[item.type]?.defaultProps || {},
				parentId: targetId,
			});
			// 返回一个对象表示处理完成，阻止冒泡
			return { handled: true };
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver({ shallow: true }),
		}),
	}));

	// 将 drop 函数应用到 ref 上
	useEffect(() => {
		drop(dropRef);
	}, [drop]);

	// 组件卸载时清除 hover 状态
	useEffect(() => {
		return () => {
			setHoverComponent(undefined);
		};
	}, [setHoverComponent]);

	return {
		isOver,
		dropRef,
	};
}
