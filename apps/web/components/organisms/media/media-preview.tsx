"use client";

import {
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Save,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Separator } from "@/components/atoms/separator";
import { confirm } from "@/components/providers/confirm-dialog-provider";
import { cn, formatBytes, formatDate } from "@/lib/utils";
import Image from "next/image";
import { Media } from "@/modules/media/media.type";
import { getMediaById } from "@/modules/media/media.action";
import { Skeleton } from "@/components/atoms/skeleton";
import MediaPreviewLoading from "./media-preview-loading";
import { ScrollArea } from "@/components/atoms/scroll-area";

export default function MediaPreview({
  media_id,
  initialMedia,
}: {
  media_id?: string;
  initialMedia?: Media | null;
}) {
  const [media, setMedia] = useState<Media | null>(initialMedia ?? null);
  const [fetching, setFetching] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [altText, setAltText] = useState(media?.alt_text || "");
  const [description, setDescription] = useState(media?.description || "");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (initialMedia) {
      setMedia(initialMedia);
      setAltText(initialMedia?.alt_text || "");
      setDescription(initialMedia?.description || "");
      return;
    }
    const fetchMedia = async () => {
      if (!media_id) return;
      setFetching(true);
      try {
        const response = await getMediaById(media_id);
        if (response) {
          setMedia(response);
          setAltText(response?.alt_text || "");
          setDescription(response?.description || "");
        } else {
          console.error("Media not found");
        }
      } catch (error) {
        console.error("Failed to fetch media:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchMedia();
  }, [media_id, initialMedia]);

  const hasChanges =
    altText !== (media?.alt_text || "") ||
    description !== (media?.description || "");

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(media?.file_path || "");
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleDownload = () => {
    if (!media) return;
    const link = document.createElement("a");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.href = media.file_path;
    link.download = media.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onUpdate = async () => {
    setUpdating(true);
    try {
      // await mediaStore.update(media?.id || "", {
      //   alt_text: altText,
      //   description: description,
      // });
    } finally {
      setUpdating(false);
    }
  };

  const onDelete = async () => {
    setDeleting(true);
    try {
      const confirmed = await confirm({
        title: "Delete File",
        description:
          "Are you sure you want to delete this file? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
      });
      // if (confirmed) await mediaStore.delete(media?.id || "");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative flex flex-1 flex-col h-full">
      <Card className="absolute inset-0 flex overflow-hidden rounded-lg pt-0">
        {fetching ? (
          <MediaPreviewLoading />
        ) : !media ? (
          <CardContent className="flex flex-1 items-center justify-center h-full">
            <div className="text-muted-foreground text-sm">
              Select a file to view details
            </div>
          </CardContent>
        ) : (
          <ScrollArea className="h-full w-full">
            {/* Preview */}
            <div className="bg-muted p-4 mb-5">
              {media.media_type.includes("IMAGE") ? (
                <Image
                  width={media.width || 800}
                  height={media.height || 600}
                  src={media.file_path}
                  alt={media.alt_text || media.name}
                  className="max-w-full object-contain h-60 w-full mx-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-48 bg-background rounded-lg">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="font-medium">{media.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {media.media_type}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <CardContent className="pb-5">
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className={cn(
                    "cursor-pointer",
                    copySuccess
                      ? "bg-green-50 border-green-200 text-green-700"
                      : ""
                  )}
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={media?.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </a>
                </Button>
              </div>

              <Separator className="my-4" />

              {/* File Details */}
              <div className="space-y-4">
                <h3 className="font-medium">File Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">File Size</Label>
                    <p>{formatBytes(media.file_size)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Format</Label>
                    <p>{media.media_type}</p>
                  </div>
                  {media.width && media.height && (
                    <>
                      <div>
                        <Label className="text-muted-foreground">
                          Dimensions
                        </Label>
                        <p>
                          {media.width} × {media.height} pixels
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Aspect Ratio
                        </Label>
                        <p>
                          {(media.width / media.height).toFixed(2)}
                          :1
                        </p>
                      </div>
                    </>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <p>{formatDate(media.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Modified</Label>
                    <p>{formatDate(media.updated_at)}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Metadata */}
              <div className="space-y-4">
                <h3 className="font-medium">Metadata</h3>

                {media.media_type.includes("IMAGE") && (
                  <div>
                    <Label className="mb-2" htmlFor="alt-text">
                      Alt Text
                    </Label>
                    <Input
                      id="alt-text"
                      placeholder="Describe this image for accessibility..."
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label className="mb-2" htmlFor="description">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Add a description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {hasChanges && (
                  <Button
                    disabled={updating}
                    className="w-full"
                    onClick={onUpdate}
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                )}
              </div>

              <Separator className="my-4" />

              {/* Danger Zone */}
              <div className="space-y-4">
                <h3 className="font-medium text-red-600">Danger Zone</h3>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={deleting}
                  onClick={onDelete}
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete File
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}
