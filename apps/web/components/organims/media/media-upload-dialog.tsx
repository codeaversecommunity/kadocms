"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/atoms/sheet";
import { Upload, X, File, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/card";
import { cn } from "@/lib/utils";
import { useMediaStore } from "@/modules/media/media.store";

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

interface UploadFile {
  file: File;
  preview?: string;
  altText?: string;
  description?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
}

export function MediaUploadDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: MediaUploadDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Get Zustand store methods
  const { upload, loading_upload, queryParams } = useMediaStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
      altText: "",
      description: "",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
      "video/*": [".mp4", ".webm", ".ogg"],
      "application/pdf": [".pdf"],
      "text/*": [".txt", ".md"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFileMetadata = (
    index: number,
    field: "altText" | "description",
    value: string
  ) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = { ...newFiles[index], [field]: value };
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const uploadFile = files[i];

      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[i] = { ...newFiles[i], uploading: true };
        return newFiles;
      });

      try {
        // Use Zustand store upload method
        const result = await upload(uploadFile.file, {
          name: uploadFile.file.name,
          alt_text: uploadFile.altText || "",
          description: uploadFile.description || "",
        });

        if (result) {
          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i] = { ...newFiles[i], uploading: false, uploaded: true };
            return newFiles;
          });
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        setFiles((prev) => {
          const newFiles = [...prev];
          newFiles[i] = {
            ...newFiles[i],
            uploading: false,
            error: error instanceof Error ? error.message : "Upload failed",
          };
          return newFiles;
        });
      }
    }

    setIsUploading(false);

    // Only close the sheet if all files uploaded successfully (no errors)
    const hasError = files.some((f) => f.error);
    if (!hasError) {
      setTimeout(() => {
        onUploadComplete();
        setFiles([]);
        onOpenChange(false);
      }, 1000);
    } else {
      setTimeout(() => {
        onUploadComplete();
      }, 1000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const allUploaded = files.length > 0 && files.every((f) => f.uploaded);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={cn("w-full sm:max-w-2xl")}>
        <SheetHeader>
          <SheetTitle>Upload Media</SheetTitle>
          <SheetDescription>
            Upload images, videos, and other files to your media library
          </SheetDescription>
        </SheetHeader>

        <div className={cn("space-y-6 p-5")}>
          {/* Success Message */}
          {allUploaded && (
            <div
              className={cn(
                "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2"
              )}
            >
              <CheckCircle className="h-5 w-5" />
              All files uploaded successfully! Refreshing media library...
            </div>
          )}

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            )}
          >
            <input {...getInputProps()} />
            <Upload
              className={cn("mx-auto h-8 w-8 text-muted-foreground mb-4")}
            />
            {isDragActive ? (
              <p className={cn("text-md")}>Drop the files here...</p>
            ) : (
              <div>
                <p className={cn("text-md font-medium mb-2")}>
                  Drag & drop files here, or click to select
                </p>
                <p className={cn("text-xs text-muted-foreground")}>
                  Supports images, videos, PDFs, and text files up to 10MB
                </p>
              </div>
            )}
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className={cn("space-y-4")}>
              <h3 className={cn("font-medium")}>
                Files to Upload ({files.length})
              </h3>
              <div className={cn("space-y-3 max-h-96 overflow-y-auto")}>
                {files.map((uploadFile, index) => (
                  <Card key={index}>
                    <CardContent className={cn("p-4")}>
                      <div className={cn("flex items-start gap-4")}>
                        {/* File Preview */}
                        <div
                          className={cn(
                            "w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0"
                          )}
                        >
                          {uploadFile.preview ? (
                            <img
                              src={uploadFile.preview}
                              alt={uploadFile.file.name}
                              className={cn("w-full h-full object-cover")}
                            />
                          ) : (
                            <div
                              className={cn(
                                "w-full h-full flex items-center justify-center"
                              )}
                            >
                              <File
                                className={cn("h-6 w-6 text-muted-foreground")}
                              />
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className={cn("flex-1 space-y-3")}>
                          <div>
                            <p className={cn("font-medium")}>
                              {uploadFile.file.name}
                            </p>
                            <p className={cn("text-sm text-muted-foreground")}>
                              {formatFileSize(uploadFile.file.size)} •{" "}
                              {uploadFile.file.type}
                            </p>
                          </div>

                          {/* Metadata Fields */}
                          {uploadFile.file.type.startsWith("image/") && (
                            <div className={cn("space-y-2")}>
                              <div>
                                <Label
                                  htmlFor={`alt-${index}`}
                                  className={cn("text-xs")}
                                >
                                  Alt Text
                                </Label>
                                <Input
                                  id={`alt-${index}`}
                                  placeholder="Describe this image..."
                                  value={uploadFile.altText}
                                  onChange={(e) =>
                                    updateFileMetadata(
                                      index,
                                      "altText",
                                      e.target.value
                                    )
                                  }
                                  className={cn("h-8")}
                                  disabled={
                                    uploadFile.uploading || uploadFile.uploaded
                                  }
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <Label
                              htmlFor={`desc-${index}`}
                              className={cn("text-xs")}
                            >
                              Description (Optional)
                            </Label>
                            <Input
                              id={`desc-${index}`}
                              placeholder="Add a description..."
                              value={uploadFile.description}
                              onChange={(e) =>
                                updateFileMetadata(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className={cn("h-8")}
                              disabled={
                                uploadFile.uploading || uploadFile.uploaded
                              }
                            />
                          </div>

                          {/* Upload Status */}
                          {uploadFile.uploading && (
                            <div
                              className={cn(
                                "flex items-center gap-2 text-sm text-blue-600"
                              )}
                            >
                              <div
                                className={cn(
                                  "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                                )}
                              ></div>
                              Uploading...
                            </div>
                          )}
                          {uploadFile.uploaded && (
                            <div
                              className={cn(
                                "flex items-center gap-2 text-sm text-green-600"
                              )}
                            >
                              <CheckCircle className={cn("h-4 w-4")} />
                              Uploaded successfully
                            </div>
                          )}
                          {uploadFile.error && (
                            <div className={cn("text-sm text-red-600")}>
                              ✗ {uploadFile.error}
                            </div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          disabled={uploadFile.uploading}
                          className={cn("h-8 w-8")}
                        >
                          <X className={cn("h-4 w-4")} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          {files.length > 0 && (
            <div className={cn("flex justify-end gap-2")}>
              <Button
                variant="outline"
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                Clear All
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={isUploading || allUploaded}
              >
                {isUploading ? (
                  <>
                    <div
                      className={cn(
                        "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                      )}
                    ></div>
                    Uploading...
                  </>
                ) : allUploaded ? (
                  "All Files Uploaded"
                ) : (
                  `Upload ${files.filter((f) => !f.uploaded).length} Files`
                )}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
