import useComponentStore from "@/stores/component";
import useComponentConfigStore, {
	ComponentSetter,
} from "@/stores/component-config";
import { Form, Input, InputNumber, Select, ColorPicker } from "antd";
import type { SelectProps } from "antd";
import React, { useEffect } from "react";
import { CSSProperties } from "react";

// 渲染表单元素
function renderFormElement(setter: ComponentSetter) {
	const { type, options } = setter;

	switch (type) {
		case "select":
			return <Select options={options as SelectProps["options"]} />;
		case "input":
			return <Input />;
		case "inputNumber":
			return <InputNumber />;
		case "colorPicker":
			return <ColorPicker format="hex" showText />;
		default:
			return <Input />;
	}
}

export default function StyleEditor() {
	const [form] = Form.useForm();
	const { componentConfig } = useComponentConfigStore();
	const { activeComponent, updateComponentStyles, removeComponentStyles } =
		useComponentStore();

	const componentType = activeComponent?.name;
	const currentConfig = componentType ? componentConfig[componentType] : null;

	useEffect(() => {
		if (activeComponent) {
			// 设置表单值，包括基本信息和样式
			form.setFieldsValue({
				id: activeComponent.id,
				name: activeComponent.name,
				desc: activeComponent.desc,
				...(activeComponent.styles || {}),
			});
		}
	}, [activeComponent, form]);

	const handleValuesChange = (changedValues: Record<string, unknown>) => {
		if (activeComponent) {
			// 分别收集要更新的样式和要删除的样式
			const styleChanges: Record<string, string | number> = {};
			const stylesToRemove: string[] = [];

			// 过滤掉id、name和desc字段
			Object.keys(changedValues).forEach((key) => {
				if (!["id", "name", "desc"].includes(key)) {
					const value = changedValues[key];

					// 检查值是否为空（null、undefined、空字符串）
					if (value === null || value === undefined || value === "") {
						stylesToRemove.push(key);
						return;
					}

					// 处理不同类型的值
					if (typeof value === "string" || typeof value === "number") {
						styleChanges[key] = value;
					} else if (value && typeof value === "object") {
						// 处理颜色选择器返回的对象
						const colorObj = value as Record<string, unknown>;
						if (
							"toHexString" in colorObj &&
							typeof colorObj.toHexString === "function"
						) {
							// Ant Design ColorPicker 返回的颜色对象
							styleChanges[key] = (colorObj.toHexString as () => string)();
						} else if ("hex" in colorObj && typeof colorObj.hex === "string") {
							// 如果对象包含 hex 属性
							styleChanges[key] = colorObj.hex;
						} else {
							// 尝试转换为字符串
							const stringValue = String(value);
							if (
								stringValue &&
								stringValue !== "undefined" &&
								stringValue !== "null"
							) {
								styleChanges[key] = stringValue;
							} else {
								stylesToRemove.push(key);
							}
						}
					}
				}
			});

			// 先删除空值对应的样式
			if (stylesToRemove.length > 0) {
				removeComponentStyles(activeComponent.id, stylesToRemove);
			}

			// 再更新有值的样式
			if (Object.keys(styleChanges).length > 0) {
				updateComponentStyles(
					activeComponent.id,
					styleChanges as unknown as CSSProperties
				);
			}
		}
	};

	if (!activeComponent) {
		return <div>请选择一个组件</div>;
	}

	return (
		<div className="my-4 overflow-auto">
			<Form
				form={form}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 14 }}
				onValuesChange={handleValuesChange}
			>
				<Form.Item label="ID" name="id">
					<Input disabled />
				</Form.Item>
				<Form.Item label="名称" name="name">
					<Input disabled />
				</Form.Item>
				<Form.Item label="描述" name="desc">
					<Input disabled />
				</Form.Item>

				{currentConfig?.styleSetter?.map((item) => (
					<Form.Item key={item.name} label={item.label} name={item.name}>
						{renderFormElement(item)}
					</Form.Item>
				))}
			</Form>
		</div>
	);
}
