"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { useContentStore } from "@/modules/content/content.store";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentStore = useContentStore();

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <Link
            className="text-xl font-medium"
            href={`/dashboard/apis/${contentStore.report?.slug}`}
          >
            {contentStore.report?.name || "Content"}
          </Link>

          <p className="text-sm text-muted-foreground">
            Manage your content files and data for{" "}
            {contentStore.report?.name || "Content"}.
          </p>
        </div>

        <Link href={`/dashboard/apis/${contentStore.report?.slug}/settings`}>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>
      <Separator />

      {children}
    </>
  );
}
