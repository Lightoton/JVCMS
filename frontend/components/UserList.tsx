'use client';

import { useState, useEffect, useTransition } from 'react';
import { getUsersAction, deleteUserAction, updateUserAction, logoutAction } from '@/features/auth/actions';
import { ConfirmDialog } from './ConfirmDialog';
import { EditCredentialsModal } from './EditCredentialsModal';
import { useTranslation } from '@/shared/i18n/LanguageContext';

interface User {
  email: string;
  role: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<{ email: string; role: string } | null>(null);
  const { t } = useTranslation();

  const fetchUsers = async () => {
    try {
      const data = await getUsersAction();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchUsers();
  }, []);

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    startTransition(async () => {
      const res = await deleteUserAction(userToDelete);
      if (res.error) {
        alert(res.error);
      } else {
        setUsers(prev => prev.filter(u => u.email !== userToDelete));
      }
      setUserToDelete(null);
    });
  };

  const handleSaveCredentials = (newEmail: string, newPassword: string) => {
    if (!editingUser) return;
    const { email, role } = editingUser;
    startTransition(async () => {
      const res = await updateUserAction(email, newEmail, newPassword);
      if (res.error) {
        alert(res.error);
      } else {
        alert(t.credentialsChanged);
        setEditingUser(null);
        if (newEmail && newEmail !== email && role === 'ADMIN') {
          alert(t.reloginRequired);
          await logoutAction();
        } else {
          fetchUsers();
        }
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">{t.usersTitle}</h3>
      
      {loading ? (
        <div className="py-4 text-gray-500">{t.loading}</div>
      ) : users.length === 0 ? (
        <div className="py-4 text-gray-500">{t.noUsers}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-3 border-b">{t.emailHeader}</th>
                <th className="p-3 border-b">{t.roleHeader}</th>
                <th className="p-3 border-b text-right">{t.actionsHeader}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                      u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 flex justify-end gap-2">
                    <>
                      <button 
                        onClick={() => setEditingUser({ email: u.email, role: u.role })} 
                        disabled={isPending}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors"
                      >
                        {t.changeCredentials}
                      </button>
                      {u.role !== 'ADMIN' && (
                        <button 
                          onClick={() => setUserToDelete(u.email)} 
                          disabled={isPending}
                          className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors"
                        >
                          {t.deleteUser}
                        </button>
                      )}
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!userToDelete}
        title={t.deleteConfirmTitle}
        message={`${t.deleteUserConfirm} ${userToDelete}?`}
        confirmLabel={t.deleteConfirmBtn}
        cancelLabel={t.cancel}
        isDestructive={true}
        isLoading={isPending}
        onConfirm={confirmDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />

      <EditCredentialsModal
        isOpen={!!editingUser}
        targetEmail={editingUser?.email || ''}
        role={editingUser?.role || ''}
        isLoading={isPending}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveCredentials}
      />
    </div>
  );
}
