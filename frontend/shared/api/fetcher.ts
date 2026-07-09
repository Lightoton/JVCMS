import { cookies } from 'next/headers';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}


const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    
    return process.env.INTERNAL_API_URL || 'http://backend:8080/api/v1';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
};

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth = true, ...customOptions } = options;
  const headers = new Headers(customOptions.headers);
  
  
  if (!(customOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  
  if (requireAuth) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt_token')?.value;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      throw new Error('Не авторизован');
    }
  }

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...customOptions,
    headers,
  });

  if (!res.ok) {
    
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Ошибка сервера: ${res.status}`);
  }

  
  if (res.status === 204) return null as T;

  return res.json();
}