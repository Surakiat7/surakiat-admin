"use client";

import UsersTable from "@/components/table/ManageUserTable";
import React from "react";

type Props = {};

export default function ManageUser({}: Props) {
  return (
    <main className="w-full flex flex-col">
      <UsersTable />
    </main>
  );
}
