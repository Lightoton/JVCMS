import { useState, useEffect, useTransition } from 'react';
import { saveContentAction, getContent } from '@/features/content/actions';
import { uploadMediaAction } from '@/features/media/actions';
import Image from 'next/image';
import config from '../cms.config.json';
import { useTranslation } from '@/shared/i18n/LanguageContext';

export function ContentManager() {
  const models = config.models;
  const [activeSchema, setActiveSchema] = useState<string>(models[0]?.id || '');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { t, lang } = useTranslation();

  const fetchData = async (schema: string) => {
    if (!schema) return;
    setLoading(true);
    try {
      const result = await getContent(schema);
      if (result) {
        setData(result);
      } else {
        
        const activeModel = models.find(m => m.id === schema);
        const initData: any = {};
        activeModel?.fields.forEach(f => {
          if (f.type === 'array') initData[f.name] = [];
          else initData[f.name] = '';
        });
        setData(initData);
      }
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeSchema);
  }, [activeSchema]);

  const handleSave = async (newData: any) => {
    startTransition(async () => {
      const res = await saveContentAction(activeSchema, newData);
      if (res.error) {
        alert(t.saveError + " " + res.error);
      } else {
        setData(newData);
        alert(t.saveSuccess);
      }
    });
  };

  const handleImageUpload = async (file: File, fieldName: string, arrayIndex?: number, arrayName?: string) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    const result = await uploadMediaAction(formData);
    if (result.url) {
      if (arrayName && arrayIndex !== undefined) {
        const newArray = [...(data[arrayName] || [])];
        newArray[arrayIndex] = { ...newArray[arrayIndex], [fieldName]: result.url };
        setData({ ...data, [arrayName]: newArray });
      } else {
        setData({ ...data, [fieldName]: result.url });
      }
    } else {
       alert(result.error || t.uploadError);
    }
  };

  const renderField = (field: any, value: any, onChange: (val: any) => void) => {
    if (field.type === 'text' || field.type === 'number') {
      return (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700">{field[`label_${lang}`] || field.label}</label>
          <input 
            type={field.type} 
            value={value || ''} 
            onChange={e => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)} 
            className="mt-1 w-full border rounded-md p-2" 
          />
        </div>
      );
    }
    if (field.type === 'image') {
       const baseUrl = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:8080';
       const imageUrl = value?.startsWith('http') ? value : (value ? `${baseUrl}${value}` : null);
       return (
         <div key={field.name} className="space-y-2 shrink-0">
           <label className="block text-sm font-medium text-gray-700">{field[`label_${lang}`] || field.label}</label>
           <div className="flex gap-4 items-center">
             <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100 border">
               {imageUrl ? (
                 <Image src={imageUrl} alt="img" fill className="object-cover" unoptimized />
               ) : (
                 <div className="flex items-center justify-center h-full text-xs text-gray-400">{t.noPhoto}</div>
               )}
             </div>
             <div className="flex-1">
               <input 
                 type="text" 
                 value={value || ''} 
                 onChange={e => onChange(e.target.value)} 
                 className="w-full border rounded p-2 text-sm mb-2" 
                 placeholder={t.orInsertUrl}
               />
               <label className="inline-block text-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-3 py-2 rounded">
                  {t.uploadFile}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload(e.target.files[0], field.name);
                  }} />
                </label>
              </div>
            </div>
          </div>
        );
    }
    return null;
  };

  const renderArrayField = (field: any) => {
    const items = data[field.name] || [];
    
    const handleAdd = () => {
      const newItem: any = { id: crypto.randomUUID() };
      field.itemFields?.forEach((f: any) => {
        newItem[f.name] = f.type === 'array' ? [] : '';
      });
      setData({ ...data, [field.name]: [...items, newItem] });
    };

    const handleDelete = (id: string) => {
      if (items.length <= 1) {
        alert(t.cannotDeleteLast);
        return;
      }
      if (confirm(t.deleteConfirm)) {
        setData({ ...data, [field.name]: items.filter((item: any) => item.id !== id) });
      }
    };

    return (
      <div key={field.name} className="border rounded-xl p-4 bg-gray-50/50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-gray-800">{field[`label_${lang}`] || field.label}</h4>
          <button onClick={handleAdd} className="text-sm bg-white border px-3 py-1.5 rounded shadow-sm hover:bg-gray-50">
            {t.addBtn}
          </button>
        </div>
        
        <div className="space-y-4">
          {items.map((item: any, index: number) => (
            <div key={item.id || index} className="flex gap-4 p-4 bg-white border rounded-lg relative group">
               {field.itemFields?.find((f: any) => f.type === 'image') && (
                 <div className="space-y-2 shrink-0 w-24">
                   {field.itemFields?.filter((f: any) => f.type === 'image').map((imgField: any) => {
                      const val = item[imgField.name];
                      const baseUrl = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:8080';
                      const imageUrl = val?.startsWith('http') ? val : (val ? `${baseUrl}${val}` : null);
                      return (
                        <div key={imgField.name} className="flex flex-col items-center">
                          <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100 border mb-1">
                             {imageUrl ? <Image src={imageUrl} alt="img" fill className="object-cover" unoptimized /> : <span className="text-xs text-gray-400 text-center block mt-8">{t.noPhoto}</span>}
                          </div>
                          <label className="block w-full text-center text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer p-1 rounded">
                            {t.uploadFile}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                              if (e.target.files?.[0]) handleImageUpload(e.target.files[0], imgField.name, index, field.name);
                            }} />
                          </label>
                        </div>
                      )
                   })}
                 </div>
               )}

               <div className="flex-1 grid grid-cols-2 gap-4">
                 {field.itemFields?.filter((f: any) => f.type !== 'image').map((subField: any) => (
                   <div key={subField.name} className={subField.name === 'description' ? 'col-span-2' : ''}>
                     <label className="text-xs text-gray-500">{subField[`label_${lang}`] || subField.label}</label>
                     <input 
                       type={subField.type === 'number' ? 'number' : 'text'} 
                       value={item[subField.name] || ''} 
                       onChange={e => {
                         const newArr = [...items];
                         newArr[index][subField.name] = subField.type === 'number' ? Number(e.target.value) : e.target.value;
                         setData({ ...data, [field.name]: newArr });
                       }} 
                       className="w-full border rounded p-1 text-sm" 
                     />
                   </div>
                 ))}
               </div>
               
               <button onClick={() => handleDelete(item.id)} className="shrink-0 p-2 text-red-500 hover:bg-red-50 rounded">
                 🗑️
               </button>
             </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActiveModel = () => {
    const activeModel = models.find(m => m.id === activeSchema);
    if (!activeModel || !data) return null;

    return (
      <div className="space-y-6">
        {activeModel.fields.map((field: any) => {
          if (field.type === 'array') {
            return renderArrayField(field);
          } else {
            return renderField(field, data[field.name], (val) => setData({ ...data, [field.name]: val }));
          }
        })}
        <button onClick={() => handleSave(data)} disabled={isPending} className="w-full bg-orange-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
          {t.saveBtn} ({(activeModel as any)[`label_${lang}`] || (activeModel as any).label_ru})
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[600px]">
      <div className="flex justify-between items-center mb-6 overflow-x-auto pb-2">
        <h2 className="text-2xl font-bold text-gray-900 shrink-0 mr-4">{t.contentTitle}</h2>
        <div className="flex gap-2 shrink-0">
          {models.map(m => (
            <button 
              key={m.id}
              onClick={() => setActiveSchema(m.id)} 
              className={`px-4 py-2 text-sm rounded-lg border whitespace-nowrap transition-colors ${activeSchema === m.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white hover:bg-gray-50'}`}
            >
              {(m as any)[`label_${lang}`] || (m as any).label_ru}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">{t.loading}</div>
      ) : (
        <div className="mt-8">
          {renderActiveModel()}
        </div>
      )}
    </div>
  );
}
