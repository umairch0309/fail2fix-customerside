"use client";

import { useRouter } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession, signOut } from "@/lib/auth-client";
import Profile from "@/public/icons/profile";
import Settings from "@/public/icons/settings";
import Logout from "@/public/icons/logout";

export function ProfileDropdown() {
  const router = useRouter();
  const { data: session } = useSession();

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleSettingsClick = () => {
    router.push("/settings");
  };

  const handleSignOutClick = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between w-full bg-white p-3 rounded-xl border border-[#EAEAEA] cursor-pointer hover:bg-[#F9F9F9] transition-colors">
          <div className="flex items-center gap-3">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-[#EAEAEA] text-xs font-medium text-[#494F57]">
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium text-[#494F57] max-w-[120px] truncate">
              {userName}
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-[#81868C]" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="top"
        sideOffset={8}
        className="rounded-xl bg-[#F9F9F9] p-1 w-[var(--radix-dropdown-menu-trigger-width)]"
      >
        {/* Profile Info Header */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="bg-[#EAEAEA] text-[10px] font-medium text-[#494F57]">
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-[#494F57] truncate">
                {userName}
              </div>
              <div className="text-[11px] text-[#97999D] font-medium truncate">
                {userEmail}
              </div>
            </div>
          </div>
        </div>

        {/* Main Menu Items */}
        <div className="p-1.5 bg-white rounded-lg border border-[#EAEAEA]">
          <DropdownMenuItem
            onClick={handleProfileClick}
            className="rounded-lg cursor-pointer py-2.5 text-[#494F57] font-medium text-sm"
          >
            <div className="mr-2 h-4 w-4 flex items-center justify-center">
              <Profile color="#81868C" />
            </div>
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSettingsClick}
            className="rounded-lg cursor-pointer py-2.5 text-[#494F57] font-medium text-sm"
          >
            <div className="mr-2 h-4 w-4 flex items-center justify-center">
              <Settings color="#81868C" />
            </div>
            <span>Settings</span>
          </DropdownMenuItem>
        </div>

        {/* Sign Out */}
        <DropdownMenuItem
          onClick={handleSignOutClick}
          className="mt-1 px-4 py-2.5 bg-white rounded-lg border border-[#EAEAEA] cursor-pointer text-[#FF1603] font-medium text-sm"
        >
          <div className="mr-2 h-4 w-4 flex items-center justify-center">
            <Logout color="#FF1603" />
          </div>
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
