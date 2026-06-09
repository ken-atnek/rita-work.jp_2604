# ROOTS詳細ページ SEO実装仕様（`?id=` クエリ運用）

## 目的
`/roots/?id=roots_xxx` 形式の詳細ページで、最低限のSEO要件（title / description / canonical / sitemap掲載）を満たす。

## 前提
- Next.js App Router
- `output: 'export'` の静的書き出し運用
- 詳細データは `public/db/roots/details/{id}/` の JSON で管理
- 詳細ページは `src/app/roots/page.tsx`（クエリで表示切替）

## 対象URL
- 商品ページ: `/roots/?id=roots_001`
- ストーリーページ: `/roots/?id=roots_001&page=story`

---

## 1. `common.json` に SEO項目を持たせる

### 対象ファイル
- `public/db/roots/details/{id}/common.json`

### 追加キー
```json
"seo": {
  "productTitle": "商品ページ用タイトル",
  "productDescription": "商品ページ用ディスクリプション",
  "storyTitle": "ストーリーページ用タイトル",
  "storyDescription": "ストーリーページ用ディスクリプション"
}
```

### ルール
- `title` / `description` はページごとに固有化する
- canonical は原則「自己参照 canonical」
- URLパラメータ付き canonical は `&` を含んでよい（HTML出力時に適切に扱われる）

---

## 2. 型定義に `seo` を追加する

### 対象ファイル
- `src/lib/roots/fetchRootsData.ts`

### `CommonData` に追加する型
```ts
id?: string;
seo?: {
  productTitle?: string;
  productDescription?: string;
  storyTitle?: string;
  storyDescription?: string;
};
```

---

## 3. 詳細ページでメタを反映する

### 対象ファイル
- `src/app/roots/page.tsx`

### 実装方針
- `commonData` 読み込み後に `useEffect` で反映
- 反映対象:
  - `document.title`
  - `<meta name="description">`
  - `<link rel="canonical">`
- canonical は `commonData.id` を参照して自動生成する
  - 商品: `https://{origin}/roots/?id=roots_{id}`
  - ストーリー: `https://{origin}/roots/?id=roots_{id}&page=story`
  - `id` が `roots_` なし（例: `001`）でも内部で `roots_001` に正規化する

---

## 4. sitemap に詳細URLを追加する

### 対象ファイル
- `public/sitemap.xml`

### 追加方針
- `/roots/` だけでなく、公開対象の詳細URLを列挙する
- 例:
  - `https://xxx/roots/?id=roots_001`
  - `https://xxx/roots/?id=roots_001&page=story`
- XML内では `&` を `&amp;` で記述する

---

## 5. robots で sitemap を案内する

### 対象ファイル
- `public/robots.txt`

### 設定例
```txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

---

## 6. 検証時の注意点（重要）
この実装はクライアント側でメタを書き換えるため、表示差が出る。

- 「ページのソースを表示」:
  - 初期HTML（書き換え前）が見える
- 「検証ツール（Elements）」:
  - JS実行後（書き換え後）が見える

つまり、ソース表示に反映されなくても、検証ツール側で反映されていれば実装どおり。

---

## 7. 本番公開後の運用手順
1. 本番反映（JSON・sitemap 更新含む）
2. `sitemap.xml` 公開確認
3. Search Console で sitemap 再送信
4. 対象URLごとに「インデックス登録をリクエスト」

---

## 8. 制約と今後
- `?id=` 運用でもインデックスは可能だが、SEOでは不利になりやすい
- 長期的には `/roots/[id]/` のようなパス型URLへ移行すると有利
- まずは本仕様で最小コスト運用し、結果を見て段階移行する
