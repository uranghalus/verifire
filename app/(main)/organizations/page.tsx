import { SearchParams } from "nuqs/server";
import OrganizationList from "./components/organization-list";
import { searchParamsCache } from "@/lib/searchparams";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";


type pageProps = {
  searchParams: Promise<SearchParams>;
};
export default async function OrganizationsPage(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Organizations</h1>
      <Suspense fallback={<DataTableSkeleton columnCount={4} rowCount={9} filterCount={2} />}>
        <OrganizationList />
      </Suspense>
    </div>
  );
}
