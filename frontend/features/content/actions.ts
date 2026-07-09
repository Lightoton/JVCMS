'use server';

import { fetchApi } from '@/shared/api/fetcher';
import { revalidatePath } from 'next/cache';


export async function getContent(schemaIdentifier: string) {
  try {
    return await fetchApi<Record<string, unknown>>(`/content/${schemaIdentifier}`, { requireAuth: false });
  } catch (error) {
    return null; 
  }
}


export async function saveContentAction(schemaIdentifier: string, data: Record<string, unknown>) {
  try {
    await fetchApi(`/content/${schemaIdentifier}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth: true, 
    });
    
    
    revalidatePath('/');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Ошибка сохранения контента' };
  }
}

export async function getAllSchemas() {
  try {
    return await fetchApi<string[]>('/content', { requireAuth: false });
  } catch (error) {
    return [];
  }
}