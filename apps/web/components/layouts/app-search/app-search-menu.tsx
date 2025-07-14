"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/atoms/command";
import { ScrollArea } from "@/components/atoms/scroll-area";
import { useSearch } from "@/components/providers/search-provider";
import { ArrowRight, ChevronRight, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const data = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: List,
      },
      {
        title: "Tasks",
        url: "/tasks",
        icon: List,
      },
      {
        title: "Apps",
        url: "/apps",
        icon: List,
      },
      {
        title: "Chats",
        url: "/chats",
        badge: "3",
        icon: List,
      },
      {
        title: "Users",
        url: "/users",
        icon: List,
      },
      {
        title: "Secured by Clerk",
        icon: List,
        items: [
          {
            title: "Sign In",
            url: "/clerk/sign-in",
          },
          {
            title: "Sign Up",
            url: "/clerk/sign-up",
          },
          {
            title: "User Management",
            url: "/clerk/user-management",
          },
        ],
      },
    ],
  },
];

export function AppSearchMenu() {
  const router = useRouter();
  //   const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>No results found.</CommandEmpty>
          {data.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => router.push(navItem.url));
                      }}
                    >
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <ArrowRight className="text-muted-foreground/80 size-2" />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  );

                return navItem.items?.map((subItem, i) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${i}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => router.push(subItem.url));
                    }}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                      <ArrowRight className="text-muted-foreground/80 size-2" />
                    </div>
                    {navItem.title} <ChevronRight /> {subItem.title}
                  </CommandItem>
                ));
              })}
            </CommandGroup>
          ))}
          {/* <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <IconSun /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <IconMoon className="scale-90" />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <IconDeviceLaptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup> */}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
