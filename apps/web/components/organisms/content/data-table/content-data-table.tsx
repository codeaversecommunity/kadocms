"use client";

import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { cn } from "@/lib/utils";
import { Content } from "@/modules/content/content.type";
import {
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { ContentDataTableCell } from "./content-data-table-cell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

export default function ContentDataTable({ content }: { content: Content }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const getVisibleFields = () => {
    if (!content?.field_definitions) return [];

    // Get first 5 fields for table display, prioritizing important fields
    const fields = content.field_definitions;
    const priorityFields = fields.filter((field) =>
      ["title", "name", "heading"].some((priority) =>
        field.name.toLowerCase().includes(priority)
      )
    );

    const otherFields = fields.filter(
      (field) =>
        !["title", "name", "heading"].some((priority) =>
          field.name.toLowerCase().includes(priority)
        )
    );

    return [...priorityFields, ...otherFields].slice(0, 5);
  };

  const visibleFields = getVisibleFields();

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/apis/${content.slug}/form`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 sticky left-0 bg-background z-10">
                    Status
                  </TableHead>
                  {visibleFields.map((field) => (
                    <TableHead
                      key={field.id}
                      className={cn(
                        "min-w-[150px]",
                        field.type === "IMAGE" && "w-20",
                        field.type === "BOOLEAN" && "w-24",
                        field.type === "DATE" && "w-32"
                      )}
                    >
                      {field.display_name}
                    </TableHead>
                  ))}
                  <TableHead className="w-32">Created</TableHead>
                  <TableHead className="w-32">Updated</TableHead>
                  <TableHead className="w-20 sticky right-0 bg-background z-10">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.entries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleFields.length + 4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No entries found. Create your first entry to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  content.entries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-muted/50">
                      <TableCell className="sticky left-0 bg-background z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-xs text-green-600">
                            Published
                          </span>
                        </div>
                      </TableCell>
                      {visibleFields.map((field) => (
                        <TableCell key={field.id} className="align-top py-3">
                          <ContentDataTableCell
                            field={field}
                            value={entry.data?.[field.name]}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex flex-col">
                          <span>
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-xs opacity-70">
                            {new Date(entry.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex flex-col">
                          <span>
                            {new Date(entry.updated_at).toLocaleDateString()}
                          </span>
                          <span className="text-xs opacity-70">
                            {new Date(entry.updated_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="sticky right-0 bg-background z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/apis/${content.slug}/entries/${entry.id}`}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/apis/${content.slug}/entries/${entry.id}/edit`}
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
