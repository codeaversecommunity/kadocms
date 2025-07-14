"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/atoms/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { cn } from "@/lib/utils";
import MediaPreview from "./media-preview";
import { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/atoms/table/data-table";
import { DataTableToolbar } from "@/components/atoms/table/data-table-toolbar";

interface MediaDataTableProps<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

export default function MediaDataTable<TData, TValue>({
  data,
  totalItems,
  columns,
}: MediaDataTableProps<TData, TValue>) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data, // product data
    columns, // product columns
    pageCount: pageCount,
    shallow: false, //Setting to false triggers a network request with the updated querystring.
    debounceMs: 500,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
