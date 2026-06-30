#  基于开源claude code best 
基于mcp方式集成自定义组件库
## 通过mcp方式接入自定义的组件库 
<img src="./asset/rag.png">
<img src="./asset/rag-2.png">

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

### agent Loop

`Agent Loop 就是思考→行动→观察→再思考的无限迭代闭环，让大模型摆脱单次问答，自动完成多步骤复杂任务，是所有自主智能体（AutoGPT、ReAct、Toolformer）的底层骨架`

- Thought（思考）：模型分析当前任务与历史信息，制定下一步计划
- Action（行动）：调用工具、接口、代码、搜索、API 执行外部操作
- Observation（观测）：拿到工具返回的真实结果
- Update Context（上下文更新）：把观测结果追加到对话历史，进入下一轮循环
- 循环终止条件：任务完成 / 达到最大轮次 / 得到最终答案。

`二、标准闭环流程（ReAct 范式，最主流实现）`
输入任务 → [Thought → Action → Observation] 循环 N 次 → 输出最终答案
- Thought（推理） 模型不能直接回答，先做逻辑推演：当前信息不足，我需要联网查询天气，调用搜索工具。
- Action（执行动作） 输出结构化指令，脱离纯文本生成，触发外部能力
- Observation（环境反馈） 输出结构化指令，脱离纯文本生成，触发外部能力
- 上下文拼接 把思考 + 动作 + 观测全部写入 prompt 
- 当模型 Thought 判断：信息足够，无需再调用工具，直接给出最终结论，Loop 结束。

### 两种经典 Agent Loop 架构
#### ReAct 循环（串行单步循环）
`一轮只做一次思考 + 一次工具调用，步骤清晰、可控，工业界首选。
优点：上下文可控、不易发散、便于限流与日志追踪。
缺点：长任务轮次较多。`


#### Plan-Solve 双层循环（分层智能体）
- 外层 Loop：Planner 持续拆解目标，生成子任务清单
- 内层 Loop：Executor 循环执行单个子任务，反复调用工具
- 适合长链路复杂任务：数据分析、项目拆解、自动爬虫、代码工程。

### 底层技术要点
#### 状态上下文（Memory）
Loop 能否持续运行，取决于记忆机制：
- 短期记忆：窗口内对话历史（本轮 Loop 的 Thought/Action/Observation）
- 长期记忆：向量数据库，把历史任务向量化，按需召回过往经验，避免上下文溢出。
#### Action 解析（关键工程点）
大模型输出自然文本，程序必须可靠截取工具调用指令：
- 方案 A：JSON 格式输出，用正则 / 解析器捕获函数调用
- 方案 B：使用函数调用（Function Calling），模型原生输出结构化工具参数，无需额外解析。
#### 防死循环机制
必须设置约束：
- 最大迭代轮次（max_iterations，一般 5~20 轮）
- 重复检测：连续多轮调用同一个工具且无新观测结果，自动终止
- 上下文长度保护，防止 prompt 无限膨胀。