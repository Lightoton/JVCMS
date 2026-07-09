'use client';

import { useTransition, useState } from 'react';
import { createClientAction } from '@/features/users/actions';
import { useTranslation } from '@/shared/i18n/LanguageContext';

export function CreateClientForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { t } = useTranslation();

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const result = await createClientAction(formData);
      if (result.error) {
        setMessage({ text: `❌ ${result.error}`, type: 'error' });
      } else {
        setMessage({ text: `✅ ${t.createClientSuccess}`, type: 'success' });
      }
    });
  };

  return (
    <form action={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t.createClientTitle}</h3>
      <p className="text-sm text-gray-500">{t.createClientHint}</p>
      
      <div className="space-y-3">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 outline-none"
        />
        <input
          name="password"
          type="text" 
          required
          placeholder="Password"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isPending ? t.createClientBtnCreating : t.createClientBtn}
      </button>
    </form>
  );
}