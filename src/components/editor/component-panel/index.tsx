import Material from "@/components/component-panel/material";
import Outline from "@/components/component-panel/outline";
import { Tabs } from "antd";
import React from "react";

export default function ComponentPanel() {
	const items = [
		{
			key: "1",
			label: "物料",
			children: (
				<div className="py-2">
					<Material />
				</div>
			),
		},
		{
			key: "2",
			label: "大纲",
			children: (
				<div className="py-2">
					<Outline />
				</div>
			),
		},
		{
			key: '3',
			label: 'AI助手',
			children: 'AI助手',
		},
	];

	return <Tabs tabPosition="left" className="h-full" items={items} />;
}
