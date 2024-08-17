"use client";

import React, { useState, useEffect } from "react";
import {
  message,
  Input,
  Button,
  Upload,
  UploadFile,
  Image,
  Space,
  Radio,
  Select,
  UploadProps,
} from "antd";
import { useParams } from "next/navigation";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import Loading from "@/components/loading";
import { useNavigate } from "@/utils/navigation";
import { UpdateUser, UserFindByID } from "@/apis/manageuser";

type Props = {};
const validateEmail = (value: any) =>
  value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

export default function EditUserByID({}: Props) {
  const navigation = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

  const handleCancel = () => {
    navigation.Back();
  };

  const FindSongDataById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await UserFindByID(id);
      console.log("API response:", response);
      const data = response.data;

      if (data) {
        setFname(data.fname || "");
        setLname(data.lname || "");
        setEmail(data.email || "");
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      FindSongDataById(id);
    }
  }, [id]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const body = {
        fname,
        lname,
        email,
        password,
        statususer: "Active",
        permission: "Admin",
      };

      const response = await UpdateUser(id, body);
      console.log("Response:", response);

      SwalCenter("อัปเดตข้อมูลผู้ใช้", "success", undefined, () =>
        navigation.User()
      );
    } catch (error: any) {
      const messageTh = error?.messageTh || "An error occurred";
      SwalCenter(messageTh, "error", undefined, undefined);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full flex flex-col">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col w-full justify-between gap-4 sm:pt-4">
          <div className="flex flex-col w-full gap-4 justify-start">
            <div className="flex gap-2 w-full">
              <div className="flex w-full flex-col gap-2">
                <label className="text-white text-[14px] text-start font-semibold">
                  Firstname<span className="text-[#f43f5e]"> *</span>
                </label>
                <Input
                  className="w-full"
                  size="large"
                  placeholder="Firstname"
                  value={fname}
                  onChange={(event) => setFname(event.target.value)}
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <label className="text-white text-[14px] text-start font-semibold">
                  Lastname<span className="text-[#f43f5e]"> *</span>
                </label>
                <Input
                  className="w-full"
                  size="large"
                  placeholder="Lastname"
                  value={lname}
                  onChange={(event) => setLname(event.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <div className="flex w-full flex-col gap-2">
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
              <div className="flex w-full flex-col gap-2">
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
            </div>
          </div>
          <div className="w-full sm:flex">
            <Space>
              <Button danger size="large" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                size="large"
                type="primary"
                disabled={!fname || !lname}
              >
                Submit
              </Button>
            </Space>
          </div>
        </div>
      )}
    </main>
  );
}
