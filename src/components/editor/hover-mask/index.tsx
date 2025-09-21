import { Component } from "@/stores/component";
import { Trash2 } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

interface HoverMaskProps {
	position: DOMRect | null;
	hoverComponent: Component;
	tagRef?: React.RefObject<HTMLDivElement | null>;
	onDelete?: (component: Component) => void;
}

export default function HoverMask({
	position,
	hoverComponent,
	tagRef,
	onDelete,
}: HoverMaskProps) {
	if (!position) return null;
	const { top, left, width, height } = position;
	const tagWidth = 90; // 增加宽度以适应删除按钮
	const tagHeight = 24; // 增加高度使按钮更易点击
	const tagTop = top - tagHeight;
	const tagLeft = left + width - tagWidth;
	return createPortal(
		<div className="mask-container absolute w-0 h-0 top-0 left-0">
			<div
				className="absolute mask border-2 border-dashed border-blue-500 bg-blue-500/20 pointer-events-none transition-all duration-75 ease-linear"
				style={{ top, left, width, height }}
			></div>
			<div
				ref={tagRef}
				className="absolute tag cursor-move text-white text-xs rounded-sm flex items-center justify-between px-2"
				style={{
					top: tagTop,
					left: tagLeft,
					width: tagWidth,
					height: tagHeight,
					backgroundColor: "blue",
				}}
			>
				<span>{hoverComponent.name}</span>
				{onDelete && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							onDelete(hoverComponent);
						}}
						className="transition-colors ml-1 cursor-pointer"
					>
						<Trash2 size={14} />
					</button>
				)}
			</div>
		</div>,
		document.body
	);
}
