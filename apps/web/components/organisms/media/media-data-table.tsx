"use client";

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
    enableMultiRowSelection: false,

    initialState: {
      rowSelection: { [(data as any)[0]?.id]: true },
    },
    getRowId: (row: any) => row?.id,
  });

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-5 flex-1">
      <DataTable table={table} isSelectedRow>
        <DataTableToolbar table={table} />
      </DataTable>

      <div className="hidden lg:block">
        <MediaPreview media_id={table.getSelectedRowModel()?.flatRows[0]?.id} />
      </div>
    </div>
  );
}
