"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Upload,
  MoveLeft,
  Undo2,
  X,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Switch } from "@/components/atoms/switch";
import { useContentStore } from "@/modules/content/content.store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AppMediaPicker from "@/components/molecules/app-media-picker";
import { Content, FieldDefinition } from "@/modules/content/content.type";
import { toast } from "sonner";
import { createContentEntry } from "@/modules/content/content.action";

export default function ContentEntryForm({
  content,
  contentEntryId,
}: {
  content: Content;
  contentEntryId?: string;
}) {
  const router = useRouter();

  // Use a data object for field values
  const [formValues, setFormValues] = useState<{ data: Record<string, any> }>({
    data: {},
  });

  // Update by field name
  const handleChange = (fieldName: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      data: { ...prev.data, [fieldName]: value },
    }));
  };

  // Submit as { content_id, data }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      content_id: content.id,
      data: formValues.data,
    };

    // await createContentEntry
    const res = await toast.promise(createContentEntry(payload), {
      loading: "Loading...",
      success: "Created!",
      error: "Error creating content",
    });

    const entry = await res.unwrap();
    if (entry) router.push(`/dashboard/apis/${content.slug}`);
  };

  // Use field.name for value
  const renderField = (field: FieldDefinition) => {
    const value = formValues.data[field.name] ?? (field.multiple ? [] : "");

    switch (field.type) {
      case "TEXT_FIELD":
        return (
          <Input
            value={value}
            placeholder={field.placeholder || field.display_name}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      case "TEXT_AREA":
        return (
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={value}
            placeholder={field.placeholder || field.display_name}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            rows={4}
          />
        );

      case "RICH_TEXT_EDITOR":
        return (
          <div className="border rounded-md">
            <div className="border-b p-2 bg-muted/50">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" type="button">
                  B
                </Button>
                <Button variant="ghost" size="sm" type="button">
                  I
                </Button>
                <Button variant="ghost" size="sm" type="button">
                  U
                </Button>
              </div>
            </div>
            <textarea
              className="w-full p-3 min-h-[120px] border-0 resize-none focus:outline-none"
              value={value}
              placeholder={field.placeholder || field.display_name}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          </div>
        );

      case "IMAGE":
        return (
          <AppMediaPicker
            value={value}
            onChange={(v) => handleChange(field.name, v)}
            placeholder={field.placeholder || "Select an image"}
            multiple={false}
            required={field.required}
          />
        );

      case "MULTIPLE_IMAGES":
        return (
          <AppMediaPicker
            value={value}
            onChange={(v) => handleChange(field.name, v)}
            multiple={true}
            placeholder={field.placeholder || "Select images"}
            required={field.required}
          />
        );

      case "DATE":
        return (
          <div className="relative">
            <Input
              type="date"
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        );

      case "BOOLEAN":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === true || value === "true"}
              onCheckedChange={(checked) =>
                handleChange(field.name, checked ? true : false)
              }
            />
            <Label>{value ? "Yes" : "No"}</Label>
          </div>
        );

      case "SELECTABLE_FIELD":
        const options = field.default_value || [];
        return (
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">
              {field.placeholder ||
                `Select ${field.display_name.toLowerCase()}`}
            </option>
            {options.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder || field.display_name}
            required={field.required}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/apis/${content.slug}`}>
          <div className="flex items-center gap-4">
            <Undo2 className="h-5 w-5" />

            <div>
              <h1 className="font-medium">
                {contentEntryId ? "Edit" : "Create"} {content?.name}
              </h1>
              <p className="text-muted-foreground text-xs">
                Fill out the form below to{" "}
                {contentEntryId ? "update" : "create"} a new entry for{" "}
                <span className="font-semibold">{content?.name}</span>.
              </p>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-2">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <Label>Published</Label>
          </div> */}
          <Button variant={"secondary"}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4" />
            {contentEntryId ? "Update Entry" : "Create Entry"}
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Content Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {content?.field_definitions?.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.name} className="flex items-center gap-2">
                {field.display_name}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              {renderField(field)}
              {field.placeholder && (
                <p className="text-xs text-muted-foreground">
                  {field.placeholder}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Metadata */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Content ID</Label>
              <p className="font-mono text-xs">
                {isEditing ? entryStore.currentEntry?.id : "Will be generated"}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <p>{isPublished ? "Published" : "Draft"}</p>
            </div>
            {isEditing && (
              <>
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p>
                    {entryStore.currentEntry?.created_at
                      ? new Date(
                          entryStore.currentEntry.created_at
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Updated</Label>
                  <p>
                    {entryStore.currentEntry?.updated_at
                      ? new Date(
                          entryStore.currentEntry.updated_at
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card> */}
    </form>
  );
}
