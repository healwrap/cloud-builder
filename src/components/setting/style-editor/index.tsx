import useComponentStore from "@/stores/component";
import useComponentConfigStore, {
	ComponentSetter,
} from "@/stores/component-config";
import { Editor } from "@monaco-editor/react";
import {
	Form,
	Input,
	InputNumber,
	Select,
	ColorPicker,
	Splitter,
	Divider,
} from "antd";
import type { SelectProps } from "antd";
import React, { useEffect } from "react";
import { CSSProperties } from "react";

// 处理表单值转换的工具函数
function processFormValue(value: unknown): string | number | null {
	// 空值处理
	if (value === null || value === undefined || value === "") {
		return null;
	}

	// 基本类型直接返回
	if (typeof value === "string" || typeof value === "number") {
		return value;
	}

	// 颜色对象处理
	if (value && typeof value === "object") {
		const colorObj = value as Record<string, unknown>;
		if (
			"toHexString" in colorObj &&
			typeof colorObj.toHexString === "function"
		) {
			return (colorObj.toHexString as () => string)();
		}
		if ("hex" in colorObj && typeof colorObj.hex === "string") {
			return colorObj.hex;
		}
		// 其他对象转换为字符串
		const stringValue = String(value);
		return stringValue === "undefined" || stringValue === "null"
			? null
			: stringValue;
	}

	return null;
}

// 渲染表单元素
function renderFormElement(setter: ComponentSetter) {
	const { type, options } = setter;

	switch (type) {
		case "select":
			return <Select options={options as SelectProps["options"]} allowClear />;
		case "input":
			return <Input allowClear />;
		case "inputNumber":
			return <InputNumber />;
		case "colorPicker":
			return <ColorPicker format="hex" showText allowClear />;
		default:
			return <Input allowClear />;
	}
}

export default function StyleEditor() {
	const [form] = Form.useForm();
	const { componentConfig } = useComponentConfigStore();
	const { activeComponent, updateComponent } = useComponentStore();

	const componentType = activeComponent?.name;
	const currentConfig = componentType ? componentConfig[componentType] : null;

	// 修复表单值切换问题
	useEffect(() => {
		if (activeComponent && currentConfig) {
			// 获取当前组件配置支持的所有样式字段
			const supportedStyleFields =
				currentConfig.styleSetter?.map((setter) => setter.name) || [];

			// 创建完整的表单值对象，包含基本信息和样式
			const formValues: Record<string, unknown> = {};

			// 为所有支持的样式字段设置值（如果组件有该样式）或设置为 undefined（清空字段）
			supportedStyleFields.forEach((field) => {
				formValues[field] =
					activeComponent.styles?.[field as keyof CSSProperties] || undefined;
			});

			form.setFieldsValue(formValues);
		} else {
			form.resetFields();
		}
	}, [activeComponent, currentConfig, form]);

	const handleValuesChange = (changedValues: Record<string, unknown>) => {
		if (!activeComponent) return;

		// 过滤并处理样式值
		const styleUpdates: Record<string, string | number | null> = {};

		Object.entries(changedValues).forEach(([key, value]) => {
			styleUpdates[key] = processFormValue(value);
		});

		// 只有当有样式变化时才更新
		if (Object.keys(styleUpdates).length > 0) {
			updateComponent(activeComponent.id, {
				styles: styleUpdates as CSSProperties,
			});
		}
	};

	if (!activeComponent) {
		return <div className="p-4 text-gray-500">请选择一个组件</div>;
	}

	return (
		<div className="my-4 overflow-auto">
			<Form
				form={form}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 14 }}
				onValuesChange={handleValuesChange}
			>
				{currentConfig?.styleSetter?.map((item) => (
					<Form.Item key={item.name} label={item.label} name={item.name}>
						{renderFormElement(item)}
					</Form.Item>
				))}
				<Divider>样式编辑器</Divider>
			</Form>
			<Editor
				className="overflow-auto h-[400px] w-full"
				language="css"
				defaultValue={JSON.stringify(activeComponent.styles, null, 2)}
			/>
		</div>
	);
}
