"use client";

import CategoryTable from "@/components/table/ManageCategoryTable";
import React from "react";

type Props = {};

export default function ManageCategory({}: Props) {
  return (
    <main className="w-full flex flex-col">
      <CategoryTable />
    </main>
  );
}
