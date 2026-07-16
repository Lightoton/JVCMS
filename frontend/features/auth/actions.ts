'use server';

import { cookies } from 'next/headers';
import { fetchApi } from '@/shared/api/fetcher';
import { redirect } from 'next/navigation';

interface AuthResponse {
  token: string;
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Заполните все поля' };
  }

  try {
    
    const isInitialized = await fetchApi<boolean>('/auth/init-check', { requireAuth: false });

    let token: string;

    if (!isInitialized) {
      
      const data = await fetchApi<AuthResponse>('/auth/init', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        requireAuth: false,
      });
      token = data.token;
    } else {
      
      const data = await fetchApi<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        requireAuth: false, 
      });
      token = data.token;
    }

    
    const cookieStore = await cookies();
    cookieStore.set('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Неизвестная ошибка авторизации' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('jwt_token');
  redirect('/'); 
}

export async function getUsersAction() {
  try {
    return await fetchApi<any[]>('/auth/users', { requireAuth: true });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function checkInitAction() {
  try {
    return await fetchApi<boolean>('/auth/init-check', { requireAuth: false });
  } catch (error) {
    console.error(error);
    return true; 
  }
}

export async function deleteUserAction(email: string) {
  try {
    await fetchApi(`/auth/users/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      requireAuth: true,
    });
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Ошибка удаления пользователя' };
  }
}

export async function updateUserAction(oldEmail: string, newEmail?: string, newPassword?: string) {
  try {
    await fetchApi(`/auth/users/${encodeURIComponent(oldEmail)}`, {
      method: 'PUT',
      body: JSON.stringify({ newEmail, newPassword }),
      requireAuth: true,
    });
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Ошибка обновления данных пользователя' };
  }
}