'use client';

import { useTransition, useState } from 'react';
import { saveContentAction } from '@/features/content/actions';

interface ContentEditorProps {
  initialData: {
    title?: string;
    description?: string;
  } | null;
}

export function ContentEditor({ initialData }: ContentEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    
    
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
    };

    startTransition(async () => {
      
      const result = await saveContentAction('pizza_home', data);
      
      if (result.error) {
        setMessage({ text: `❌ ${result.error}`, type: 'error' });
      } else {
        setMessage({ text: '✅ Контент успешно обновлен!', type: 'success' });
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Редактор главной страницы</h3>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Главный заголовок
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={initialData?.title || ''}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Например: Самая вкусная пицца в городе"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Описание
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialData?.description || ''}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
          placeholder="Расскажите о ваших преимуществах..."
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
        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-blue-400 transition-all"
      >
        {isPending ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
    </form>
  );
}