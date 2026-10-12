import { getAllSchemas, getSchemaConfig } from '@/features/content/actions';
import { AdminDashboardClient } from './AdminDashboardClient';

export default async function AdminPage() {
  const existingSchemas = await getAllSchemas();
  const schemaConfig = await getSchemaConfig();

  return (
    <div className="-m-8">
      <AdminDashboardClient initialSchemas={existingSchemas} schemaConfig={schemaConfig} />
    </div>
  );
}