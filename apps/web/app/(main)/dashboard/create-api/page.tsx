"use client";

import ContentFormFieldDefinition from "@/components/organims/content/content-form-field-definition";
import ContentFormInformation from "@/components/organims/content/content-form-information";
import { useRouter, useSearchParams } from "next/navigation";
import { useContentStore } from "@/modules/content/content.store";

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
    const success = await contentStore.create();
    if (success) router.push("/dashboard");
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
