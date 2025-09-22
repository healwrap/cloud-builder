import React, { ReactNode } from "react";

interface TextProps {
	type?: string;
	text: ReactNode;
}

export default function Text(props: TextProps) {
	// 从props中解构出type和text，剩余属性放入rest
	const { type, text, ...rest } = props;
	return React.createElement(type || "span", rest, text);
}
