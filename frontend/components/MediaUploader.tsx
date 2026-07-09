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
          accept="image}
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