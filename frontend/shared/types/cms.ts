export type CmsFieldType = 'text' | 'number' | 'image' | 'array';

export interface CmsField {
  type: CmsFieldType;
  label?: string;
  items?: CmsField;
}

export interface CmsModel {
  name: string;
  fields: Record<string, CmsField>;
}

export interface CmsConfig {
  models: Record<string, CmsModel>;
}

export interface ContentItem {
  id: string;
  schemaIdentifier: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  createdAt: string;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
}
