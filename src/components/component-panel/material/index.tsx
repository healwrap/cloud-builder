import useComponentConfigStore from "@/stores/component-config";
import React, { useMemo } from "react";
import MaterialItem from "./material-item";

export default function Material() {
	const { componentConfig } = useComponentConfigStore();

	const components = useMemo(() => {
		const all = Object.values(componentConfig).map((item) => item.name);
		return all.filter((name) => name !== "Page");
	}, [componentConfig]);

	return (
		<div>
			{components.map((item, index) => (
				<MaterialItem key={index} name={item} />
			))}
		</div>
	);
}
