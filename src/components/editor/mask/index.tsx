import { Component } from "@/stores/component";
import { ClosedCaption, Trash2, X } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import { Popconfirm } from "antd";

interface MaskProps {
	position: DOMRect | null;
	hoverComponent: Component;
	tagRef?: React.RefObject<HTMLDivElement | null>;
	onDelete?: (component: Component) => void;
	onClose?: () => void;
}

export default function Mask({
	position,
	hoverComponent,
	tagRef,
	onDelete,
	onClose,
}: MaskProps) {
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
				<span>{hoverComponent.desc}</span>
				<div className="flex items-center gap-1">
					{onDelete && (
						<div onClick={(e) => e.stopPropagation()}>
							<Popconfirm
								title="确定删除该组件吗？"
								onConfirm={(e) => {
									e?.stopPropagation();
									onDelete(hoverComponent);
								}}
							>
								<button
									onClick={(e) => e.stopPropagation()}
									className="transition-colors ml-1 cursor-pointer"
								>
									<Trash2 size={14} />
								</button>
							</Popconfirm>
						</div>
					)}
					{onClose && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onClose();
							}}
							className="transition-colors cursor-pointer"
						>
							<X size={14} />
						</button>
					)}
				</div>
			</div>
		</div>,
		document.body
	);
}
