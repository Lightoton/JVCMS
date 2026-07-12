'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { listMediaAction, deleteMediaAction } from '@/features/media/actions';
import { MediaUploader } from './MediaUploader';
import { useTranslation } from '@/shared/i18n/LanguageContext';

export function MediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await listMediaAction();
      setMediaFiles(data);
    } catch (err) {
      console.error("Failed to fetch media", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = (url: string) => {
    if (window.confirm(t.deleteFileConfirm)) {
      startTransition(async () => {
        const filename = url.split('/').pop() || '';
        const res = await deleteMediaAction(filename);
        if (res.error) {
           alert(res.error);
        } else {
           setMediaFiles(prev => prev.filter(f => f !== url));
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.mediaTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.mediaHint}</p>
        </div>
        <div>
          <MediaUploader />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-full pt-10">
            <span className="text-gray-500">{t.loading}</span>
          </div>
        ) : mediaFiles.length === 0 ? (
          <div className="flex justify-center items-center h-full pt-10">
            <span className="text-gray-500">{t.noMediaFiles}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaFiles.map((url, idx) => {
              const baseUrl = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:8080';
              const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
              return (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-50">
                  <Image 
                    src={fullUrl} 
                    alt={`Media ${idx}`} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform"
                    unoptimized 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDelete(url)}
                        disabled={isPending}
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                        title={t.deleteUser}
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="text-xs text-white truncate w-full" title={url}>
                      {url.split('/').pop()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
