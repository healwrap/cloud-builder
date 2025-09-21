import useComponentStore from "@/stores/component";
import useComponentConfigStore, {
	ComponentName,
} from "@/stores/component-config";
import { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { nanoid } from "nanoid";

interface UseMaterialDropProps {
	accept: ComponentName[];
}

export default function useMaterialDrop({ accept }: UseMaterialDropProps) {
	const { componentConfig } = useComponentConfigStore();
	const { components, addComponent } = useComponentStore();
	const dropRef = useRef<HTMLDivElement>(null);
	const [{ isOver }, drop] = useDrop(() => ({
		accept,
		drop: (item: { type: ComponentName }, monitor) => {
			// 如果已经被处理，则不再处理
			if (monitor.didDrop()) {
				return;
			}
			// 获取拖拽目标元素
			const dropTarget = monitor.getClientOffset();
			if (!dropTarget) {
				return;
			}
			const dropElement = document.elementFromPoint(dropTarget.x, dropTarget.y);
			const targetId = dropElement?.getAttribute("data-component-id");

			// 在此处理拖拽放置逻辑
			console.log("Item dropped:", item, "targetId:", targetId);
			addComponent({
				id: nanoid(10),
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

	return {
		isOver,
		dropRef,
	};
}
