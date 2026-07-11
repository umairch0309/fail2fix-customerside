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
              width={100}
              height={40}
              priority
            />
          </Link>
          <NotificationSheet />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="mb-4 px-2">
              <SearchCommand />
            </div>
            <SidebarMenu className="gap-2 p-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} className={`relative flex items-center gap-2 pl-3.5 py-2.5 font-medium rounded-lg ${isActive ? "text-[#494F57]" : "text-[#81868C]"}`}>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-bg"
                          className="absolute inset-0 bg-white border border-[#E4E4E4] rounded-[10px]"
                          transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
                        />
                      )}
                      <span className="relative z-10">
                        <item.icon color={isActive ? "#494F57" : "#81868C"} />
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
