import { SearchParams } from "nuqs/server";
import OrganizationList from "./components/organization-list";
import { searchParamsCache } from "@/lib/searchparams";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { Main } from "@/components/main";
import OrganizationDialog from "./components/organization-dialog";
import { Metadata } from "next";
import OrganizationPrimaryButton from "./components/organization-primary-button";


type pageProps = {
  searchParams: Promise<SearchParams>;
};
export const metadata: Metadata = {
  title: "Unit Bisnis", // Akan menjadi: verifire - Dashboard
};

export default async function OrganizationsPage(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <Main fluid className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Unit Bisnis</h2>
          <p className="text-muted-foreground">Manajemen unit bisnis</p>
        </div>
        <OrganizationPrimaryButton />
      </div>

      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={4}
            rowCount={9}
            filterCount={2}
          />
        }
      >
        <OrganizationList />
      </Suspense>

      <OrganizationDialog />
    </Main>
  );
}
