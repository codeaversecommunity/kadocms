import { Suspense } from "react";
// import ContentEntryForm from "~/components/organisms/content/content-entry-form";

export default async function CreateEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Entry</h1>
        <p className="text-muted-foreground">
          Add a new entry to your content collection.
        </p>
      </div>

      <Suspense fallback={<div>Loading form...</div>}>
        {/* <ContentEntryForm objectTypeId={slug} /> */}
      </Suspense>
    </div>
  );
}
