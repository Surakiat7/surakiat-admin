"use client";

import SongsTable from "@/components/table/ManageSongTable";
import React from "react";

type Props = {};

export default function ManageSong({}: Props) {
  return (
    <main className="w-full flex flex-col">
      <SongsTable />
    </main>
  );
}
