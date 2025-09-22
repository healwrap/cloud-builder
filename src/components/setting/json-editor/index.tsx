import useComponentStore from "@/stores/component";
import React from "react";
import { Editor } from "@monaco-editor/react";

export default function JSONEditor() {
	const { activeComponent } = useComponentStore();
	return (
		<Editor
			className="overflow-auto h-[80vh] w-full"
			language="json"
			value={JSON.stringify(activeComponent, null, 2)}
			options={{ readOnly: true }}
		/>
	);
}
