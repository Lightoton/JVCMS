'use client';

import { useTransition, useState, useRef } from 'react';
import { uploadMediaAction } from '@/features/media/actions';
import { useTranslation } from '@/shared/i18n/LanguageContext';

export function MediaUploader() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    setUploadedUrl(null);
    
    startTransition(async () => {
      const result = await uploadMediaAction(formData);
      
      if (result.error) {
        setMessage({ text: `❌ ${result.error}`, type: 'error' });
      } else if (result.url) {
        setMessage({ text: t.mediaUploaderConvertSuccess, type: 'success' });
        setUploadedUrl(result.url);
        formRef.current?.reset();
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t.mediaUploaderTitle}</h3>
      <p className="text-sm text-gray-500">{t.mediaUploaderHint}</p>
      
      <div>
        <input
          type="file"
          name="file"
          accept="image/*"
          className="border p-2 w-full rounded"
          disabled={isPending}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isPending}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {isPending ? t.mediaUploaderBtnUploading : t.mediaUploaderBtn}
      </button>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {uploadedUrl && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">{t.mediaUploaderUrlHint}</p>
          <div className="relative h-32 bg-gray-50 rounded-lg overflow-hidden border">
            <img 
              src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${uploadedUrl}`} 
              alt="Preview" 
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}
    </form>
  );
}