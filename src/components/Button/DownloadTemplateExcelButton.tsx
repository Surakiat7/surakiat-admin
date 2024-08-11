import React from "react";
import { FiDownload } from "react-icons/fi";

const DownloadTemplateExcelButton: React.FC = () => {
  const handleDownload = () => {
    const fileUrl = "/file/Template Echo Karaoke.xls";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "เทมเพลตเพิ่มเพลง Echo Karaoke.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="bg-[#49D290] text-white p-2 rounded-lg flex gap-2 items-center hover:bg-[#3ab77a] transition-colors"
    >
      <span className="whitespace-nowrap">ดาวน์โหลดเทมเพลตเพิ่มเพลง</span>
      <FiDownload size={16} />
    </button>
  );
};

export default DownloadTemplateExcelButton;
