import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { Separator } from "@/components/atoms/separator";
import { DataTableSkeleton } from "@/components/atoms/table/data-table-skeleton";
import AppContainer from "@/components/layouts/app-container/app-container";
import ContentDataTable from "@/components/organisms/content/data-table/content-data-table";
import { getContentColumns } from "@/components/organisms/content/data-table/content-data-table-column";
import { searchParamsCache } from "@/lib/search-params";
import {
  getContent,
  getContentEntries,
} from "@/modules/content/content.action";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export default async function ContentPage(props: PageProps) {
  const { slug } = await props.params;

  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const pageLimit = searchParamsCache.get("perPage");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
  };

  const content = await getContent(slug);
  const response = await getContentEntries({
    content_id: content.id,
    page: filters.page,
    limit: filters.limit,
  });

  return (
    <AppContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-end">
          <Link href={`/dashboard/apis/${content.slug}/form`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </Link>
        </div>
        {/* <Separator /> */}
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={7} rowCount={8} filterCount={2} />
          }
        >
          <ContentDataTable
            data={response?.data}
            totalItems={response?.meta?.total || 0}
            content={content}
          />
        </Suspense>
      </div>
    </AppContainer>
  );
}
