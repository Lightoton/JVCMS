'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/i18n/LanguageContext';

export interface EditCredentialsModalProps {
  isOpen: boolean;
  targetEmail: string;
  role: string;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (newEmail: string, newPassword: string) => void;
}

export function EditCredentialsModal({
  isOpen,
  targetEmail,
  role,
  isLoading = false,
  onClose,
  onSave,
}: EditCredentialsModalProps) {
  const { t } = useTranslation();
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setNewEmail('');
    setNewPassword('');
    setError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = newEmail.trim();
    const trimmedPassword = newPassword.trim();

    if (!trimmedEmail && !trimmedPassword) {
      onClose();
      return;
    }

    if (trimmedPassword && trimmedPassword.length > 0 && trimmedPassword.length < 5) {
      setError(t.passwordTooShort);
      return;
    }

    onSave(trimmedEmail, trimmedPassword);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {t.changeCredentials}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Пользователь: <span className="font-mono font-medium text-gray-800">{targetEmail}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              {t.emailHeader}
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Оставьте пустым, чтобы не менять"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              {t.passwordLabel}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Оставьте пустым, чтобы не менять"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          {role === 'ADMIN' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
              ⚠️ Если вы измените логин для учетной записи администратора, потребуется повторный вход.
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              {t.cancel || 'Отмена'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? '...' : t.saveBtn || 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
