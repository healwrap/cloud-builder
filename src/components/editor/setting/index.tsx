import AttrEditor from "@/components/setting/attr-editor";
import EventEditor from "@/components/setting/event-editor";
import JSONEditor from "@/components/setting/json-editor";
import StyleEditor from "@/components/setting/style-editor";
import useComponentStore from "@/stores/component";
import { Segmented } from "antd";
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
			<div className="p-3">
				<Segmented
					options={options}
					value={key}
					block
					onChange={(value) => setKey(value as TabKey)}
				/>
			</div>

			<div className="px-3 pb-3 overflow-y-auto h-screen">
				{key === "attr" && <AttrEditor />}
				{key === "style" && <StyleEditor />}
				{key === "event" && <EventEditor />}
				{key === "json" && <JSONEditor />}
			</div>
		</div>
	);
}
