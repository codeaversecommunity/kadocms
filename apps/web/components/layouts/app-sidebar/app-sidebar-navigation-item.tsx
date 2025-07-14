import { SidebarMenuButton, SidebarMenuItem } from "@/components/atoms/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const AppSidebarNavigationItem = ({
  item,
  isActive,
}: {
  item: any;
  isActive: (url: string) => boolean;
}) => {
  return (
    <SidebarMenuItem key={item.id || item.title}>
      <Link href={String(item.url)}>
        <SidebarMenuButton
          tooltip={item.title}
          className={cn(
            "cursor-pointer",
            isActive(item.url) && "bg-secondary font-medium",
            item.className
          )}
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
};
