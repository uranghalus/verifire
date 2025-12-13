import { OrganizationTable } from "./components/organization-table";


export default async function OrganizationsPage() {


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Organizations</h1>
      <OrganizationTable />
    </div>
  );
}
