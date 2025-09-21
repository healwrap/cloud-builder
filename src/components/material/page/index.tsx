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
		<div ref={dropRef} className={`page h-full overflow-auto`} {...props}>
			{props.children}
		</div>
	);
}
