"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

const imageMap: Record<string, { src: string; alt: string }> = {
  "/login": {
    src: "/images/login.jpg",
    alt: "Login illustration",
  },
  "/signup": {
    src: "/images/signup.jpg",
    alt: "Sign up illustration",
  },
  "/forgot-password": {
    src: "/images/login.jpg",
    alt: "Forgot password illustration",
  },
  "/verify-email": {
    src: "/images/signup.jpg",
    alt: "Verify email illustration",
  },
};

const defaultImage = {
  src: "/images/login.jpg",
  alt: "Authentication illustration",
};

export default function AuthImage() {
  const pathname = usePathname();
  const image = imageMap[pathname] || defaultImage;

  return (
    <div className="relative hidden lg:block h-full">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover rounded-xl"
        priority
      />
    </div>
  );
}
