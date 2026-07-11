import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

interface NavItem {
  navitem: string;
  href: string;
}

interface Props {
  className?: string;
  items: NavItem[];
}

const Desktopnavigation = ({ className, items }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.4 }}
      className="transition-all duration-300"
    >
      <nav className={cn(`text-[0.95rem] text-[#130A09]`, className)}>
        {items.map((item, index) => (
          <Link key={index} href={item.href}>
            {item.navitem}
          </Link>
        ))}
      </nav>
    </motion.div>
  );
};

export default Desktopnavigation;
