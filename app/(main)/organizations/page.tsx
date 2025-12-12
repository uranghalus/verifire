import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./components/organization-columns";
import { AddDialog } from "./components/add-dialog";
import { EditDialog } from "./components/edit-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { listOrganizations } from "./data/actions";
import { DialogProvider } from "@/context/dialog-provider";


export default async function OrganizationsPage() {
  const { data } = await listOrganizations();

  return (
    <DialogProvider>
      <h1 className="text-xl font-bold">Organizations</h1>

      <DataTable
        columns={columns}
        data={data ?? []}
      />

      {/* Dialogs */}
      <AddDialog />
      <EditDialog />
      <DeleteDialog />
    </DialogProvider>
  );
}
