// components/ConfirmDialogProvider.tsx
"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/atoms/alert-dialog";
import { ReactNode, useState, useEffect } from "react";

type ConfirmOptions = {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
};

type ConfirmFunction = (options?: ConfirmOptions) => Promise<boolean>;

// Declare a global variable to store the confirm function
let externalConfirm: ConfirmFunction = async () => false;

export function confirm(options?: ConfirmOptions) {
  return externalConfirm(options);
}

export const ConfirmDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] =
    useState<(value: boolean) => void>();
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "Are you sure?",
    description: "This action cannot be undone.",
    cancelText: "Cancel",
    confirmText: "Continue",
  });

  // Setup global confirm function on mount
  useEffect(() => {
    externalConfirm = (options?: ConfirmOptions) => {
      setOptions({
        title: "Are you sure?",
        description: "This action cannot be undone.",
        cancelText: "Cancel",
        confirmText: "Continue",
        ...options,
      });
      setIsOpen(true);
      return new Promise<boolean>((resolve) => {
        setResolvePromise(() => resolve);
      });
    };
  }, []);

  const handleCancel = () => {
    resolvePromise?.(false);
    setIsOpen(false);
  };

  const handleConfirm = () => {
    resolvePromise?.(true);
    setIsOpen(false);
  };

  return (
    <>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {options.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {options.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {options.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
