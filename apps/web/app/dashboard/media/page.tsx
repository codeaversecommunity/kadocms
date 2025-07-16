import { Heading } from "@/components/atoms/heading";
import { Separator } from "@/components/atoms/separator";
import { DataTableSkeleton } from "@/components/atoms/table/data-table-skeleton";
import AppContainer from "@/components/layouts/app-container/app-container";
import MediaDataTable from "@/components/organisms/media/media-data-table";
import { mediaColumns } from "@/components/organisms/media/media-data-table-column";
import MediaUploadButton from "@/components/organisms/media/media-upload-button";
import { searchParamsCache } from "@/lib/search-params";
import { getMedia } from "@/modules/media/media.action";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function MediaPage(props: pageProps) {
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

  const response = await getMedia({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
  });

  return (
    <AppContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Media"
            description="Manage your media files and assets"
          />
          <MediaUploadButton />
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={7} rowCount={8} filterCount={2} />
          }
        >
          <MediaDataTable
            data={response?.data}
            totalItems={response?.meta?.total || 0}
            columns={mediaColumns}
          />
        </Suspense>
      </div>
    </AppContainer>
  );
}
