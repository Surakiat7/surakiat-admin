"use client";

import React from "react";
import { MdOutlineAutoGraph } from "react-icons/md";
import { RiSearch2Line } from "react-icons/ri";
import { BsRecordCircleFill } from "react-icons/bs";

type CardData = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

const cardData: CardData[] = [
  {
    id: 1,
    title: "รายงานสถิติคำค้นหาที่มากที่สุดทั้งประเทศ",
    description: "รักแรกพบ ค้นหา 300 ครั้ง",
    icon: <RiSearch2Line size={28} />,
  },
  {
    id: 2,
    title: "หมวดหมู่ค่ายเพลงที่ค้นหามากที่สุด",
    description: "ค่ายเพลง Kamikaze",
    icon: <BsRecordCircleFill size={28} />,
  },
  {
    id: 3,
    title: "รายงานสถิติคำค้นหาที่มากที่สุดทั้งประเทศ",
    description: "รักแรกพบ ค้นหา 300 ครั้ง",
    icon: <RiSearch2Line size={28} />,
  },
  {
    id: 4,
    title: "รายงานสถิติคำค้นหาที่มากที่สุดทั้งประเทศ",
    description: "รักแรกพบ ค้นหา 300 ครั้ง",
    icon: <RiSearch2Line size={28} />,
  },
];

export default function ManageOverview() {
  return (
    <main className="w-full flex flex-col">
      <div className="grid grid-cols-4 sm:grid-cols-2 gap-4">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="relative px-4 flex gap-4 sm:gap-2 flex-col h-full py-8 rounded-2xl justify-center items-center bg-white shadow-xl overflow-hidden"
          >
            <MdOutlineAutoGraph
              size={240}
              color="#f4f4f5"
              className="absolute top-0 right-0"
            />
            <h1 className="font-bold relative text-2xl sm:text-xl text-center">
              {card.title}
            </h1>
            <div className="flex relative gap-2 items-center">
              {card.icon}
              <p className="text-sm">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
