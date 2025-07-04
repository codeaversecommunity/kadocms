"use client";

import * as React from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/atoms/sheet";
import { fieldTypes } from "@/constants/field-types";
import { ScrollArea } from "../atoms/scroll-area";

export function AppComboboxFieldType({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (fieldValue: string) => {
    onChange?.(fieldValue);
    setOpen(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            {value
              ? fieldTypes.find((field) => field.value === value)?.name
              : "Select field type..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Select Type</SheetTitle>
            <SheetDescription>
              Custom fields and Repeated fields become available once an API is
              created.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="max-h-[80vh]">
            {fieldTypes.map((field) => (
              <div
                key={field.value}
                className="flex items-center px-3 py-3 gap-3 border-b group group-hover:bg-muted/50 cursor-pointer hover:bg-muted/50"
                onClick={() => handleSelect(field.value)}
              >
                <div className="h-7 w-7 grid place-items-center">
                  <field.icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="">{field.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {field.description}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
