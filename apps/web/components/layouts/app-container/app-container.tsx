import React from "react";
import { ScrollArea } from "@/components/atoms/scroll-area";

export default function AppContainer({
  children,
  scrollable = true,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className="flex flex-1 p-4 md:px-6">{children}</div>
        </ScrollArea>
      ) : (
        <div className="flex flex-1 p-4 md:px-6">{children}</div>
      )}
    </>
  );
}
