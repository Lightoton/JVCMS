import { logoutAction } from '@/features/auth/actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">JVCMS Панель</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
            Выйти
          </button>
        </form>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}