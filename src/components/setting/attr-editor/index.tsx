import useComponentStore from "@/stores/component";
import useComponentConfigStore, {
	ComponentSetter,
} from "@/stores/component-config";
import { Form, Input, Select } from "antd";
import React, { useEffect } from "react";

function renderFormElement(setter: ComponentSetter) {
	const { type, options } = setter;
	if (type === "select") {
		// 下拉框
		// @ts-expect-error 忽略类型错误
		return <Select options={options} />;
	} else if (type === "input") {
		return <Input />;
	}
	return <Input />;
}

export default function AttrEditor() {
	const [form] = Form.useForm();
	const { componentConfig } = useComponentConfigStore();
	const { activeComponent, updateComponent } = useComponentStore();

	const componentType = activeComponent?.name;
	const currentConfig = componentType ? componentConfig[componentType] : null;

	useEffect(() => {
		if (activeComponent && currentConfig) {
			// 获取当前组件配置支持的所有属性字段
			const supportedPropFields =
				currentConfig.setter?.map((setter) => setter.name) || [];

			// 创建完整的表单值对象，包含基本信息和属性
			const formValues: Record<string, unknown> = {
				id: activeComponent.id,
				name: activeComponent.name,
				desc: activeComponent.desc,
			};

			// 为所有支持的属性字段设置值（如果组件有该属性）或设置为 undefined（清空字段）
			supportedPropFields.forEach((field) => {
				formValues[field] = activeComponent.props?.[field] || undefined;
			});

			form.setFieldsValue(formValues);
		} else {
			form.resetFields();
		}
	}, [activeComponent, currentConfig, form]);

	const handleValuesChange = (changedValues: Record<string, unknown>) => {
		if (activeComponent) {
			// 只更新组件的props属性，不更新id、name和desc
			const propChanges: Record<string, unknown> = {};

			// 过滤掉id、name和desc字段
			Object.keys(changedValues).forEach((key) => {
				if (!["id", "name", "desc"].includes(key)) {
					propChanges[key] = changedValues[key];
				}
			});

			// 只有当有属性变化时才更新
			if (Object.keys(propChanges).length > 0) {
				updateComponent(activeComponent.id, { props: propChanges });
			}
		}
	};

	return (
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

			{currentConfig?.setter?.map((item) => (
				<Form.Item key={item.name} label={item.label} name={item.name}>
					{renderFormElement(item)}
				</Form.Item>
			))}
		</Form>
	);
}
