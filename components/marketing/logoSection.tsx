"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import logo from "../../public/images/sidebarlogo.png";
import React from "react";

const LogoSection = () => {
  return (
    <Link href={"/"}>
      <div>
        <div className="min-w-[100px] max-w-[110px]">
          <Image src={logo} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </Link>
  );
};

export default LogoSection;
