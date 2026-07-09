'use client';

import { useTransition, useState } from 'react';
import { saveContentAction } from '@/features/content/actions';

export function UniversalContentEditor() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    const schemaIdentifier = formData.get('schemaIdentifier')?.toString();
    const rawJson = formData.get('jsonData')?.toString();

    if (!schemaIdentifier || !rawJson) return;

    try {
      
      const parsedData = JSON.parse(rawJson);
      
      startTransition(async () => {
        const result = await saveContentAction(schemaIdentifier, parsedData);
        if (result.error) setMessage({ text: `❌ ${result.error}`, type: 'error' });
        else setMessage({ text: '✅ Контент успешно сохранен!', type: 'success' });
      });
    } catch (e) {
      setMessage({ text: '❌ Ошибка: Невалидный JSON формат!', type: 'error' });
    }
  };

  return (
    <form action={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Создать / Обновить контент</h3>
      <p className="text-sm text-gray-500">Укажите уникальный ключ секции (например, <b>hero_section</b>) и передайте данные в формате JSON.</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Идентификатор (Schema Key)</label>
        <input
          name="schemaIdentifier"
          type="text"
          required
          placeholder="например: about_page"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Данные (JSON)</label>
        <textarea
          name="jsonData"
          rows={8}
          required
          placeholder={`{\n  "title": "Заголовок",\n  "text": "Любой текст"\n}`}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:ring-blue-500 outline-none resize-y"
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
        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-green-400"
      >
        {isPending ? 'Сохранение...' : 'Сохранить в базу'}
      </button>
    </form>
  );
}