#  基于开源claude code best 

## 通过mcp方式接入自定义的组件库 
<img src="./asset/rag.png">

### 生成代码的效果
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