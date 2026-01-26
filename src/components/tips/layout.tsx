import type { Metadata } from 'next';
import { isRealProduction } from '@/lib/env';
import type { ReactNode } from 'react';

export const generateMetadata = (): Metadata => {
  return {
    title: '転職のヒント｜リタワーク',
    description: isRealProduction
      ? '転職活動に役立つヒントやポイントを、分かりやすくまとめました。'
      : undefined,
  };
};

export default function TipsLayout({ children }: { children: ReactNode }) {
  return children;
}
