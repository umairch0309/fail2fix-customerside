import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GuideCardProps {
  image: string | StaticImageData;
  title: string;
  description: string;
  username: string;
  date: string;
  className?: string;
  className1?: string;
  fullWidth?: boolean;
  href?: string;
}

const GuideCard: React.FC<GuideCardProps> = ({
  image,
  title,
  description,
  username,
  date,
  className,
  className1,
  fullWidth = false,
  href,
}) => {
  const cardContent = (
    <>
      <div className="relative w-full h-[290px] md:h-[370px] rounded-[12px] overflow-hidden border border-[#E2E1E1] transition-all hover:shadow-lg">
        <Image
          src={image}
          alt={title}
          fill
          className={cn("object-cover", className1)}
        />
      </div>
      <div className="flex flex-col justify-between p-6 flex-1 rounded-[12px] bg-white transition-all hover:shadow-lg">
        <div className="flex flex-col gap-3">
          <h3 className="text-[#232323] font-semibold text-[18px] tracking-tight font-polysanstrial">
            {title}
          </h3>
          <p className="text-[#7E7E7E] font-medium text-[14px] leading-relaxed font-inter line-clamp-3">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-between pt-4  mt-4">
          <span className="text-[#232323] font-semibold text-[12px] font-inter">
            {username}
          </span>
          <span className="text-[#7E7E7E] text-[12px] font-inter">{date}</span>
        </div>
      </div>
    </>
  );

  const wrapperClassName = cn(
    "flex flex-col gap-1 h-full",
    fullWidth
      ? "w-full"
      : "min-w-[280px] max-w-[280px] md:min-w-[350px] md:max-w-[350px]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={wrapperClassName}>
        {cardContent}
      </Link>
    );
  }

  return <div className={wrapperClassName}>{cardContent}</div>;
};

export default GuideCard;
