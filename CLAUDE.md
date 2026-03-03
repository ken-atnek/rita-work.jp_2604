## プロジェクト概要

Next.js 15 App Router + TypeScript + SCSS による静的サイト生成プロジェクト

## 環境構築

### 初期セットアップ

```bash
npx create-next-app@latest . --typescript
# App Router: Yes を選択
```

### 開発依存パッケージ

```bash
npm install -D prettier sass stylelint stylelint-config-standard-scss stylelint-scss rimraf cross-env
```

### next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // 静的エクスポート必須
};

export default nextConfig;
```

---

## コーディング規約

### ファイル種別ごとの命名規則

| ファイル | 命名規則          | 例                                                   |
| -------- | ----------------- | ---------------------------------------------------- |
| `.scss`  | ケバブケース      | `.my-button`, `$primary-color`, `@mixin flex-center` |
| `.tsx`   | キャメル/パスカル | `MyComponent`, `useState`, `handleClick`             |

**理由**: SCSSとTSXで命名規則を混在させない（可読性・保守性向上）

---

## Next.js 15 App Router の制約

### ⚠️ 重要: params は Promise型を使わない

**Next.js 15では params が Promise になったが、静的エクスポート時は同期型で扱う**

#### ❌ 公式ドキュメント通り（動的レンダリング用）

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 静的エクスポートでエラー
}
```

#### ✅ 静的エクスポート用（このプロジェクトの正解）

```typescript
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // 同期的にアクセス
}
```

---

### generateMetadata / generateStaticParams

**静的エクスポート時は async 禁止**

#### ❌ NG

```typescript
export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Page' };
}

export async function generateStaticParams() {
  return [{ id: '1' }];
}
```

#### ✅ OK

```typescript
export function generateMetadata(): Metadata {
  return { title: 'Page' };
}

export function generateStaticParams() {
  return [{ id: '1' }];
}
```

**理由**: `output: 'export'` 時は全て事前生成されるため、非同期処理は不要

---

## データ取得パターン

`output: 'export'` のため、ランタイムのサーバーサイド処理は不可。
管理画面が `public/db/` 配下の JSON を書き換えるため、全データ取得はクライアントサイドで行う。

### `force-dynamic` は使用禁止

```typescript
// ❌ NG: output: 'export' と競合してビルドエラーになる
export const dynamic = 'force-dynamic';
```

### 2種類のfetchパターン

| 用途 | 関数 | エラー表示 | キャッシュ制御 |
| ---- | ---- | ---------- | -------------- |
| マスター・設定JSON（空でも支障なし） | `fetchJson()` | なし（fallback値で継続） | なし（デフォルト） |
| コンテンツJSON（管理画面連動・エラー表示が必要） | 生 `fetch()` | あり（`isError` state） | `cache: 'no-store'` + `?t=${ts}` |

#### ✅ マスター・設定JSON: `fetchJson` を使う

```typescript
import { fetchJson } from '@/utils/fetchJson';
import { withBasePath } from '@/utils/withBasePath';

const [items, setItems] = useState<Item[]>([]);

useEffect(() => {
  fetchJson<Item[]>(withBasePath('/db/master/items.json'), []).then(setItems);
}, []);
```

#### ✅ コンテンツJSON（管理画面連動）: 生 `fetch` + `isError` を使う

```typescript
const [data, setData] = useState<DataType>({ items: [] });
const [isError, setIsError] = useState(false);

useEffect(() => {
  const path = withBasePath('/db/content/data.json');
  const ts = Date.now();

  fetch(`${path}?t=${ts}`, { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('fetch failed');
      return res.json();
    })
    .then((json) => setData(json as DataType))
    .catch(() => setIsError(true));
}, []);

// JSX内でエラー表示
{isError ? <p>データの読み込みに失敗しました。</p> : null}
```

**理由**: `cache: 'no-store'` でブラウザキャッシュを確実に無効化し、管理画面の更新が即時反映される。

### 共有マスター型

マスターJSONの型定義は `src/types/master.ts` に一元管理。各ファイルでローカル定義しない。

```typescript
import type { SalaryUnitMaster, EmploymentTypeMaster, FacilityTypeMaster } from '@/types/master';
```

---

## チェックリスト

作業開始前に確認:

- [ ] `next.config.ts` に `output: 'export'` がある
- [ ] page.tsx の params に `Promise` 型を使っていない
- [ ] `generateMetadata` / `generateStaticParams` が同期関数
- [ ] `force-dynamic` を使っていない
- [ ] マスターJSONの型は `src/types/master.ts` からインポートしている
- [ ] コンテンツJSON取得は生 `fetch` + `cache: 'no-store'` + `isError` パターン
