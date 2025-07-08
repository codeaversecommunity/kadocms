// import ContentDataTable from "~/components/organisms/content/content-data-table";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  //   return <ContentDataTable objectTypeId={slug} />;

  return (
    <>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus tempora
      molestiae tenetur laborum? Quia, laboriosam enim? Ducimus, cumque minus
      iure sunt sequi culpa, eum ipsum aut cum quam alias sint.
    </>
  );
}
