import Image from "next/image";
import insta from "@/public/insta.svg";
import linkdin from "@/public/linkdin.svg";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function ContactInfo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-[#130A09] w-full h-full border border-[#F0F0F0] rounded-[1.5rem] md:rounded-[26px] px-4 md:px-6 text-[#90989F] text-[0.9rem] flex flex-col justify-between py-4 md:py-6",
        className,
      )}
    >
      <div className="flex flex-col gap-8 pb-6">
        {/* Main Heading */}
        <div className="flex flex-col bg-[#EDEEEE] rounded-[10px] px-8 py-5">
          <h1 className="font-semibold text-[2.85rem] lg:text-[3.25rem] text-black font-polysans">
            Get In touch
          </h1>
          <p className="text-[#787878] text-[0.9rem] leading-relaxed max-w-[500px]">
            Here's our contact info—call, email, or visit us. You can also
            follow us on social media to stay updated with the latest news,
            tips, and offers.
          </p>
        </div>

        {/* Contact Sections */}
        <div className="flex flex-col items-start gap-16 justify-between max-w-[500px] w-full">
          <div className="font-inter font-semibold text-[1.5rem] text-[#FFFFFF]">
            General Inquiries
          </div>
          {/* Contact Details */}
          <div className="flex flex-col gap-14 w-full">
            <div className="flex max-lg:flex-col gap-10 justify-between">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-[1.05rem] font-inter font-semibold">
                  Email address
                </h3>
                <div className="flex flex-col gap-1.5 text-[#90989F]">
                  <a
                    href="mailto:fail2fix@gmail.Com"
                    className="hover:text-white transition-colors"
                  >
                    fail2fix@gmail.Com
                  </a>
                </div>
              </div>

              {/* Contact Number */}
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-[1.05rem] font-inter font-semibold">
                  Contact Number
                </h3>
                <div className="flex flex-col gap-1.5 text-[#90989F]">
                  <a
                    href="tel:+442045414102"
                    className="hover:text-white transition-colors"
                  >
                    020 4541 4102
                  </a>
                </div>
              </div>
            </div>

            <div className="flex max-lg:flex-col gap-14 justify-between">
              {/* Timings */}
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-[1.05rem] font-inter font-semibold">
                  Timings
                </h3>
                <div className="flex gap-8 text-[#90989F]">
                  <div className="space-y-2">
                    <p>Mo - Fr</p>
                    <p>Samstag</p>
                    <p>Sonntag</p>
                  </div>
                  <div className="space-y-2">
                    <p>8:00 - 18:30</p>
                    <p>8:00 - 16:00</p>
                    <p>Geschlossen</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-[1.05rem] font-inter font-semibold">
                  Address
                </h3>
                <div className="flex flex-col gap-1.5 text-[#90989F] max-w-[125px]">
                  123 High Street Springfield London SW1A 1AA United Kingdom
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-[1.05rem] font-inter font-semibold">
                Social media Links
              </h3>
              <div className="flex max-lg:flex-col gap-8 lg:items-center">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="opacity-80 hover:opacity-100 transition-opacity text-[#90989F] hover:text-white uppercase text-sm font-medium flex items-center gap-2 
                  "
                >
                  Instagram <ArrowUpRight width={20} />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="opacity-80 hover:opacity-100 transition-opacity text-[#90989F] hover:text-white uppercase text-sm font-medium flex items-center gap-2
                  "
                >
                  LinkedIn <ArrowUpRight width={20} />
                </a>
                <a
                  href="#"
                  aria-label="Dribbble"
                  className="opacity-80 hover:opacity-100 transition-opacity text-[#90989F] hover:text-white uppercase text-sm font-medium flex items-center gap-2
                  "
                >
                  DRIBBBLE <ArrowUpRight width={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
