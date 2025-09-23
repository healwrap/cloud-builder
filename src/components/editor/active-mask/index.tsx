import { Component } from "@/stores/component";
import { Trash2, X } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import { Popconfirm } from "antd";

interface ActiveMaskProps {
	position: DOMRect | null;
	hoverComponent: Component;
	tagRef?: React.RefObject<HTMLDivElement | null>;
	onDelete?: (component: Component) => void;
	onClose?: () => void;
}

export default function ActiveMask({
	position,
	hoverComponent,
	tagRef,
	onDelete,
	onClose,
}: ActiveMaskProps) {
	if (!position) return null;
	const { top, left, width, height } = position;
	const tagWidth = 90; // 增加宽度以适应删除按钮
	const tagHeight = 24; // 增加高度使按钮更易点击
	const tagTop = top - tagHeight;
	const tagLeft = left + width - tagWidth;
	return createPortal(
		<div className="mask-container absolute w-0 h-0 top-0 left-0">
			<div
				className="absolute mask border-2 border-dashed border-blue-500 pointer-events-none transition-all duration-75 ease-linear" // bg-blue-500/20
				style={{ top, left, width, height }}
			></div>
			<div
				ref={tagRef}
				className="absolute tag text-white text-xs rounded-sm flex items-center justify-between px-2"
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
								<div
									onClick={(e) => e.stopPropagation()}
									className="cursor-pointer hover:bg-white/20 rounded transition-colors"
								>
									<Trash2 size={14} />
								</div>
							</Popconfirm>
						</div>
					)}
					{onClose && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onClose();
							}}
							className="cursor-pointer hover:bg-white/20 rounded transition-colors"
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
