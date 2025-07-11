"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Image as ImageIcon,
  Search,
  Grid3X3,
  List,
  Check,
} from "lucide-react";
import { cn, formatFileSize, formatDate } from "@/lib/utils";
import { useMediaStore } from "@/modules/media/media.store";
import { Card, CardContent } from "../atoms/card";
import { Button } from "../atoms/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../atoms/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../atoms/dialog";
import { Input } from "../atoms/input";

interface tbm_media {
  id: string;
  name: string;
  file_path: string;
  media_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  description: string | null;
  creator_id: string;
  workspace_id: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  modifier_id: string | null;
  creator?: { full_name?: string };
}

interface MediaFieldProps {
  value?: string | string[] | tbm_media | tbm_media[];
  onChange: (value: string | string[] | null) => void;
  multiple?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function AppMediaPicker({
  value,
  onChange,
  multiple = false,
  placeholder = "Select media",
  className,
}: MediaFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [localSelected, setLocalSelected] = useState<tbm_media[]>([]);
  const mediaStore = useMediaStore();

  const displayValue = normalizeMediaValue(value);

  useEffect(() => {
    if (isModalOpen) {
      mediaStore.getReports();
    }
  }, [isModalOpen]);

  useEffect(() => {
    setLocalSelected(displayValue);
  }, [isModalOpen]);

  function normalizeMediaValue(input: any): tbm_media[] {
    if (!input) return [];
    if (typeof input === "string") return [mockMedia(input)];
    if (Array.isArray(input)) {
      if (typeof input[0] === "string") return input.map(mockMedia);
      return input as tbm_media[];
    }
    return [input as tbm_media];
  }

  function mockMedia(url: string): tbm_media {
    return {
      id: "temp",
      name: "Selected Image",
      file_path: url,
      media_type: "image/*",
      file_size: 0,
      width: null,
      height: null,
      alt_text: null,
      description: null,
      creator_id: "",
      workspace_id: "",
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false,
      modifier_id: null,
    };
  }

  function handleRemove(index?: number) {
    if (multiple && typeof index === "number") {
      const newValue = displayValue
        .filter((_, i) => i !== index)
        .map((m) => m.file_path);
      onChange(newValue.length ? newValue : null);
    } else {
      onChange(null);
    }
  }

  function handleConfirm() {
    if (multiple) {
      onChange(localSelected.map((m) => m.file_path));
    } else {
      onChange(localSelected[0]?.file_path || null);
    }
    setIsModalOpen(false);
  }

  function toggleSelect(media: any) {
    if (multiple) {
      setLocalSelected((prev) =>
        prev.find((item) => item.id === media.id)
          ? prev.filter((item) => item.id !== media.id)
          : [...prev, media]
      );
    } else {
      setLocalSelected([media]);
    }
  }

  const isSelected = (media: any) =>
    localSelected.some((m) => m.id === media.id);
  const filtered = mediaStore.reports.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {multiple ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {displayValue.map((media, i) => (
              <Card key={media.id || i} className="relative group">
                <CardContent className="p-2">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                    <Image
                      src={media.file_path}
                      alt={media.alt_text || media.name}
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(i)}
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {displayValue.length ? "Add More Images" : placeholder}
          </Button>
        </div>
      ) : displayValue[0] ? (
        <div className="space-y-3">
          <Card className="relative group">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Image
                  src={displayValue[0].file_path}
                  alt={displayValue[0].alt_text || displayValue[0].name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {displayValue[0].name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {displayValue[0].width && displayValue[0].height
                      ? `${displayValue[0].width} × ${displayValue[0].height}`
                      : "Image"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove()}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="w-full"
          >
            Change Image
          </Button>
        </div>
      ) : (
        <Card
          className={cn(
            "border-2 border-dashed hover:border-primary/50 cursor-pointer",
            className
          )}
          onClick={() => setIsModalOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">{placeholder}</p>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Select Image
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Media</DialogTitle>
            <DialogDescription>
              Choose from your media library
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between gap-4 py-4 border-b">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                size="sm"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {mediaStore.loading_reports ? (
              <div className="flex justify-center items-center h-64">
                Loading...
              </div>
            ) : !filtered.length ? (
              <div className="flex justify-center items-center h-64 text-muted-foreground">
                No files found
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                {filtered.map((media) => (
                  <Card
                    key={media.id}
                    onClick={() => toggleSelect(media)}
                    className={cn(
                      "cursor-pointer relative",
                      isSelected(media) && "ring-2 ring-primary"
                    )}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-square rounded overflow-hidden relative">
                        <Image
                          src={media.file_path}
                          alt={media.alt_text || media.name}
                          fill
                          className="object-cover"
                        />
                        {isSelected(media) && (
                          <Check className="absolute top-2 right-2 h-4 w-4 bg-primary text-white rounded-full p-0.5" />
                        )}
                      </div>
                      <p className="text-xs truncate mt-1">{media.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((media) => (
                    <TableRow
                      key={media.id}
                      onClick={() => toggleSelect(media)}
                      className={cn(
                        "cursor-pointer",
                        isSelected(media) && "bg-primary/10"
                      )}
                    >
                      <TableCell>
                        <Image
                          src={media.file_path}
                          alt={media.name}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>{media.name}</TableCell>
                      <TableCell>{formatFileSize(media.file_size)}</TableCell>
                      <TableCell>{formatDate(media.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {multiple
                ? `${localSelected.length} selected`
                : localSelected[0]?.name || "No media selected"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={localSelected.length === 0}
              >
                Use {multiple ? `${localSelected.length} file(s)` : "this file"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
