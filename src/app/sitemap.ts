import type { MetadataRoute } from 'next';
import path from 'path';
import { readFileSync } from 'fs';
import type { TipsIndexJson } from '@/types/tips';

export const dynamic = 'force-static';

const siteUrl = process.env.NEXT_PUBLIC_METADATA_BASE || 'https://rita-work.jp/';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ['/', '/jobs/', '/tips/', '/company/', '/terms/', '/privacy/'];
  const tipsIndexPath = path.join(
    process.cwd(),
    'public',
    'db',
    'tips',
    'tipsIndex.json'
  );
  const tipsIndex = JSON.parse(
    readFileSync(tipsIndexPath, 'utf8')
  ) as TipsIndexJson;
  const tipPaths = tipsIndex.items.map((item) => `/tips/${item.id}/`);

  return [...paths, ...tipPaths].map((pagePath) => ({
    url: new URL(pagePath, siteUrl).toString(),
    lastModified: now,
  }));
}
