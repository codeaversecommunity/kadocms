"use client";

import React, { useRef } from "react";
import { Button } from "@/components/atoms/button";
import { Plus } from "lucide-react";
import { uploadMediaFile } from "@/modules/media/media.action";
import { toast } from "sonner";

export default function MediaUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const uploadFile: File = files[i];

      await toast.promise(
        uploadMediaFile(uploadFile, {
          name: uploadFile.name,
          alt_text: "",
          description: "",
        }),
        {
          loading: `Uploading ${files[i].name}...`,
          success: `File ${files[i].name} uploaded successfully!`,
          error: `Failed to upload ${files[i].name}`,
        }
      );
    }

    // Optionally refetch page or data here
    // window.location.reload();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button size={"sm"} onClick={handleButtonClick}>
        <Plus className="mr-2 h-4 w-4" /> Add New
      </Button>
    </>
  );
}
