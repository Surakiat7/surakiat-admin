import React from "react";
import { FiLogIn } from "react-icons/fi";

interface ButtonApplyBESProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonCancel: React.FC<ButtonApplyBESProps> = ({ setOpen }) => {
  return (
    <div>
      <RoundedSlideButton setOpen={setOpen} />
    </div>
  );
};

interface RoundedSlideButtonProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoundedSlideButton: React.FC<RoundedSlideButtonProps> = ({ setOpen }) => {
  return (
    <button
      aria-label="Cancel button"
      id="cancel-button"
      className={`
        relative z-0 flex justify-center items-center gap-2 overflow-hidden rounded-full border-[1px] 
        border-[#2A8193] hover:border-[#f43f5e] px-4 py-3 w-[120px] font-semibold
         text-[#2A8193] transition-all duration-500
        
        before:absolute before:inset-0
        before:-z-10 before:translate-x-[150%]
        before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] before:bg-[#f43f5e]
        before:transition-transform before:duration-1000
        before:content-[""]

        hover:scale-105 hover:text-white
        hover:before:translate-x-[0%]
        hover:before:translate-y-[0%]
        active:scale-95`}
      onClick={() => setOpen(false)}
    >
      <span className="text-center">CANCEL</span>
    </button>
  );
};

export default ButtonCancel;
