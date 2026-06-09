# リタワーク SEO運用仕様

## 目的

リタワーク本体サイトの SEO 実装・運用方針をまとめる。

`output: 'export'` の静的書き出しを維持しつつ、検索に出したいページと出さないページを分け、`title` / `description` / `robots` / sitemap / OGP の整合を取りやすくする。

---

## 現在の前提

- Next.js App Router
- `output: 'export'` の静的書き出し運用
- 本番判定は `NEXT_PUBLIC_IS_REAL_PROD=true`
- 本番URLは `NEXT_PUBLIC_METADATA_BASE=https://rita-work.jp/`
- デモURLは `https://rita5258.xbiz.jp/`
- AI は確認時に `build` を実行しない

---

## 対象ページ

| ページ | パス | SEO方針 |
|---|---|---|
| トップ | `/` | index対象 |
| 求人検索 | `/jobs/` | index対象 |
| 求人詳細 | `/details/` | 原則 index対象。ただしクエリ依存のため canonical 方針を要確認 |
| 事業所詳細 | `/facility/` | 原則 index対象。ただし現状 metadata 未定義 |
| 転職のヒント一覧 | `/tips/` | index対象 |
| 転職のヒント詳細 | `/tips/[id]/` | index対象。記事別 metadata を検討 |
| お気に入り・閲覧履歴 | `/library/` | noindex 推奨 |
| 会社概要 | `/company/` | index対象 |
| 利用規約 | `/terms/` | index対象または noindex 方針を判断 |
| プライバシーポリシー | `/privacy/` | index対象または noindex 方針を判断 |

---

## metadata 運用

### 基本方針

- 共通設定は `src/app/layout.tsx` に集約する
- ページ固有の `title` / `description` は各 `page.tsx` で定義する
- 共通 `description` は `src/app/layout.tsx` で常に定義されている
- ページ固有の `description` や OGP は、本番判定に応じて有効化する現行方針を維持する
- デモ環境では `robots: noindex, nofollow` を維持する
- ただし、ページ側で `robots: { index: true, follow: true }` を直書きすると、デモ環境の noindex 方針と矛盾するため注意する

### 優先して確認するファイル

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/jobs/page.tsx`
- `src/app/details/page.tsx`
- `src/app/facility/page.tsx`
- `src/app/tips/page.tsx`
- `src/app/tips/[id]/page.tsx`
- `src/app/library/page.tsx`

---

## canonical 方針

### 通常ページ

通常ページは、基本的に自己参照 canonical を設定する。

例:

```txt
https://rita-work.jp/jobs/
https://rita-work.jp/tips/
```

通常ページの canonical は、各 `page.tsx` の `metadata.alternates.canonical` で設定する。

### クエリ依存ページ

`/details/` や `/facility/` がクエリパラメータで表示内容を切り替える場合、canonical は運用方針を先に決める。

特に `/facility/` は用途が分かれる。

- `/facility/?id=fac_xxxx`: 事業所詳細
- `/facility/?kw=xxxx`: 事業所検索結果

事業所詳細は index 対象候補、検索結果は noindex または canonical 集約候補として分けて判断する。

現行実装では、クエリ依存ページは以下の方針にする。

- `/details/?id=job_xxxx`: クライアント側で該当URLを canonical に補完
- `/facility/?id=fac_xxxx`: クライアント側で該当URLを canonical に補完
- `/facility/?kw=xxxx`: canonical は `/facility/` に集約し、`noindex,follow` にする
- `/tips/[id]/`: クライアント側で記事URLを canonical に補完

候補:

1. クエリ付きURLを自己参照 canonical にする
2. 一覧や親ページへ canonical を寄せる
3. 将来的に `/details/[id]/` のようなパス型URLへ移行する

現時点では、検索流入を取りたい詳細ページはパス型URLの方が SEO 上は扱いやすい。
ただし大改修になるため、まずは現行構成で `robots` / sitemap / canonical の矛盾をなくす。

---

## sitemap / robots 方針

### sitemap

公開したい index 対象ページを sitemap に含める。

優先対象:

- `/`
- `/jobs/`
- `/tips/`
- `/tips/[id]/`
- `/company/`

要判断:

- `/details/`
- `/facility/`
- `/terms/`
- `/privacy/`

原則 noindex:

- `/library/`

### robots

- 本番: index 対象ページをクロール許可
- デモ: noindex を維持
- `robots.txt` には本番 sitemap URL を案内する

---

## OGP 方針

### 現行対応

- `src/app/layout.tsx` にサイト共通 OGP を設定する
- 主要な静的ページは、ページごとの `title` / `description` / `url` を設定する
- OGP画像は現時点では `/ogp.jpg` を共通利用する

### 今後の改善候補

- TOP専用 OGP 画像
- 求人詳細専用 OGP 画像
- 事業所詳細専用 OGP 画像
- 転職のヒント記事ごとの OGP 画像

詳細ページはクエリ依存・クライアント取得のため、SNSクローラー向けに完全な個別 OGP を出すには、将来的に `/details/[id]/` や `/facility/[id]/` のようなパス型URL化を検討する。

---

## 現時点の注意点

- `docs/ROOTS_SPEC.md` と `docs/seo/ROOTS_QUERY_SEO_SPEC.md` は ROOTS 系の仕様であり、リタワーク本体の SEO 仕様とは別扱い
- `src/app/facility/page.tsx` は共通 metadata を設定済み。事業所ごとの完全な個別 OGP は未対応
- `src/app/tips/[id]/page.tsx` は記事詳細だが、記事別 metadata はクライアント側の title / canonical 補完に留まる
- `src/app/details/page.tsx` は静的な共通 metadata のため、求人ごとの完全な個別 OGP にはなっていない
- `src/app/details/page.tsx` は本番のみ index、デモでは noindex になるよう環境判定を入れる
- `src/app/library/page.tsx` は個人利用ページのため、原則 noindex とする

---

## 次に整える順番

1. `/tips/[id]/` の記事別 metadata を強化する
2. `/details/` と `/facility/` のパス型URL化を検討する
3. 詳細ページ用の個別 OGP 画像方針を決める
4. sitemap に `/details/` / `/facility/` 詳細URLを含めるか判断する
5. OGP 画像と `metadataBase` の本番URL整合を本番ビルド後に確認する
