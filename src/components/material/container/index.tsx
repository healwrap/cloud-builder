import useMaterialDrop from "@/hooks/useMaterialDrop";
import React, { PropsWithChildren, ReactNode } from "react";

interface ContainerProps {
	children: ReactNode;
}

export default function Container(props: ContainerProps) {
	const { isOver, dropRef } = useMaterialDrop();
	return (
		<div
			ref={dropRef}
			className={`container mx-auto p-4  ${
				isOver ? "border-1 border-blue-300" : "border-1 border-black"
			}`}
			{...props}
		>
			{props.children}
		</div>
	);
}
