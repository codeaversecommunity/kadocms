"use client";
import { DataTableColumnHeader } from "@/components/atoms/table/data-table-column-header";
import { formatCalendar } from "@/lib/format";
import { formatBytes } from "@/lib/utils";
import { Media } from "@/modules/media/media.type";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import Image from "next/image";

export const mediaColumns: ColumnDef<Media>[] = [
  {
    accessorKey: "file_path",
    header: "PREVIEW",
    meta: {
      label: "Preview",
    },
    cell: ({ row }) => {
      const mediaType = row.getValue("media_type") as string;
      const filePath = row.getValue("file_path") as string;
      const fileName = row.getValue("name") as string;
      const altText = row.original.alt_text;
      const width = row.original.width;
      const height = row.original.height;

      return (
        <>
          {mediaType?.includes("IMAGE") ? (
            <div className="w-20 h-20 bg-gray-200 grid place-items-center rounded overflow-hidden">
              <Image
                src={filePath}
                alt={altText || fileName}
                width={width || 50}
                height={height || 50}
                className="object-contain object-center"
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-muted grid place-items-center rounded overflow-hidden">
              <div className="flex items-center justify-center text-xs font-bold text-muted-foreground">
                {fileName.split(".").pop()?.toUpperCase() || "FILE"}
              </div>
            </div>
          )}
        </>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Media, unknown> }) => (
      <DataTableColumnHeader column={column} title="Filename" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Media["name"]>()}</div>,
    meta: {
      label: "File Name",
    },
  },
  {
    accessorKey: "media_type",
    header: "Format",
    cell: ({ row }) => {
      const mediaType = row.getValue("media_type") as string;
      return <div className="text-sm">{mediaType}</div>;
    },
    meta: {
      label: "Format",
    },
  },
  {
    accessorKey: "file_size",
    header: "File Size",
    cell: ({ row }) => {
      const fileSize = row.getValue("file_size") as number;
      return <div className="text-sm">{formatBytes(fileSize) || "N/A"}</div>;
    },
    meta: {
      label: "File Size",
    },
  },
  {
    accessorKey: "dimensions",
    header: "Image Size",
    cell: ({ row }) => {
      const width = row.original.width;
      const height = row.original.height;
      return (
        <div className="text-sm">
          {width && height ? `${width}x${height}` : "N/A"}
        </div>
      );
    },
    meta: {
      label: "Image Size",
    },
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      return (
        <div className="text-sm">
          {/* {new Date(createdAt).toLocaleDateString()} */}
          {formatCalendar(createdAt)}
        </div>
      );
    },
    meta: {
      label: "Date Created",
    },
  },

  //   {
  //     id: "actions",
  //     cell: ({ row }) => <CellAction data={row.original} />,
  //   },
];
