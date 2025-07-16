"use client";

import { Content } from "@/modules/content/content.type";
import { ColumnDef } from "@tanstack/react-table";
import { ContentDataTableCell } from "./content-data-table-cell";
import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Settings, Eye, Edit, Trash2, Text } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

// Generates TanStack Table columns for Content entries
export function getContentColumns({
  fields,
  content,
}: {
  fields: any;
  content: Content;
}): ColumnDef<any>[] {
  // Get up to 5 visible fields, prioritizing title/name/heading
  const visibleFields =
    fields?.length > 0
      ? (() => {
          const priorityFields = content?.field_definitions.filter((field) =>
            ["title", "name", "heading"].some((priority) =>
              field.name.toLowerCase().includes(priority)
            )
          );
          const otherFields = content?.field_definitions.filter(
            (field) =>
              !["title", "name", "heading"].some((priority) =>
                field.name.toLowerCase().includes(priority)
              )
          );
          return [...priorityFields, ...otherFields].slice(0, 5);
        })()
      : [];

  const columns: ColumnDef<any>[] = [
    // Dynamic fields
    ...visibleFields.map((field) => ({
      accessorKey: `data.${field.name}`,
      header: field.display_name,
      cell: ({ row }: { row: { original: any } }) => (
        <ContentDataTableCell
          field={field}
          value={row.original.data?.[field.name] ?? ""}
        />
      ),
    })),

    // Created date column
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const createdAt = row.original.created_at;
        return (
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>
              {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
            </span>
            <span className="text-xs opacity-70">
              {createdAt
                ? new Date(createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
        );
      },
    },
    // Updated date column
    {
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ row }) => {
        const updatedAt = row.original.updated_at;
        return (
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>
              {updatedAt ? new Date(updatedAt).toLocaleDateString() : "N/A"}
            </span>
            <span className="text-xs opacity-70">
              {updatedAt
                ? new Date(updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
        );
      },
    },
    // Actions column
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/apis/${content?.slug}/entries/${entry.id}`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/apis/${content?.slug}/entries/${entry.id}/edit`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
    },
  ];

  return columns;
}
