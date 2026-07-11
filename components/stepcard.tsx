import React, { ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

interface StepCardProps {
  step: string;
  description: string;
  stepimg: ReactNode;
  bgImage: string | StaticImageData;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  description,
  stepimg,
  bgImage,
}) => {
  return (
    <div className="group relative flex flex-col gap-8 px-6 py-8 rounded-3xl w-full md:rounded-[28px] min-w-[300px] max-w-[330px] xl:min-w-[330px] xl:max-w-[420px] min-h-[430px] md:min-h-[470px] xl:min-h-[550px] font-inter transition-all hover:shadow-lg overflow-hidden">
      <Image src={bgImage} alt="" fill className="object-cover" priority />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex flex-col gap-3  text-white font-inter font-semibold text-[1.25rem]">
          <div className="">{stepimg}</div>
          <div className="">{step}</div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="text-white/80 leading-tight font-polysanstrial text-[1.05rem] lg:text-[1.2rem]">
            {description}
          </p>
          <Button className="w-fit bg-[#E85D22] px-4 py-5 transition-all duration-300">
            <span className="text-[0.95rem] text-[#EDEEEE] font-polysanstrial max-w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
              Start Now
            </span>
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="absolute max-h-full inset-0 bg-linear-to-t from-black/60 to-white/8 blur-md z-1 top-40"></div>
    </div>
  );
};

export default StepCard;
