'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export const JOB_HISTORY_IDS_KEY = 'rita:history:jobs';

type Options = {
  storageKey?: string;
  max?: number;
};

export function useJobHistoryIds(options: Options = {}) {
  const storageKey = options.storageKey ?? JOB_HISTORY_IDS_KEY;
  const max = options.max ?? 50;

  const [historyIds, setHistoryIds] = useState<string[]>(() => {
    try {
      const raw =
        typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((v) => typeof v === 'string')
        : [];
    } catch {
      return [];
    }
  });

  // 変更のたびに保存
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(historyIds));
    } catch {
      // 容量制限/プライベート等は握りつぶしでOK
    }
  }, [historyIds, storageKey]);

  // 履歴に追加（最新を先頭・重複排除・最大件数）
  const addHistory = useCallback(
    (jobId: string) => {
      setHistoryIds((prev) => {
        const next = [jobId, ...prev.filter((id) => id !== jobId)];
        return next.slice(0, max);
      });
    },
    [max]
  );

  const removeHistory = useCallback((jobId: string) => {
    setHistoryIds((prev) => prev.filter((id) => id !== jobId));
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryIds([]);
  }, []);

  const historyIdSet = useMemo(() => new Set(historyIds), [historyIds]);

  return {
    historyIds, // 並び順が大事なので配列を正として返す
    historyIdSet, // 参照用（has）
    addHistory,
    removeHistory,
    clearHistory,
  };
}
