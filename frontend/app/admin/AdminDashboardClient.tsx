'use client';

import { useState, useEffect } from 'react';
import { CreateClientForm } from '@/components/CreateClientForm';
import { UniversalContentEditor } from '@/components/UniversalContentEditor';
import { MediaLibrary } from '@/components/MediaLibrary';
import { ContentManager } from '@/components/ContentManager';
import { UserList } from '@/components/UserList';
import { useTranslation } from '@/shared/i18n/LanguageContext';

type Tab = 'content' | 'media' | 'users' | 'developer';

export function AdminDashboardClient({ initialSchemas }: { initialSchemas: string[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const { t, lang, setLang } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 border-t border-gray-200">
      
      {/* Top Navbar for Header & Language Switcher */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-800">{t.cmsTitle}</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-bold transition-colors"
          >
            {lang === 'ru' ? '🇺🇸 EN' : '🇷🇺 RU'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col space-y-2 shrink-0">
          
          <button 
            onClick={() => setActiveTab('content')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'content' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            📝 {t.tabContent}
          </button>
          
          <button 
            onClick={() => setActiveTab('media')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'media' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            🖼️ {t.tabMedia}
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'users' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            👥 {t.tabUsers}
          </button>

          <div className="flex-1"></div>

          <button 
            onClick={() => setActiveTab('developer')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors text-xs ${activeTab === 'developer' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-200'}`}
          >
            ⚙️ Raw JSON Editor
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {activeTab === 'content' && <ContentManager />}
          {activeTab === 'media' && <MediaLibrary />}
          {activeTab === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <UserList />
              <CreateClientForm />
            </div>
          )}
          {activeTab === 'developer' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Схемы в базе (JSON)</h3>
                {initialSchemas.length === 0 ? (
                  <p className="text-sm text-gray-500">База данных пока пуста.</p>
                ) : (
                  <ul className="space-y-2">
                    {initialSchemas.map(schema => (
                      <li key={schema} className="bg-gray-50 p-2 rounded border text-sm font-mono text-gray-700">
                        {schema}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <UniversalContentEditor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
