import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

interface CardProps {
  className?: string;
  stepnumber: string | number;
  title: string;
  desc: string;
  src: string | StaticImageData;
}

const SimpleStepsCard = ({
  className,
  stepnumber,
  title,
  desc,
  src,
}: CardProps) => {
  return (
    <div
      className={cn(
        "h-full w-full bg-[#F7F7F7] flex max-md:flex-col justify-between px-10 py-20 md:py-30 rounded-[14px] items-center group gap-8",
        className,
      )}
    >
      <div className="space-y-5 flex-1 min-w-0">
        <div>
          <p className="font-inter text-[#442510] text-[1rem] font-medium">
            STEP {stepnumber}
          </p>
          <p className="font-polysanstrial text-[1.85rem] lg:text-[2.5rem] font-semibold tracking-tight">
            {title}
          </p>
          <p className="font-inter text-[#807D7D] text-[0.9rem] md:text-[1rem] max-w-[380px]">
            {desc}
          </p>
        </div>
        <Button className="bg-[#E95313] max-w-[200px] py-5.5 w-fit overflow-hidden">
          <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300">
            Start Now
          </span>
          <ChevronRight />
        </Button>
      </div>
      <Image
        src={src}
        alt="Step 1"
        className="min-w-[230px] max-w-[330px]  h-auto object-cover flex-shrink-0 max-sm:w-full"
      />
    </div>
  );
};

export default SimpleStepsCard;
