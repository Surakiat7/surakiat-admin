"use client";

import { AuthenApi } from "@/apis/authen";
import Loading from "@/components/loading";
// import { setUserExistFn } from "@/utils/axios/axiosRefresh";
import { useNavigate } from "@/utils/navigation";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken as setAccessCookie,
  setRefreshToken as setRefreshCookie,
} from "@/utils/token";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

export enum Role {
  All = 0,
  SuperAdmin = 50,
  Executive = 45,
  Audit = 40,
  OPD = 30,
  Manager = 20,
}

type UserProfile = {
  id: number;
  name: string;
  branch: {
    id: number;
    name: string;
  };
  email: string;
  departmentName: string;
  tel: string;
  role: string;
  level: number;
  fname: string;
  admin_permission: string;
  lname: string;
};

type AuthContextValue = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userProfile: UserProfile | undefined;
  mobileScreen: boolean;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

type Props = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [userExist, setUserExist] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const [accessToken, setAccessToken] = useState<string | undefined>("");
  const [mobileScreen, setMobileScreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingLabel, setLoadingLabel] = useState<string>("");

  const pathname = usePathname();
  const router = useRouter();
  const navigateTo = useNavigate();

  // setUserExistFn(setUserExist);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setMobileScreen(true);
      else setMobileScreen(false);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getUser = async () => {
    setIsLoading(true);
    setLoadingLabel("กำลังดึงข้อมูลผู้ใช้");
    try {
      const userResponse = await AuthenApi.getUser();
      setUserProfile(userResponse.data.data);
      console.log("userResponse:", userResponse);
      setUserExist(true);
    } catch (error: any) {
      SwalCenter("ไม่พบข้อมูลผู้ใช้งาน", "error", "", () => navigateTo.Login());
      navigateTo.Login();
      setUserExist(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setLoadingLabel("กำลังเข้าสู่ระบบ");
    try {
      const loginResponse = await AuthenApi.login(email, password);
      if (loginResponse.status === 200) {
        const accessToken = loginResponse.data.data.accessToken;
        const refreshToken = loginResponse.data.data.refreshToken;
        // console.log("success res");
        await setAccessCookie(accessToken);
        setAccessToken(await getAccessToken());
        await setRefreshCookie(refreshToken);
        console.log("seccess login");

        SwalCenter("เข้าสู่ระบบสำเร็จ", "success", undefined, undefined, () =>
          navigateTo.ManageSong()
        );
      }
    } catch (error: any) {
      SwalCenter(error.data.messageTH, "error");
      console.log("failed catch login");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await removeAccessToken();
      await removeRefreshToken();
      SwalCenter(
        "ออกจากระบบสำเร็จ",
        "success",
        "ระบบกำลังพาคุณไปที่หน้าเข้าสู่ระบบ",
        () => navigateTo.Login()
      );
    } catch (error) {
      SwalCenter("ออกจากระบบไม่สำเร็จ", "error");
    }
  };

  // useEffect(() => {
  //   setIsLoading(false);
  // }, [pathname]);

  // // // เช็คว่า authen มั้ยทุกครั้งที่ pathname หรือ user เปลี่ยน
  // useEffect(() => {
  //   // NOTE: authen test
  //   isUserAuthenticated();
  // }, [pathname, userExist]);

  // // เช็คว่ามี user มั้ยทุกครั้งที่ accesstoken เปลี่ยน
  // useEffect(() => {
  //   getUser();
  // }, [accessToken]);

  // // // เช็ค authen
  // const isUserAuthenticated = async () => {
  //   // ถ้ามี token + มี user มั้ย ถ้ามี ทำ fn นี้
  //   if ((await getAccessToken()) && userExist) {
  //     redirectToLogin();
  //   } else redirectToLogin();
  // };

  // // ถ้าไปหน้าที่ไม่มีคำว่า login จะเด้งไปหน้า login
  // const redirectToLogin = () => {
  //   if (!pathname.includes("login")) navigateTo.ManageSong();
  // };

  // // ถ้าไปหน้าที่มีคำว่า login จะไปหน้า Overview
  // const redirectToManageSong = () => {
  //   if (pathname.includes("login")) navigateTo.ManageSong();
  // };

  // const childrenWithNav = <>{children}</>;

  return (
    <AuthContext.Provider
      value={{
        login,
        mobileScreen,
        logout,
        userProfile,
      }}
    >
      {/* {isLoading ? (
        <Loading label={loadingLabel} />
      ) : accessToken && userExist ? (
        childrenWithNav
      ) : (
        children
      )} */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useYourContext must be used within a YourContextProvider");
  }
  return context;
};
