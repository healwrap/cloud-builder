import React, { ReactNode } from "react";

interface PageProps {
	children: ReactNode;
}

export default function Page(props: PageProps) {
	return (
		<div className="w-full h-full p-6 border-[1px] border-black" {...props}>
			{props.children}
		</div>
	);
}
