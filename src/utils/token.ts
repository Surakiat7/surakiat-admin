"use client";

import Cookies from "js-cookie";

const accessToken = "SurakiatAdminAccessToken";
const refreshToken = "SurakiatAdminRefreshToken";

export async function getAccessToken(): Promise<string | undefined> {
  try {
    const token = await Cookies.get(accessToken);
    return token;
  } catch (error) {
    console.log(`Get accessToken error`);
    return undefined;
  }
}

export async function getRefreshToken(): Promise<string | undefined> {
  try {
    const token = await Cookies.get(refreshToken);
    return token;
  } catch (error) {
    console.log(`Get refreshToken error`);
    return undefined;
  }
}

export async function setAccessToken(token: string): Promise<boolean> {
  try {
    Cookies.set(accessToken, token, { expires: 30, secure: true });
    return true;
  } catch (error) {
    console.error(`Set accessToken error`);
    return false;
  }
}

export async function setRefreshToken(token: string): Promise<boolean> {
  try {
    Cookies.set(refreshToken, token, { expires: 30, secure: true });
    return true;
  } catch (error) {
    console.error(`Set refreshToken error`);
    return false;
  }
}

export async function removeAccessToken(): Promise<boolean> {
  try {
    Cookies.remove(accessToken);
    return true;
  } catch (error) {
    console.log("Remove accessToken error");
    return false;
  }
}

export async function removeRefreshToken(): Promise<boolean> {
  try {
    Cookies.remove(refreshToken);
    return true;
  } catch (error) {
    console.log("Remove refreshToken error");
    return false;
  }
}
