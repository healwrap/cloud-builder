import useComponentStore from "@/stores/component";
import React from "react";

export default function Setting() {
	const { activeComponent } = useComponentStore();
	return (
		<>
			<pre className="h-[50%] overflow-auto">
				{JSON.stringify(activeComponent, null, 2)}
			</pre>
		</>
	);
}
