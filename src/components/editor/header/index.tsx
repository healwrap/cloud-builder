import React from "react";
import { Button } from "antd";

export default function EditorHeader() {
	return (
		<header className="p-3 px-6 border-b border-gray-300 bg-gray-100 flex items-center justify-between space-x-4">
			<h1 className="text-xl">云构 Cloud Builder</h1>
			<Button type="primary"> 部署</Button>
		</header>
	);
}
