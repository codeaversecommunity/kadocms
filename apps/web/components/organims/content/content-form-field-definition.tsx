import { ArrowLeft, ArrowRight, Plus, Save, X } from "lucide-react";
import React from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Separator } from "@/components/atoms/separator";
import { Switch } from "@/components/atoms/switch";
import { useContentStore } from "@/modules/content/content.store";
import { AppComboboxFieldType } from "@/components/molecules/app-combobox-field-type";

export default function ContentFormFieldDefinition({
  handlePrevious,
  handleSubmit,
}: {
  handlePrevious?: () => void;
  handleSubmit?: () => void;
}) {
  const contentStore = useContentStore();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit?.();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="bg-muted/50 px-4 py-5 rounded-lg  sm:px-8 md:px-10">
        <div className="mb-5">
          <h2 className="text-2xl">Define API Schema</h2>
          <p className="text-muted-foreground mb-3">
            Content ID (id) and various date / time (`createdAt`, `updatedAt`,
            `publishedAt`, `revisedAt`) will be automatically created.
          </p>
        </div>

        {contentStore.form.field_definitions?.map((field, index) => (
          <div key={index}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="mb-5">
                <Label htmlFor="field-id" className="mb-2">
                  Field ID
                </Label>
                <Input
                  id="field-id"
                  placeholder="E.g., title, content, etc."
                  className="w-full"
                  value={field.name}
                  onChange={(e) =>
                    contentStore.setFieldDefinitions(
                      contentStore.form.field_definitions?.map((f, i) =>
                        i === index ? { ...f, name: e.target.value } : f
                      )
                    )
                  }
                  required
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="display-name" className="mb-2">
                  Display Name
                </Label>
                <Input
                  id="display-name"
                  placeholder="E.g., Title, Content, etc."
                  className="w-full"
                  value={field.display_name}
                  onChange={(e) =>
                    contentStore.setFieldDefinitions(
                      contentStore.form.field_definitions?.map((f, i) =>
                        i === index ? { ...f, display_name: e.target.value } : f
                      )
                    )
                  }
                />
              </div>
              <div className="mb-5">
                <Label htmlFor="type" className="mb-2">
                  Type
                </Label>
                <AppComboboxFieldType
                  value={field.type}
                  onChange={(value) =>
                    contentStore.setFieldDefinitions(
                      contentStore.form.field_definitions?.map((f, i) =>
                        i === index ? { ...f, type: value } : f
                      )
                    )
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="is-required">Required field</Label>
                <Switch
                  id="is-required"
                  checked={field.required}
                  onCheckedChange={(checked) =>
                    contentStore.setFieldDefinitions(
                      contentStore.form.field_definitions?.map((f, i) =>
                        i === index ? { ...f, required: checked } : f
                      )
                    )
                  }
                />
              </div>

              {(contentStore.form?.field_definitions?.length ?? 0) > 1 && (
                <Button
                  variant="link"
                  size="xs"
                  className="text-destructive"
                  onClick={() => contentStore.handleRemoveField(index)}
                >
                  <X className="inline mr-1 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>

            <Separator className="my-5" />
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full"
          onClick={contentStore.handleAddField}
        >
          <Plus className="inline mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>
      <div className="flex justify-end gap-4 mt-5">
        <Button variant="secondary" onClick={handlePrevious}>
          <ArrowLeft className="inline mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button type="submit" disabled={contentStore.loading_form}>
          Create
          <Save className="inline ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
