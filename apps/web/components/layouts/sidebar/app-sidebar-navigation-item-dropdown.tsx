import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/atoms/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/atoms/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export const AppSidebarNavigationItemDropdown = ({
  item,
  isActive,
}: {
  item: any;
  isActive: (url: string) => boolean;
}) => {
  return (
    <Collapsible
      key={item.id || item.title}
      asChild
      className="group/collapsible"
      defaultOpen={item.items.some((sub: any) => isActive(sub.url))}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className={cn("cursor-pointer")}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem: any) => (
              <SidebarMenuSubItem key={subItem.id || subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  className={cn(
                    "cursor-pointer",
                    isActive(subItem.url) && "bg-secondary font-medium"
                  )}
                >
                  <a href={subItem.url}>
                    <span>{subItem.title}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
