import { cn } from "@/lib/utils";
import Image from "next/image";
import img from "@/public/images/clock.png";
import img1 from "@/public/images/routing.png";
import img2 from "@/public/images/rating.png";

interface MaingridProps {
  className?: string;
  initials: string;
  name: string;
  price: string;
  duration: string;
  timeAgo: string;
  distance: string;
  rating: string;
  reviews: string;
}

const Maingrid = ({
  className,
  initials,
  name,
  price,
  duration,
  timeAgo,
  distance,
  rating,
  reviews,
}: MaingridProps) => {
  return (
    <div
      className={cn(
        `bg-[#EEEEEE] border border-white p-4 rounded-[12px] space-y-3 text-[0.9rem] font-inter font-medium min-w-[500px] max-w-[280px] sm:min-w-[380px] sm:max-w-[380px] md:min-w-[380px] md:max-w-[260px] lg:min-w-[4.px] lg:max-w-[350px] 2xl:min-w-[500px] 2xl:max-w-[500px] my-1.5`,
        className,
      )}
    >
      <div className="flex w-full gap-3 items-center">
        <div className="bg-black px-6 w-12 h-12 flex justify-center items-center max-md:max-h-[40px] text-[1rem] md:text-[1.25rem] lg:text-[1.75rem]  text-[#757575] font-inter font-semibold rounded-[10px]">
          {initials}
        </div>
        <div className="flex gap-2 w-full justify-between py-2">
          <div className="flex flex-col">
            <div className="text-[0.85rem] text-nowrap">{name}</div>
            <div className="flex gap-4 text-[0.75rem]">
              <div className="">{price}</div>
              <div className="flex gap-1">
                <div className="w-3">
                  <Image
                    className="w-full h-full object-contain"
                    src={img}
                    alt=""
                  />
                </div>
                <div className="">{duration}</div>
              </div>
            </div>
          </div>
          <div className="text-nowrap text-[0.75rem]">{timeAgo}</div>
        </div>
      </div>
      <div className="flex justify-between text-[0.8rem]">
        <div className="flex gap-1 items-center">
          <div className="w-3">
            <Image className="w-full h-full object-contain" src={img1} alt="" />
          </div>
          <div>{distance}</div>
        </div>
        <div className="flex gap-1 items-center">
          <div className="">{rating}</div>
          <div className="h-3.5">
            <Image className="w-full h-full object-cover" src={img2} alt="" />
          </div>
          <div className="">({reviews})</div>
        </div>
      </div>
    </div>
  );
};

export default Maingrid;
