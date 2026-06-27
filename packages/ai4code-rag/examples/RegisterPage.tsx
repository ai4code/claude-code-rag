import { useState } from "react";
import { AForm, AInput, AButton, useForm } from "@ai4code/ui";
import type { FormInstance, RuleItem } from "@ai4code/ui/form";

/**
 * 用户注册页面
 *
 * 使用 @ai4code/ui 组件：
 * - AForm: 表单容器，统一管理数据和校验
 * - AInput: 表单输入框，自动联动校验信息
 * - AButton: 提交按钮，支持 loading 态
 */
export function RegisterPage() {
  const [form] = useForm<FormInstance>();
  const [loading, setLoading] = useState(false);

  /** 注册表单规则 */
  const rules: Record<string, RuleItem[]> = {
    username: [
      { required: true, message: "请输入用户名" },
      { min: 3, max: 20, message: "用户名长度为 3-20 个字符" },
    ],
    email: [
      { required: true, message: "请输入邮箱" },
      { type: "email", message: "邮箱格式不正确" },
    ],
    password: [
      { required: true, message: "请输入密码" },
      { min: 6, message: "密码至少 6 位" },
    ],
    confirmPassword: [
      { required: true, message: "请确认密码" },
      {
        validator: (_, value, form) => {
          if (value && value !== form.getFieldValue("password")) {
            return Promise.reject(new Error("两次输入的密码不一致"));
          }
          return Promise.resolve();
        },
      },
    ],
    phone: [
      {
        pattern: /^1[3-9]\d{9}$/,
        message: "手机号格式不正确",
      },
    ],
  };

  /** 提交注册 */
  const handleFinish = async (values: Record<string, string>) => {
    setLoading(true);
    try {
      // 调用注册 API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          phone: values.phone,
        }),
      });

      if (!res.ok) {
        throw new Error("注册失败");
      }

      // 注册成功，跳转或提示
      alert("注册成功！");
    } catch {
      alert("注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">创建账号</h1>
        <p className="register-desc">注册后即可使用全部功能</p>

        <AForm form={form} rules={rules} onFinish={handleFinish}>
          <AInput
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            maxLength={20}
          />

          <AInput
            name="email"
            label="邮箱"
            placeholder="请输入邮箱地址"
          />

          <AInput
            name="password"
            label="密码"
            type="password"
            placeholder="请设置密码（至少 6 位）"
          />

          <AInput
            name="confirmPassword"
            label="确认密码"
            type="password"
            placeholder="请再次输入密码"
          />

          <AInput
            name="phone"
            label="手机号（选填）"
            type="tel"
            placeholder="请输入手机号"
            maxLength={11}
          />

          <AButton type="primary" htmlType="submit" loading={loading}>
            {loading ? "注册中..." : "注册"}
          </AButton>
        </AForm>

        <p className="register-footer">
          已有账号？<a href="/login">去登录</a>
        </p>
      </div>
    </div>
  );
}
