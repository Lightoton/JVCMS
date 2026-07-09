import { getAllSchemas } from '@/features/content/actions';
import { AdminDashboardClient } from './AdminDashboardClient';

export default async function AdminPage() {
  const existingSchemas = await getAllSchemas();

  return (
    <div className="-m-8">
      <AdminDashboardClient initialSchemas={existingSchemas} />
    </div>
  );
}