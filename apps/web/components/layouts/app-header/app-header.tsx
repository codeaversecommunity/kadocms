import { Separator } from "@/components/atoms/separator";
import { SidebarTrigger } from "@/components/atoms/sidebar";
import { AppHeaderBreadcrumbs } from "./app-header-breadcrumbs";
import AppHeaderSearch from "./app-header-search";
import { AppHeaderThemeToggle } from "./app-header-theme-toggle";
import { AppHeaderThemeSelector } from "./app-header-theme-selector";

export default function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <AppHeaderBreadcrumbs />
      </div>

      <div className="flex items-center gap-2 px-4">
        {/* <CtaGithub /> */}
        <div className="hidden md:flex">
          <AppHeaderSearch />
        </div>
        {/* <UserNav /> */}
        <AppHeaderThemeToggle />
        <AppHeaderThemeSelector />
      </div>
    </header>
  );
}
