import ContentEntryForm from "@/components/organisms/content/content-entry-form";
import { getContent } from "@/modules/content/content.action";
import { Suspense } from "react";
// import ContentEntryForm from "~/components/organisms/content/content-entry-form";

export default async function CreateEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent(slug);

  return (
    <div>
      <Suspense fallback={<div>Loading form...</div>}>
        <ContentEntryForm content={content} />
      </Suspense>
    </div>
  );
}
