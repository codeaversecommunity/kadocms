import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/atoms/sidebar";
import { cn } from "@/lib/utils";
import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";

export const AppSidebarNavigationItemContent = ({
  item,
  isActive,
}: {
  item: any;
  isActive: (url: string) => boolean;
}) => {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenuItem key={item.title}>
      <Link href={String(item.url)}>
        <SidebarMenuButton
          asChild
          className={cn(
            "cursor-pointer",
            isActive(item.url) && "bg-secondary font-medium",
            item.className
          )}
        >
          <a href={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </a>
        </SidebarMenuButton>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-36 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem>
            <Folder className="text-muted-foreground" />
            <span>View</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Forward className="text-muted-foreground" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
