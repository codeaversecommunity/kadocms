"use client";

import { useEffect, useState } from "react";
import { Save, Plus, X, Settings } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Switch } from "@/components/atoms/switch";
import { Separator } from "@/components/atoms/separator";
import { toast } from "sonner";
import { AppComboboxFieldType } from "@/components/molecules/app-combobox-field-type";
import { Content, FieldDefinition } from "@/modules/content/content.type";

export default function ContentSettingApiSchema({
  content,
}: {
  content: Content;
}) {
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content && content.field_definitions) {
      setFields(content.field_definitions);
    } else {
      setFields([]);
    }
  }, [content]);

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        name: "",
        display_name: "",
        type: "text", // Default type
        required: false,
        multiple: false,
        placeholder: null,
        default_value: null,
        content_id: content.id,
        relation_to_content_id: null,
        creator_id: "", // This should be set to the current user ID
        modifier_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        relation_to_content: null,
      },
    ]);
  };

  const handleRemoveField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: string, value: any) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/content/${content.id}/fields`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update API schema");
      }

      toast.success("API schema updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update API schema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-0">API Schema</h3>
          <p className="text-sm text-muted-foreground">
            Define the fields for your content. These fields will be used in the
            API schema.
          </p>
        </div>
        {fields.map((field, index) => (
          <div key={field.id || index}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`field-id-${index}`}>Field ID</Label>
                <Input
                  id={`field-id-${index}`}
                  value={field.name}
                  onChange={(e) =>
                    handleFieldChange(index, "name", e.target.value)
                  }
                  placeholder="E.g., title, content, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`display-name-${index}`}>Display Name</Label>
                <Input
                  id={`display-name-${index}`}
                  value={field.display_name}
                  onChange={(e) =>
                    handleFieldChange(index, "display_name", e.target.value)
                  }
                  placeholder="E.g., Title, Content, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`type-${index}`}>Type</Label>
                <AppComboboxFieldType
                  value={field.type}
                  onChange={(value) => handleFieldChange(index, "type", value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={field.required}
                    onCheckedChange={(checked) =>
                      handleFieldChange(index, "required", checked)
                    }
                  />
                  <Label>Required field</Label>
                </div>
              </div>

              {fields.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>

            {index < fields.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddField}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
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
        {/* cancel */}
        <Button
          type="button"
          variant="ghost"
          className="ml-2"
          onClick={() => {
            // Reset fields to initial state or handle cancel logic
            setFields(content.field_definitions || []);
            toast.info("Changes discarded");
          }}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
