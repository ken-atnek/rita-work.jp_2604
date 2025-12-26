'use client';

import { useEffect, useMemo, useState } from 'react';

export const FAVORITE_JOB_IDS_KEY = 'rita:favorites:jobs';

type Options = {
  storageKey?: string;
};

export function useFavoriteJobIds(options: Options = {}) {
  const storageKey = options.storageKey ?? FAVORITE_JOB_IDS_KEY;

  // Setで保持（has/add/deleteが速い）
  const [favoriteJobIds, setFavoriteJobIds] = useState<Set<string>>(() => {
    try {
      const raw =
        typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      if (!raw) return new Set();

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();

      return new Set(parsed);
    } catch {
      return new Set();
    }
  });

  // 変更のたびに保存（SetはJSON化できないので配列へ）
  useEffect(() => {
    try {
      const ids = Array.from(favoriteJobIds);
      localStorage.setItem(storageKey, JSON.stringify(ids));
    } catch {
      // 容量制限/プライベート等は握りつぶしでOK
    }
  }, [favoriteJobIds, storageKey]);

  const toggleFavorite = (jobId: string) => {
    setFavoriteJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  const hasFavorite = (jobId: string) => favoriteJobIds.has(jobId);

  // 並び順を安定させたい用途向け（MyPageで使いやすい）
  const favoriteIdsArray = useMemo(
    () => Array.from(favoriteJobIds),
    [favoriteJobIds]
  );

  return {
    favoriteJobIds,
    favoriteIdsArray,
    hasFavorite,
    toggleFavorite,
    setFavoriteJobIds,
  };
}
