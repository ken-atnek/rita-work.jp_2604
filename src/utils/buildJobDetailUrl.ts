/**
 * 求人詳細ページのURLを生成するユーティリティ
 *
 * - basePath（NEXT_PUBLIC_BASE_PATH）を考慮してURLを組み立てる
 * - details ページは query（?id=xxx）形式で運用
 *
 * 使用箇所：
 * - マイページ（お気に入り / 閲覧履歴）
 * - 求人一覧 / 検索結果
 * - 事業所内求人一覧
 */
export function buildJobDetailUrl(jobId: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return `${basePath}/details?id=${encodeURIComponent(jobId)}`;
}
