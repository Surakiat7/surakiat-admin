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
    ManageSong: async () => {
      await router.push(`/managesong`);
    },
    ManageSongEdit: async (id: string | number) => {
      await router.push(`/managesong/${id}`);
    },
    ManageSongCreate: async () => {
      await router.push(`/managesong/create`);
    },
    Overview: async () => {
      await router.push(`/overview`);
    },
    ManageUser: async () => {
      await router.push(`/manageuser`);
    },
    ManageUserCreate: async () => {
      await router.push(`/manageuser/create`);
    },
    ManageUserEdit: async (id: string | number) => {
      await router.push(`/manageuser/${id}`);
    },
    ManageCategory: async () => {
      await router.push(`/managecategory`);
    },
    ManageCategoryCreate: async (id: string | number) => {
      await router.push(`/managecategory/create/${id}`);
    },
    ManageCategoryEdit: async (id: string | number) => {
      await router.push(`/managecategory/${id}`);
    },
  };
};
