import React from "react";
import { createPortal } from "react-dom";

interface HoverMaskProps {
	position: DOMRect | null;
}

export default function HoverMask({ position }: HoverMaskProps) {
	if (!position) return null;
	const { top, left, width, height } = position;
	return createPortal(
		<div
			className="absolute border border-blue-500 border-dashed pointer-events-none transition-all duration-75 ease-linear"
			style={{ top, left, width, height }}
		></div>,
		document.body
	);
}
