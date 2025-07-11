"use client";

import ContentFormFieldDefinition from "@/components/organisms/content/content-form-field-definition";
import ContentFormInformation from "@/components/organisms/content/content-form-information";
import { useRouter, useSearchParams } from "next/navigation";
import { useContentStore } from "@/modules/content/content.store";
import { createContent } from "@/modules/content/content.action";
import { formatSlug } from "@/lib/utils";
import { toast } from "sonner";

const Tab = {
  Information: "information",
  FieldDefinition: "field-definition",
};

export default function CreateApiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contentStore = useContentStore();

  const tabActive = searchParams.get("tab") || Tab.Information;

  const handleNext = () => {
    if (tabActive === Tab.Information) {
      router.push(`/dashboard/create-api?tab=${Tab.FieldDefinition}`);
    }
  };

  const handlePrevious = () => {
    if (tabActive === Tab.FieldDefinition) {
      router.push(`/dashboard/create-api?tab=${Tab.Information}`);
    }
  };

  const handleSubmit = async () => {
    const response = await createContent({
      name: contentStore.form.name,
      slug: formatSlug(contentStore.form.slug),
      field_definitions: contentStore.form.field_definitions?.map((field) => ({
        name: field.name,
        display_name: field.display_name,
        type: field.type,
        required: field.required,
        multiple: field.multiple,
        placeholder: field.placeholder,
        default_value: field.default_value,
        relation_to_content_id: field.relation_to_id,
      })),
    });

    if (response?.slug) {
      toast.success("Content created successfully");

      contentStore.resetForm();
      router.push(`/dashboard/apis/${response.slug}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-full px-2">
      <div className="container">
        {tabActive === Tab.Information && (
          <ContentFormInformation handleNext={handleNext} />
        )}
        {tabActive === Tab.FieldDefinition && (
          <ContentFormFieldDefinition
            handlePrevious={handlePrevious}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
