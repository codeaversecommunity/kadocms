"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";

const sidebarNavItems = [
  { title: "Basic Information", href: "basic-information" },
  { title: "API Schema", href: "api-schema" },
];

export function ContentSettingSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") || "basic-information";

  return (
    <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1">
      {sidebarNavItems.map((item) => (
        <Button
          key={item.title}
          variant="ghost"
          asChild
          className={cn(
            "w-full text-left justify-start items-start",
            activeTab === item.href && "bg-muted hover:bg-muted"
          )}
        >
          <Link href={`${pathname}?tab=${item.href}`}>{item.title}</Link>
        </Button>
      ))}
    </nav>
  );
}
