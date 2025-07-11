"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/breadcrumb";
import { Separator } from "@/components/atoms/separator";
import { SidebarTrigger } from "@/components/atoms/sidebar";

export default function AppHeader({
  workspace,
}: {
  workspace?: {
    id: string;
    name: string;
    slug: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    stripe_customer_id: null;
    stripe_subscription_id: null;
    subscription_status: string;
    plan_type: string;
    creator_id: string;
    modifier_id: null;
  };
}) {
  const pathname = usePathname();
  const pathnames = pathname.split("/").slice(1);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">
                {workspace?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathnames.map((segment, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  {index === pathnames.length - 1 ? (
                    <BreadcrumbPage className="capitalize">
                      {segment}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={`/${pathname
                        .split("/")
                        .slice(1, index + 2)
                        .join("/")}`}
                      className="capitalize"
                    >
                      {segment}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
