#  基于开源claude code best 学习

- step 1 通过mcp方式接入自定义的组件库 
<img src="./asset/rag.png">

## 生成代码的效果
```tsx
 import { AForm, AInput, AButton } from '@ai4code/ui'
  import { useLoginForm } from '@ai4code/ui/form'

  interface LoginPageProps {
    onLoginSuccess?: () => void
  }

  export function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const { form, rules } = useLoginForm()

    const handleSubmit = async (values: Record<string, string>) => {
      // 登录逻辑
      console.log('登录信息:', values)
      onLoginSuccess?.()
    }

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f2f5',
        }}
      >
        <div
          style={{
            width: 400,
            padding: '40px',
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: 32, color: '#333' }}>
            管理后台
          </h2>

          <AForm form={form} rules={rules} onFinish={handleSubmit}>
            <AInput
              name="username"
              label="账号"
              placeholder="请输入登录账号"
            />

            <AInput
              name="password"
              label="密码"
              type="password"
              placeholder="请输入密码"
            />

            <div style={{ marginTop: 24 }}>
              <AButton type="primary" htmlType="submit" loading={false}>
                登录
              </AButton>
            </div>
          </AForm>
        </div>
      </div>
    )
  } 
  ▎
```
 说明：组件库只包含了登录模块的 3 个组件（AButton、AForm、AInput），所以页面外围的布局容器使用了原生
  div（这不属于组件自定义属性，而是必要的外壳结构），内部的表单、输入框、按钮则完全使用组件库组件，没有添加任何自定义属性。如需管理后台首页，需要组件库补充 Layout/Sidebar/Card/Table 等组件。