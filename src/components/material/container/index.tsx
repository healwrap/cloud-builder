import React, { PropsWithChildren, ReactNode } from "react";

interface ContainerProps {
	children: ReactNode;
}

export default function Container(props: ContainerProps) {
	return (
		<div
			className="container mx-auto px-4 border border-b-fuchsia-400"
			{...props}
		>
			{props.children}
		</div>
	);
}
