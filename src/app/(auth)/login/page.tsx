"use client";

import React, { useState } from "react";
import { Input } from "antd";
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
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 8) {
      setPasswordError("Please enter a password with a minimum of 8 characters.");
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

  const isSubmitDisabled = !email || !password || !!emailError || !!passwordError;

  return (
    <main className="w-full flex sm:flex-col h-screen gap-24 sm:gap-4 sm:py-24 px-24 sm:px-8 bg-[#010b19]">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-fit p-8 bg-[#010b19] border rounded-2xl flex flex-col items-center gap-6">
          <div className="flex flex-col sm:w-full gap-4 items-center">
            <img
              src="/Surakiat-WhiteBG.avif"
              alt="Logo-Surakiat"
              className="max-w-40"
            />
            <div className="login-head flex flex-col gap-2 items-center">
              <h1 className="text-center text-[#4EDFE7] font-bold text-[24px] sm:text-[18px]">
                Surakiat Adminator
              </h1>
              <h2 className="text-center text-white font-normal text-[24px] sm:text-[18px]">
                Fill out the information completely to log in.
              </h2>
            </div>
          </div>
          <form className="flex flex-col gap-3 w-full" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-white text-[14px] text-start font-semibold">
                Email<span className="text-[#f43f5e]"> *</span>
              </label>
              <Input
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
                className="w-full"
                size="large"
              />
              {emailError && email && (
                <label className="text-[#f43f5e] text-[14px] text-start">
                  {emailError}
                </label>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-white text-[14px] text-start font-semibold">
                Password<span className="text-[#f43f5e]"> *</span>
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
                <label className="text-[#f43f5e] text-[14px] text-start">
                  {passwordError}
                </label>
              )}
            </div>
            <div className="flex w-full">
              <ButtonSubmit
                handleSubmit={handleLogin}
                title="Sign In"
                disabled={isSubmitDisabled} 
              />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}