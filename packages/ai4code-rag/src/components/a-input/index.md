组件名称：AInput
所属包：@ai4code/ui/a-input
适用场景：账号、密码、手机号等表单录入，支持表单校验联动。

Props：
1. name: string 必填，字段标识，和表单rule对应
2. label: string 表单项文字
3. placeholder: string 占位文本
4. type?: 'text' | 'password' | 'tel'
5. disabled?: boolean
6. maxLength?: number

表单联动：
会自动接收上层BizForm的校验信息，自动展示红色错误文案，无需手动写message提示。

示例代码：
<AInput name="username" label="账号" placeholder="请输入登录账号" />
<AInput name="password" label="密码" type="password" placeholder="请输入密码" />