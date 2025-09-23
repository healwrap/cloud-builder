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
			className={`container box-border`}
			{...props}
		>
			{props.children}
		</div>
	);
}
