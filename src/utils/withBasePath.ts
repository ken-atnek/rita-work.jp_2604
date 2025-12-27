/**
 * basePath（NEXT_PUBLIC_BASE_PATH）を付けたURLを生成する
 *
 * 例:
 * - withBasePath('/db/master/jobCategories.json')
 *   => `${basePath}/db/master/jobCategories.json`
 *
 * 注意:
 * - 引数は「/」始まり推奨
 */
export function withBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (!path) return basePath;

  // '/db/...' のように先頭'/'が付いてない時でも壊れないようにする
  const normalized = path.startsWith('/') ? path : `/${path}`;

  return `${basePath}${normalized}`;
}
