'use server';

import { fetchApi } from '@/shared/api/fetcher';

export async function uploadMediaAction(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file || file.size === 0) {
    return { error: 'Файл не выбран' };
  }

  try {
    
    const response = await fetchApi<{ url: string }>('/media/upload', {
      method: 'POST',
      body: formData,
      requireAuth: true,
    });

    return { success: true, url: response.url };
  } catch (error: unknown) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Ошибка загрузки файла' };
  }
}

export async function listMediaAction() {
  try {
    return await fetchApi<string[]>('/media/list', { requireAuth: true });
  } catch (error) {
    return [];
  }
}

export async function deleteMediaAction(filename: string) {
  try {
    await fetchApi(`/media/delete?filename=${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      requireAuth: true,
    });
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Ошибка удаления файла' };
  }
}