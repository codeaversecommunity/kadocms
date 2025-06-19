"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Card, CardContent } from "@/components/atoms/card";
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Copy,
  Settings,
  CheckCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { MediaUploadDialog } from "@/components/media/media-upload-dialog";
import { MediaPreviewDialog } from "@/components/media/media-preview-dialog";
import { MediaSettingsDialog } from "@/components/media/media-settings-dialog";
import { DeleteConfirmationDialog } from "@/components/media/delete-confirmation-dialog";

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

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<MediaFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const filesPerPage = 20;

  const fetchMediaFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const workspaceId = localStorage.getItem("selectedWorkspace");
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: filesPerPage.toString(),
        search: searchQuery,
        workspace_id: workspaceId || "",
      });

      const response = await fetch(`/api/media?${params}`);
      if (!response.ok) throw new Error("Failed to fetch media files");

      const data = await response.json();
      setMediaFiles(data.files);
      setTotalFiles(data.total);
    } catch (error) {
      console.error("Error fetching media files:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchMediaFiles();
  }, [fetchMediaFiles]);

  const handleFileUpload = useCallback(() => {
    // Auto-refetch media files after upload
    fetchMediaFiles();
    setIsUploadOpen(false);
  }, [fetchMediaFiles]);

  const handleFileUpdate = useCallback(() => {
    // Auto-refetch media files after update
    fetchMediaFiles();
  }, [fetchMediaFiles]);

  const handleDeleteClick = (file: MediaFile) => {
    setFileToDelete(file);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/media/${fileToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete file");

      // Auto-refetch media files after deletion
      await fetchMediaFiles();
      
      // Close dialogs and reset state
      setIsDeleteDialogOpen(false);
      setFileToDelete(null);
      setSelectedFile(null);
      setIsPreviewOpen(false);
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = async (url: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(fileName);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredFiles = mediaFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(totalFiles / filesPerPage);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Media</h1>
          <p className="text-muted-foreground">
            {totalFiles} files • {Math.ceil(totalFiles / filesPerPage)} pages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className="group cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setSelectedFile(file);
                setIsPreviewOpen(true);
              }}
            >
              <CardContent className="p-2">
                <div className="aspect-square bg-muted rounded-md mb-2 overflow-hidden relative">
                  {file.media_type.startsWith("image/") ? (
                    <img
                      src={file.file_path}
                      alt={file.alt_text || file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-2xl font-bold text-muted-foreground">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedFile(file);
                          setIsPreviewOpen(true);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyUrl(file.file_path, file.name)}>
                          {copySuccess === file.name ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy URL
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(file)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.file_size)}
                  </p>
                  {file.width && file.height && (
                    <p className="text-xs text-muted-foreground">
                      {file.width} × {file.height}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
            <div>Filename</div>
            <div>Format</div>
            <div>File Size</div>
            <div>Image Size</div>
            <div>Date Created</div>
            <div></div>
          </div>
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-muted/50 cursor-pointer"
              onClick={() => {
                setSelectedFile(file);
                setIsPreviewOpen(true);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                  {file.media_type.startsWith("image/") ? (
                    <img
                      src={file.file_path}
                      alt={file.alt_text || file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {file.name.split('.').pop()?.toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="font-medium truncate">{file.name}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                {file.media_type}
              </div>
              <div className="flex items-center text-sm">
                {formatFileSize(file.file_size)}
              </div>
              <div className="flex items-center text-sm">
                {file.width && file.height ? `${file.width} × ${file.height}` : "-"}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                {formatDate(file.created_at)}
              </div>
              <div className="flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedFile(file);
                      setIsPreviewOpen(true);
                    }}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyUrl(file.file_path, file.name)}>
                      {copySuccess === file.name ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(file)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * filesPerPage) + 1} to {Math.min(currentPage * filesPerPage, totalFiles)} of {totalFiles} files
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <MediaUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUploadComplete={handleFileUpload}
      />

      {selectedFile && (
        <MediaPreviewDialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          file={selectedFile}
          onDelete={() => handleDeleteClick(selectedFile)}
          onUpdate={handleFileUpdate}
        />
      )}

      <MediaSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        fileName={fileToDelete?.name || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}