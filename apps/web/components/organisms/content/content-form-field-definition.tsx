import { ArrowLeft, ArrowRight, Plus, Save, X } from "lucide-react";
import React, { useCallback } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Separator } from "@/components/atoms/separator";
import { Switch } from "@/components/atoms/switch";
import { useContentStore } from "@/modules/content/content.store";
import { AppComboboxFieldType } from "@/components/molecules/app-combobox-field-type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";

export default function ContentFormFieldDefinition({
  handlePrevious,
  handleSubmit,
}: {
  handlePrevious?: () => void;
  handleSubmit?: () => void;
}) {
  const contentStore = useContentStore();

  // Field change handler
  const handleFieldChange = useCallback(
    (index: number, key: string, value: any) => {
      contentStore.setFieldDefinitions(
        contentStore.form.field_definitions?.map((f, i) =>
          i === index ? { ...f, [key]: value } : f
        )
      );
    },
    [contentStore]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit?.();
  };

  return (
    <form onSubmit={onSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Define API Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-5">
            Content ID (id) and various date / time (`createdAt`, `updatedAt`,
            `publishedAt`, `revisedAt`) will be automatically created.
          </p>
          <div className="flex flex-col gap-6">
            {contentStore.form.field_definitions?.map((field, index) => (
              <Card key={index} className="w-full">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-3">
                      <Label htmlFor={`field-id-${index}`} className="mb-2">
                        Field ID
                      </Label>
                      <Input
                        id={`field-id-${index}`}
                        placeholder="E.g., title, content, etc."
                        className="w-full"
                        value={field.name}
                        onChange={(e) =>
                          handleFieldChange(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <Label htmlFor={`display-name-${index}`} className="mb-2">
                        Display Name
                      </Label>
                      <Input
                        id={`display-name-${index}`}
                        placeholder="E.g., Title, Content, etc."
                        className="w-full"
                        value={field.display_name}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "display_name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <Label htmlFor={`type-${index}`} className="mb-2">
                        Type
                      </Label>
                      <AppComboboxFieldType
                        value={field.type}
                        onChange={(value) =>
                          handleFieldChange(index, "type", value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`is-required-${index}`}>
                        Required field
                      </Label>
                      <Switch
                        id={`is-required-${index}`}
                        checked={field.required}
                        onCheckedChange={(checked) =>
                          handleFieldChange(index, "required", checked)
                        }
                      />
                    </div>
                    {(contentStore.form?.field_definitions?.length ?? 0) >
                      1 && (
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
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full mt-6"
            onClick={contentStore.handleAddField}
          >
            <Plus className="inline mr-2 h-4 w-4" />
            Add Field
          </Button>
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row justify-end gap-4 mt-5">
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
