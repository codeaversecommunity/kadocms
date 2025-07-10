import { ContentSettingSidebar } from "@/components/organisms/content/settings/content-setting-sidebar";
import React from "react";

export default function ContentSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-16 space-y-6">
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-x-12 lg:space-y-0">
        <div className="w-full overflow-x-auto pb-2 lg:w-1/6 lg:pb-0">
          <ContentSettingSidebar />
        </div>
        <div className="flex-1 lg:max-w-3xl">
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
