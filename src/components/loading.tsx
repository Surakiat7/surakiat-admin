import { Spin } from "antd";
import React, { useEffect, useState } from "react";

type Props = {
  label?: string;
};

export default function Loading({ label }: Props) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (label) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots !== " . . ." ? prevDots + " ." : " ."));
      }, 500);

      return () => clearInterval(interval);
    }
  }, [label]);

  return (
    <div>
      <div className="fixed inset-0 flex flex-col gap-6 items-center justify-center z-40 w-full h-full text-teal-500">
        {/* <h6>{label}{dots}</h6> */}
        <Spin size="large" />
      </div>
    </div>
  );
}
