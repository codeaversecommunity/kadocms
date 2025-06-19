"use client";

import { useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Separator } from "@/components/atoms/separator";
import { Settings, Cloud, Database, Trash2 } from "lucide-react";

interface MediaSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MediaSettingsDialog({
  open,
  onOpenChange,
}: MediaSettingsDialogProps) {
  const [cloudinarySettings, setCloudinarySettings] = useState({
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    uploadPreset: "",
    folder: "kadocms",
  });

  const [storageSettings, setStorageSettings] = useState({
    maxFileSize: "10",
    allowedTypes: "image/*, video/*, application/pdf, text/*",
    autoOptimize: true,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Media Settings
          </SheetTitle>
          <SheetDescription>
            Configure your media storage and upload settings
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Cloudinary Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Cloudinary Configuration
              </CardTitle>
              <CardDescription>
                Configure your Cloudinary integration for media storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cloud-name">Cloud Name</Label>
                <Input
                  id="cloud-name"
                  value={cloudinarySettings.cloudName}
                  onChange={(e) => setCloudinarySettings(prev => ({
                    ...prev,
                    cloudName: e.target.value
                  }))}
                  placeholder="your-cloud-name"
                />
              </div>
              <div>
                <Label htmlFor="upload-preset">Upload Preset (Optional)</Label>
                <Input
                  id="upload-preset"
                  value={cloudinarySettings.uploadPreset}
                  onChange={(e) => setCloudinarySettings(prev => ({
                    ...prev,
                    uploadPreset: e.target.value
                  }))}
                  placeholder="unsigned_preset"
                />
              </div>
              <div>
                <Label htmlFor="folder">Default Folder</Label>
                <Input
                  id="folder"
                  value={cloudinarySettings.folder}
                  onChange={(e) => setCloudinarySettings(prev => ({
                    ...prev,
                    folder: e.target.value
                  }))}
                  placeholder="kadocms"
                />
              </div>
            </CardContent>
          </Card>

          {/* Storage Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Storage Settings
              </CardTitle>
              <CardDescription>
                Configure file upload limits and allowed types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                <Input
                  id="max-file-size"
                  type="number"
                  value={storageSettings.maxFileSize}
                  onChange={(e) => setStorageSettings(prev => ({
                    ...prev,
                    maxFileSize: e.target.value
                  }))}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="allowed-types">Allowed File Types</Label>
                <Input
                  id="allowed-types"
                  value={storageSettings.allowedTypes}
                  onChange={(e) => setStorageSettings(prev => ({
                    ...prev,
                    allowedTypes: e.target.value
                  }))}
                  placeholder="image/*, video/*, application/pdf"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-optimize"
                  checked={storageSettings.autoOptimize}
                  onChange={(e) => setStorageSettings(prev => ({
                    ...prev,
                    autoOptimize: e.target.checked
                  }))}
                  className="rounded"
                />
                <Label htmlFor="auto-optimize">Auto-optimize images</Label>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>
                Current storage usage and limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Files stored</span>
                  <span>156 files</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total size</span>
                  <span>2.4 GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Plan limit</span>
                  <span>10 GB</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All Media
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}