"use client";

import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { useAuth } from "@/contexts/authContext";
import ButtonSubmit from "@/components/Button/ButtonSubmit";

type Props = {};

const validateEmail = (value: any) =>
  value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

export default function LoginPage({}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("กรุณากรอกอีเมลให้ถูกต้อง");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 8) {
      setPasswordError("กรุณากรอกรหัสผ่านขั้นต่ำ 8 ตัว");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (emailError || passwordError) return;

    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <main className="w-full flex sm:flex-col h-screen gap-24 sm:gap-4 sm:py-24 px-24 sm:px-8 bg-gradient-to-br from-[#4EDFE7] to-[#00597B]">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-fit p-8 bg-white rounded-2xl flex flex-col items-center gap-6">
          <div className="flex flex-col sm:w-full gap-4 items-center">
            <img
              src="/Surakiat-DarkBG.avif"
              alt="Logo-Surakiat"
              className="max-w-40"
            />
            <div className="login-head flex flex-col gap-2 items-center">
              <h1 className="text-center text-[#383A48] font-bold text-[24px] sm:text-[18px]">
                Surakiat Adminator
              </h1>
              <h2 className="text-center text-[#7D7D7D] font-normal text-[24px] sm:text-[18px]">
                Fill out the information completely to log in.
              </h2>
            </div>
          </div>
          <form className="flex flex-col gap-3 w-full" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#323257] text-[14px] text-start font-semibold">
                Email<span className="text-[#FD7573]"> *</span>
              </label>
              <Input
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
                className="w-full"
                size="large"
              />
              {emailError && email && (
                <label className="text-[#FD7573] text-[14px] text-start">
                  {emailError}
                </label>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#323257] text-[14px] text-start font-semibold">
                Password<span className="text-[#FD7573]"> *</span>
              </label>
              <Input.Password
                value={password}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                onChange={handlePasswordChange}
                placeholder="Password"
                type="password"
                className="w-full"
                size="large"
              />
              {passwordError && password && (
                <label className="text-[#FD7573] text-[14px] text-start">
                  {passwordError}
                </label>
              )}
            </div>
            <div className="flex w-full">
              <ButtonSubmit handleSubmit={handleLogin} title="เข้าสู่ระบบ" />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
