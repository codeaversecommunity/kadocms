"use client";

import { Button } from "@/components/atoms/button";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function AppHeaderThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = resolvedTheme === "dark" ? "light" : "dark";
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newMode);
        return;
      }

      // Set coordinates from the click event
      if (e) {
        root.style.setProperty("--x", `${e.clientX}px`);
        root.style.setProperty("--y", `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        setTheme(newMode);
      });
    },
    [resolvedTheme, setTheme]
  );

  return (
    <Button
      variant="secondary"
      size="icon"
      className="group/toggle size-8"
      onClick={handleThemeToggle}
    >
      <Sun />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
