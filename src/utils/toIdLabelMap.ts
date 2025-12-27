// src/utils/toIdLabelMap.ts
/**
 * id → 表示ラベルの map を作るユーティリティ
 * - reduce / Object.fromEntries を毎回書かずに済ませる
 * - ラベルが取れない場合は id を入れる（画面が壊れない）
 */
export function toIdLabelMap<T extends { id: string }>(
  items: T[],
  pickLabel: (item: T) => string | undefined | null
): Record<string, string> {
  return items.reduce<Record<string, string>>((acc, item) => {
    acc[item.id] = pickLabel(item) ?? item.id;
    return acc;
  }, {});
}
