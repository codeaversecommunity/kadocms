"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/atoms/table/data-table";
import { DataTableToolbar } from "@/components/atoms/table/data-table-toolbar";
import { getContentColumns } from "./content-data-table-column";
import { Content } from "@/modules/content/content.type";

interface ContentDataTableProps<TData, TValue> {
  data: TData[];
  totalItems: number;
  content: Content;
}

export default function ContentDataTable<TData, TValue>({
  data,
  totalItems,
  content,
}: ContentDataTableProps<TData, TValue>) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);

  const columns = getContentColumns({
    fields: data || [],
    content: content,
  });

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500,
  });

  return (
    <DataTable table={table} isSelectedRow>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
