import React, { useRef } from "react";
import { useDrag } from "react-dnd";

interface MaterialItemProps {
	name: string;
}

export default function MaterialItem({ name }: MaterialItemProps) {
	const elementRef = useRef<HTMLDivElement>(null);

	const [_, dragRef] = useDrag(() => ({
		type: name,
		item: {
			type: name,
		},
	}));

	// 将 dragRef 应用到 elementRef
	dragRef(elementRef);

	return (
		<div
			ref={elementRef}
			className="inline-block border border-dashed border-black cursor-pointer m-1 py-1 px-2 hover:bg-gray-100 active:bg-gray-200"
		>
			{name}
		</div>
	);
}
