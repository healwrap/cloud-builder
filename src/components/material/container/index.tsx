import useMaterialDrop from "@/hooks/useMaterialDrop";
import React, { ReactNode } from "react";

interface ContainerProps {
	children: ReactNode;
}

export default function Container(props: ContainerProps) {
	const { dropRef } = useMaterialDrop();
	return (
		<div ref={dropRef} className={`container box-border`} {...props}>
			{props.children}
		</div>
	);
}
