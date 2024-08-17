"use client";

import BlogsTable from "@/components/table/BlogTable";
import React from "react";

type Props = {};

export default function Blog({}: Props) {
  return (
    <main className="w-full flex flex-col">
      <BlogsTable />
    </main>
  );
}
