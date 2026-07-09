'use client';

import { useTransition, useState, useEffect } from 'react';
import { loginAction, checkInitAction } from '@/features/auth/actions';
import { useTranslation } from '@/shared/i18n/LanguageContext';

export function LoginView() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const { t, lang, setLang } = useTranslation();

  useEffect(() => {
    checkInitAction().then(res => setIsInitialized(res));
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(formData);
      
      if (result?.error) {
        setError(result.error);
      } else {
        window.location.href = '/admin';
      }
    });
  };

  if (isInitialized === null) {
    return <div className="flex min-h-screen items-center justify-center">{t.loading}</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 relative">
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
          className="px-3 py-1 bg-white shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-800 rounded-md text-sm font-bold transition-colors"
        >
          {lang === 'ru' ? '🇺🇸 EN' : '🇷🇺 RU'}
        </button>
      </div>
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isInitialized ? t.loginTitle : t.registerTitle}
          </h2>
          {!isInitialized && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {t.registerHint}
            </p>
          )}
        </div>
        
        <form action={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">{t.emailLabel}</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder={t.emailLabel}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t.passwordLabel}</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder={t.passwordLabel}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
              {isPending ? t.loading : (isInitialized ? t.loginBtn : t.registerBtn)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}