'use server';

import { fetchApi } from '@/shared/api/fetcher';
import { revalidatePath } from 'next/cache';

export async function createClientAction(formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) return { error: 'Заполните все поля' };

  try {
    
    await fetchApi('/auth/create-client', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      requireAuth: true,
    });
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Ошибка создания клиента' };
  }
}