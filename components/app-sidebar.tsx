"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SearchCommand } from "@/components/search-command";
import { ProfileDropdown } from "@/components/profile-dropdown";

import Overview from "@/public/icons/overview";
import Requests from "@/public/icons/Requests";
import Quotes from "@/public/icons/Quotes";
import Orders from "@/public/icons/Orders";
import Payments from "@/public/icons/Payments";
import Chat from "@/public/icons/Chat";
import { NotificationSheet } from "@/components/notification-sheet";
import { FAIL2FIX_LOGO } from "@/lib/marketing/constants";

const menuItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Overview,
  },
  {
    title: "Requests",
    url: "/requests",
    icon: Requests,
  },
  {
    title: "Quotes",
    url: "/quotes",
    icon: Quotes,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: Orders,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: Payments,
  },
  {
    title: "Chats",
    url: "/chats",
    icon: Chat,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-transparent border-none pl-2">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Image
              src={FAIL2FIX_LOGO}
              alt="Fail2Fix"
              width={120}
              height={48}
              priority
              className="object-contain"
            />
          </Link>
          <NotificationSheet />
        </div>
      </SidebarHeader>
      <SidebarContent className="mx-1 flex flex-col gap-3">
        <SidebarGroup className="brand-gradient-bg rounded-2xl p-3 shadow-sm">
          <SidebarGroupContent>
            <div className="mb-3">
              <SearchCommand />
            </div>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      href={item.url}
                      className={`relative flex items-center gap-2 pl-3.5 py-2.5 font-medium rounded-lg transition-colors ${
                        isActive ? "text-[#14213d]" : "text-white/90 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-bg"
                          className="absolute inset-0 bg-white rounded-[10px] shadow-sm"
                          transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
                        />
                      )}
                      <span className="relative z-10">
                        <item.icon color={isActive ? "#14213d" : "#ffffff"} />
                      </span>
                      <span className="relative z-10">{item.title}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <ProfileDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}
