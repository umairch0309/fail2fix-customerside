"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import Overview from "@/public/icons/overview";
import Requests from "@/public/icons/Requests";
import Quotes from "@/public/icons/Quotes";
import Orders from "@/public/icons/Orders";
import Payments from "@/public/icons/Payments";
import Chat from "@/public/icons/Chat";

const menuItems = [
  { title: "Overview", url: "/dashboard", icon: Overview },
  { title: "Requests", url: "/requests", icon: Requests },
  { title: "Quotes", url: "/quotes", icon: Quotes },
  { title: "Orders", url: "/orders", icon: Orders },
  { title: "Payments", url: "/payments", icon: Payments },
  { title: "Chats", url: "/chats", icon: Chat },
];

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full flex items-center"
      >
        <Search className="absolute left-3 h-4 w-4 text-[#686868]" />
        <div className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#E4E4E4] rounded-lg text-left text-sm text-[#686868]">
          Search
        </div>
        <kbd className="absolute right-3 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-[#E4E4E4] bg-white px-1.5 font-mono text-[10px] font-medium text-[#686868]">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {menuItems.map((item) => (
              <CommandItem
                key={item.title}
                onSelect={() => handleSelect(item.url)}
              >
                <item.icon color="#81868C" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
