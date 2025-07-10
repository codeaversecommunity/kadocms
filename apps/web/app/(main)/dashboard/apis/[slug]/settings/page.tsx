import ContentSettingApiSchema from "@/components/organisms/content/settings/content-setting-api-schema";
import ContentSettingBasicInformation from "@/components/organisms/content/settings/content-setting-basic-information";
import { getContent } from "@/modules/content/content.action";
import { Suspense } from "react";
// import ContentSettingBasicInformation from "~/components/organisms/content/settings/content-setting-basic-information";
// import ContentSettingApiSchema from "~/components/organisms/content/settings/content-setting-api-schema";

export default async function ContentSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const activeTab = tab || "basic-information";

  const content = await getContent(slug);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">API Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your API settings and schema.
        </p>
      </div>

      <Suspense fallback={<div>Loading settings...</div>}>
        {activeTab === "basic-information" && (
          <ContentSettingBasicInformation content={content} />
        )}

        {activeTab === "api-schema" && (
          <ContentSettingApiSchema content={content} />
        )}
      </Suspense>
    </div>
  );
}
