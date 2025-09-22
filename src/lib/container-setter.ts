const ContainerSetter = [];
const ContainerStyleSetter = [
  {
    name: "display",
    label: "显示方式",
    type: "select",
    options: [
      { label: "块级元素", value: "block" },
      { label: "行内元素", value: "inline" },
      { label: "行内块元素", value: "inline-block" },
      { label: "弹性盒子", value: "flex" },
      { label: "网格布局", value: "grid" },
    ],
  },
  {
    name: 'flex-direction',
    label: '主轴方向',
    type: 'select',
    options: [
      { label: '横向（从左到右）', value: 'row' },
      { label: '横向（从右到左）', value: 'row-reverse' },
      { label: '纵向（从上到下）', value: 'column' },
      { label: '纵向（从下到上）', value: 'column-reverse' },
    ],
  },
  {
    name: 'justify-content',
    label: '主轴对齐',
    type: 'select',
    options: [
      { label: '左对齐', value: 'flex-start' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'flex-end' },
      { label: '两端对齐', value: 'space-between' },
      { label: '均匀分布', value: 'space-around' },
    ],
  },
  {
    name: 'align-items',
    label: '交叉轴对齐',
    type: 'select',
    options: [
      { label: '顶部对齐', value: 'flex-start' },
      { label: '居中', value: 'center' },
      { label: '底部对齐', value: 'flex-end' },
      { label: '拉伸', value: 'stretch' },
    ],
  },
  {
    name: "margin",
    label: "外边距",
    type: "input",
  },
  {
    name: "padding",
    label: "内边距",
    type: "input",
  },
	{
		name: "width",
		label: "宽度",
		type: "inputNumber",
	},
	{
		name: "height",
		label: "高度",
		type: "inputNumber",
	},
  {
    name: "background-color",
    label: "背景颜色",
    type: "colorPicker",
  },
  {
    name: "border-width",
    label: "边框宽度",
    type: "inputNumber",
  },
  {
    name: "border-style",
    label: "边框样式",
    type: "select",
    options: [
      { label: "实线", value: "solid" },
      { label: "虚线", value: "dashed" },
      { label: "点线", value: "dotted" },
      { label: "双线", value: "double" },
      { label: "无", value: "none" },
    ],
  },
  {
    name: "border-color",
    label: "边框颜色",
    type: "colorPicker",
  },
];

export { ContainerSetter, ContainerStyleSetter };
