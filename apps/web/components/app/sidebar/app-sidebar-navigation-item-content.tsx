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
import { confirm } from "@/components/providers/confirm-dialog-provider";
import { cn } from "@/lib/utils";
import { deleteContent } from "@/modules/content/content.action";
import {
  Folder,
  Forward,
  MoreHorizontal,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const AppSidebarNavigationItemContent = ({
  item,
  isActive,
}: {
  item: any;
  isActive: (url: string) => boolean;
}) => {
  const { isMobile } = useSidebar();

  const onDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Content",
      description: "Are you sure you want to delete this content?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (confirmed) {
      await deleteContent(item.id);

      toast.success("Content deleted successfully");
      window.location.href = "/dashboard";
    }
  };

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        className={cn(
          "cursor-pointer",
          isActive(item.url) && "bg-secondary font-medium",
          item.className
        )}
      >
        <Link href={String(item.url)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
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
          <Link href={item.url}>
            <DropdownMenuItem className="cursor-pointer">
              <Folder className="text-muted-foreground" />
              <span>View</span>
            </DropdownMenuItem>
          </Link>
          <Link href={item.url + "/settings"}>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="text-muted-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive cursor-pointer"
          >
            <Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
