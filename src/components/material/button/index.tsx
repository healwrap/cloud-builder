import React from "react";
import { Button as AntdButton, ButtonProps as AntdButtonProps } from "antd";

export interface ButtonProps {
	type: AntdButtonProps["type"];
	text: string;
}

export default function Button(props: ButtonProps) {
	return <AntdButton {...props}>{props.text}</AntdButton>;
}
