组件名称：AForm
所属包：@ai4code/ui/form
作用：统一管理数据、校验规则、提交事件。

Props：
1. form: FormInstance 由useForm创建的表单实例
2. rules: Record<string, RuleItem[]> 校验规则集合
3. onFinish: (values)=>Promise<void> 表单校验通过后的提交回调

内置方法：
form.validateFields() 触发全局校验，校验失败自动在对应表单项提示文字。

示例：
const { form, rules } = useLoginForm()
<AForm form={form} rules={rules} onFinish={handleSubmit}>
  {/* 内部放置BizInput、BizButton */}
</AForm>