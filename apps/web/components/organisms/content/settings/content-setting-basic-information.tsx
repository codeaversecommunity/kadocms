"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { toast } from "sonner";
import { updateContent } from "@/modules/content/content.action";
import { Content } from "@/modules/content/content.type";

export default function ContentSettingBasicInformation({
  content,
}: {
  content: Content;
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData({ name: content.name, slug: content.slug });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateContent(content.id, {
        name: formData.name,
        slug: formData.slug,
      });

      if (!response) {
        throw new Error("Failed to update content");
      }
      toast.success("API information updated successfully!");

      // Refresh the content store
      window.location.href = `/dashboard/apis/${formData.slug}/settings`;
    } catch (error: any) {
      toast.error(error.message || "Failed to update API information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Basic Information</h3>

        <div className="space-y-2">
          <Label htmlFor="api-name">API Name</Label>
          <p className="text-sm text-muted-foreground">
            Enter description of the API. This can be changed later.
          </p>
          <Input
            id="api-name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="E.g., Blogs, Products, etc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endpoint">Endpoint</Label>
          <p className="text-sm text-muted-foreground">
            Specify API endpoint name. This can be changed later.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              https://yourdomain.com/api/v1/
            </span>
            <Input
              id="endpoint"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="blogs"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
