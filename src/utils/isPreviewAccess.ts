// src/utils/isPreviewAccess.ts
import { PREVIEW_QUERY_KEY, PREVIEW_QUERY_VALUE } from '@/config/preview';

export function isPreviewAccess(searchParams: URLSearchParams | null): boolean {
  if (!searchParams) return false;
  return searchParams.get(PREVIEW_QUERY_KEY) === PREVIEW_QUERY_VALUE;
}
