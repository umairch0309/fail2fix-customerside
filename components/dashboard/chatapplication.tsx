import React from "react";
import Singlechatapplication from "./singlechatapplication";

interface ChatapplicationProps {
  number?: number;
}

const Chatapplication: React.FC<ChatapplicationProps> = ({ number = 1 }) => {
  return (
    <div className="w-full h-full bg-[#FAFAFA] border border-[#E6E6E6] rounded-[1rem] flex flex-col ">
      <div className="flex justify-between px-4 py-2 border-b border-[#E6E6E6] font-medium text-[0.82rem] h-full items-center">
        <div className="text-[#777777] text-[0.9rem]">Applications with you</div>
        <div className="pr-2">{number}</div>
      </div>
      <div className="">
        <Singlechatapplication />
        <Singlechatapplication />
        <Singlechatapplication classname="border-none" />
      </div>
    </div>
  );
};

export default Chatapplication;
