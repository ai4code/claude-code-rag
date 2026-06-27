组件名称：AButton
所属包：@ai4code/ui/button
类型：主按钮/普通按钮

Props：
1. htmlType?: 'submit' | 'button'
2. type?: 'primary' | 'default'
3. loading?: boolean 提交时加载态

登录页标准写法：
<AButton type="primary" htmlType="submit" loading={loading}>
  登录
</AButton>