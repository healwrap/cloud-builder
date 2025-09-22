import AttrEditor from "@/components/setting/attr-editor";
import EventEditor from "@/components/setting/event-editor";
import JSONEditor from "@/components/setting/json-editor";
import StyleEditor from "@/components/setting/style-editor";
import useComponentStore from "@/stores/component";
import { Segmented, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";

type TabKey = "attr" | "style" | "event" | "json";

export default function Setting() {
	const { activeComponent } = useComponentStore();
	const [key, setKey] = useState<TabKey>("attr");

	if (!activeComponent) {
		return (
			<div className="flex justify-center items-center h-full text-gray-500">
				请选择一个组件
			</div>
		);
	}

	const options = [
		{ label: "属性", value: "attr" },
		{ label: "样式", value: "style" },
		{ label: "事件", value: "event" },
		{ label: "JSON", value: "json" },
	];

	return (
		<div>
			<Segmented
				options={options}
				value={key}
				block
				onChange={(value) => setKey(value as TabKey)}
			/>
			<div className="my-2 overflow-auto h-[90%]">
				{key === "attr" && <AttrEditor />}
				{key === "style" && <StyleEditor />}
				{key === "event" && <EventEditor />}
				{key === "json" && <JSONEditor />}
			</div>
		</div>
	);
}
