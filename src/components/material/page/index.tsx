import useMaterialDrop from "@/hooks/useMaterialDrop";
import React, { ReactNode } from "react";

interface PageProps {
	children: ReactNode;
}

export default function Page(props: PageProps) {
	const { dropRef } = useMaterialDrop();
	return (
		<div
			ref={dropRef}
			className={`page shrink-0 h-full overflow-auto bg-white`}
			{...props}
		>
			{props.children}
		</div>
	);
}
