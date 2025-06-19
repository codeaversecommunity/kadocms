"use client";

import { useState, useEffect } from "react";
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
import { 
  Download, 
  Trash2, 
  Copy, 
  ExternalLink,
  Calendar,
  FileText,
  Image as ImageIcon,
  Save,
  CheckCircle
} from "lucide-react";
import { Separator } from "@/components/atoms/separator";

interface MediaFile {
  id: string;
  name: string;
  media_type: string;
  file_size: number;
  file_path: string;
  width?: number;
  height?: number;
  alt_text?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface MediaPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: MediaFile;
  onDelete: () => void;
  onUpdate: () => void;
}

export function MediaPreviewDialog({
  open,
  onOpenChange,
  file,
  onDelete,
  onUpdate,
}: MediaPreviewDialogProps) {
  const [altText, setAltText] = useState(file.alt_text || "");
  const [description, setDescription] = useState(file.description || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Reset form when file changes
  useEffect(() => {
    setAltText(file.alt_text || "");
    setDescription(file.description || "");
    setUpdateSuccess(false);
  }, [file.id, file.alt_text, file.description]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(file.file_path);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.file_path;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/media/${file.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alt_text: altText,
          description: description,
        }),
      });

      if (!response.ok) throw new Error('Failed to update file');

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      // Auto-refetch media files after update
      onUpdate();
    } catch (error) {
      console.error('Error updating file:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = altText !== (file.alt_text || "") || description !== (file.description || "");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {file.media_type.startsWith('image/') ? (
              <ImageIcon className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            {file.name}
          </SheetTitle>
          <SheetDescription>
            View and edit media file details
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Success Messages */}
          {updateSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              File updated successfully!
            </div>
          )}

          {/* Preview */}
          <div className="bg-muted rounded-lg p-4">
            {file.media_type.startsWith('image/') ? (
              <img
                src={file.file_path}
                alt={file.alt_text || file.name}
                className="max-w-full max-h-96 mx-auto rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-48 bg-background rounded-lg">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{file.media_type}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyUrl}
              className={copySuccess ? "bg-green-50 border-green-200 text-green-700" : ""}
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
              <a href={file.file_path} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </a>
            </Button>
          </div>

          <Separator />

          {/* File Details */}
          <div className="space-y-4">
            <h3 className="font-medium">File Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">File Size</Label>
                <p>{formatFileSize(file.file_size)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Format</Label>
                <p>{file.media_type}</p>
              </div>
              {file.width && file.height && (
                <>
                  <div>
                    <Label className="text-muted-foreground">Dimensions</Label>
                    <p>{file.width} × {file.height} pixels</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Aspect Ratio</Label>
                    <p>{(file.width / file.height).toFixed(2)}:1</p>
                  </div>
                </>
              )}
              <div>
                <Label className="text-muted-foreground">Created</Label>
                <p>{formatDate(file.created_at)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Modified</Label>
                <p>{formatDate(file.updated_at)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="font-medium">Metadata</h3>
            
            {file.media_type.startsWith('image/') && (
              <div>
                <Label htmlFor="alt-text">Alt Text</Label>
                <Input
                  id="alt-text"
                  placeholder="Describe this image for accessibility..."
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Add a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {hasChanges && (
              <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
                {isUpdating ? (
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

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="font-medium text-red-600">Danger Zone</h3>
            <Button
              variant="destructive"
              onClick={onDelete}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete File
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}