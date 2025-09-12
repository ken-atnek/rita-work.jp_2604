## プロジェクト初期設定

- `npx create-next-app@latest . --typescript` でプロジェクト作成
- `npm install --save-dev prettier sass stylelint stylelint-config-standard-scss stylelint-scss` を開発依存でインストール
- Next.js (app/ ルーティング対応) を使用
- `output: 'export'` で運用

## コーディング規約

- SCSSファイルは SCSSコード専用
  - クラス名・変数・ミックスインはケバブケースで記述
- TSXファイルは JSX/TSXコード専用
  - キャメルケース / パスカルケースで記述

---

## Next.js App Router 開発ルール

- ページpropsの `params` は **Promise型禁止**
  - `{ params: { id: string } }` で受け取る
  - `await` で展開しない
- `generateMetadata` は **同期関数で書く**
  - async/await禁止
  - `Promise<Metadata>`を返さない
- `generateStaticParams` は **同期関数で書く**
  - async禁止
- Next.jsのバージョンを固定する
  - 公式型定義のバージョンずれ防止
