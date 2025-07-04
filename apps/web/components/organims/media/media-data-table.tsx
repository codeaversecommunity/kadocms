"use client";

import { Filter, Grid3X3, List, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
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
import { useMediaStore } from "@/modules/media/media.store";

export default function MediaDataTable() {
  const mediaStore = useMediaStore();
  const { reports: data, report: selectedFile } = mediaStore;

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      await mediaStore.getReports();
      if (data.length > 0) mediaStore.setReport(data[0]);
    };
    fetchReports();
  }, []);

  const handleFileUpload = useCallback(() => {
    mediaStore.getReports();
    setIsUploadOpen(false);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search files..." className="pl-10" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <Button size="sm" className="" onClick={() => setIsUploadOpen(true)}>
          <Plus className="h-4 w-4" />
          Upload
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-5">
        <Card className="overflow-y-auto h-[80vh]">
          <CardContent>
            <Table>
              <TableCaption>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {data.length} files found
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Image Size</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((file) => (
                  <TableRow
                    key={file.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted",
                      selectedFile?.id === file.id ? "bg-muted font-medium" : ""
                    )}
                    onClick={() => mediaStore.setReport(file)}
                  >
                    <TableCell>
                      {file.media_type.startsWith("image/") ? (
                        <Image
                          src={file.file_path}
                          alt={file.alt_text || file.name}
                          width={50}
                          height={50}
                          className="w-20 h-20 object-cover object-center rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {file.name.split(".").pop()?.toUpperCase()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{file.media_type}</TableCell>
                    <TableCell>
                      {file.file_size
                        ? `${(file.file_size / 1024).toFixed(2)} KB`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {file.width && file.height
                        ? `${file.width}x${file.height}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {/* {file.creator?.name || "Unknown"} */} -
                    </TableCell>
                    <TableCell>
                      {new Date(file.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* <MediaPreview /> */}
      </div>

      {/* Dialogs */}
      {/* <MediaUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUploadComplete={handleFileUpload}
      /> */}
    </>
  );
}
