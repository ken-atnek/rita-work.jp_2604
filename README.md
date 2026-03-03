# リタワーク（2604）

熊本の医療・介護・福祉向け求人サイトのフロントエンドです。  
Next.js App Router で構成し、静的エクスポート（`output: 'export'`）で配信します。

## 技術スタック

- Next.js 15.5（App Router）
- React 19 / TypeScript（strict）
- SCSS Modules
- `@splidejs/react-splide`（スライダー）

## 開発コマンド

```bash
# 開発サーバー
npm run dev

# ESLint
npm run lint

# Stylelint（自動修正あり）
npm run lint:style

# デモ用ビルド（検証環境向け）
npm run build:demo

# 本番用ビルド
npm run build:prod
```

## 環境変数

ビルド時に以下を使用します。

- `NEXT_PUBLIC_IS_REAL_PROD`
  - `true`: 本番向け metadata / robots を有効
  - `false`: 非本番設定
- `NEXT_PUBLIC_METADATA_BASE`
  - canonical のベースURL

`build:demo` / `build:prod` ではスクリプト側で自動設定されます。

## 出力と公開

- 静的出力先: `out/`
- `next.config.ts` で `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`
- ビルド後に不要な `404` と一部ディレクトリを削除する運用です

## データ配置

API サーバーは使わず、`public/` 配下の JSON を `fetch` して表示します。

- 求人詳細マップ: `public/db/details_list.json`
- 施設別求人: `public/db/facilities/<fac_id>/jobs/*.json`
- 施設情報: `public/db/facilities/<fac_id>/facility.json`
- 各種マスタ: `public/db/master/*.json`

## ディレクトリ概要

- `src/app`: App Router ページ
- `src/components`: 画面コンポーネント
- `src/styles`: SCSS（グローバル / モジュール）
- `src/types`: 型定義
- `src/utils`: ユーティリティ
- `public/db`: 表示用データ

## 補足

- ページの `generateMetadata` / `generateStaticParams` は同期関数で実装してください。
- 画像・JSON など公開アセットは `public/` 配下に配置してください。
