import ContentDataTable from "@/components/organisms/content/data-table/content-data-table";
import { getContent } from "@/modules/content/content.action";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent(slug);

  return (
    <>
      <ContentDataTable content={content} />
    </>
  );
}
