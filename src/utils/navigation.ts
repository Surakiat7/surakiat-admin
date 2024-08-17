"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export const useNavigate = () => {
  const router = useRouter();
  const id = usePathname();

  return {
    Back: async () => {
      await router.back();
    },
    Login: async () => {
      await router.push(`/login`);
    },
    Blog: async () => {
      await router.push(`/blog`);
    },
    BlogEdit: async (id: string | number) => {
      await router.push(`/blog/${id}`);
    },
    BlogCreate: async () => {
      await router.push(`/blog/create`);
    },
    Overview: async () => {
      await router.push(`/overview`);
    },
    User: async () => {
      await router.push(`/user`);
    },
    UserCreate: async () => {
      await router.push(`/user/create`);
    },
    UserEdit: async (id: string | number) => {
      await router.push(`/user/${id}`);
    },
  };
};
