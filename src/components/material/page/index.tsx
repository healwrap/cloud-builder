import useMaterialDrop from "@/hooks/useMaterialDrop";
import React, { ReactNode } from "react";

interface PageProps {
	children: ReactNode;
}

export default function Page(props: PageProps) {
	const { isOver, dropRef } = useMaterialDrop({
		accept: ["Button", "Container"],
	});
	return (
		<div
			ref={dropRef}
			className={`page h-full overflow-auto bg-white ${
				isOver ? "border-1 border-blue-300" : "border-1 border-transparent"
			}`}
			{...props}
		>
			{props.children}
		</div>
	);
}
