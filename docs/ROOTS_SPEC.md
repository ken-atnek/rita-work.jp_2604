# roots 商品・人物ストーリーページ JSON構成仕様

## 概要

商品ページと人物ストーリーページで使用する JSON 構成を定義する。

今回は一覧ページを持たず、各店舗・各人物ごとに詳細データを JSON で管理する。  
将来的に一覧ページが必要になった場合は、別途 `index.json` を追加する。

---

## URL構成

```txt
/roots/?id=roots_001               ← 商品 page
/roots/?id=roots_001&page=story    ← 人物ストーリー page
```

IDのプレフィックス `roots_` は、将来的に他カテゴリのページと区別するための名前空間。

---

## Next.js 側のページ構成

```txt
src/
└─ app/
   └─ roots/
      └─ page.tsx    ← 商品・ストーリー両方を1ファイルで管理
```

`useSearchParams()` で `id` と `page` を取得し、クライアントサイドで表示を切り替える。
`generateStaticParams` は不要（IDを追加してもビルド不要）。

```ts
const id = searchParams.get("id"); // "roots_001"
const page = searchParams.get("page"); // "story" | null
const folderId = id?.replace("roots_", ""); // "001"
```

---

## 基本ディレクトリ構成

```txt
public/
└─ db/
   └─ roots/
      ├─ details/
      │  └─ 001/
      │     ├─ common.json
      │     ├─ info.json
      │     ├─ events.json
      │     ├─ productPage.json
      │     └─ storyPage.json
      └─ images/
         └─ 001/
            ├─ product-hero.webp
            ├─ product-item-01.webp
            ├─ product-item-02.webp
            ├─ product-item-03.webp
            ├─ product-item-04.webp
            ├─ person-story.webp
            ├─ story-hero.webp
            ├─ story-section-01.webp
            └─ event.webp
```

---

## JSONファイルの役割

```txt
common.json      → 両ページ共通の基本情報
info.json        → Infoエリア専用
events.json      → イベント枠専用
productPage.json → 商品page専用
storyPage.json   → 人物ストーリーpage専用
```

---

## 設計方針

- 一覧ページは現時点では作成しない。
- 将来的に一覧が必要になった場合は `public/db/roots/index.json` を追加する。
- 1店舗 / 1案件ごとに `001` のような ID フォルダで管理する。
- URLのidは `roots_001` 形式、JSONフォルダは `001`（`roots_` を除いた部分）で対応する。
- IDを追加してもビルド不要（クライアントサイドで `useSearchParams` を使うため）。
- `common.json` と `info.json` は分けて管理する。
- 店舗名は `common.json` に `shopName` として持たせる。
- Info欄で店舗名の表記が変わる可能性があるため、`info.json` 側には `infoShopName` を持たせる。
- イベントは1枠固定のため、`events.json` は配列にしない。
- 商品pageの `items` は4〜5個並ぶ想定のため、配列で管理する。
- 人物ストーリーpageの `sections` は複数対応できるように配列で管理する。
- 改行や段落が必要なテキストは、基本的に文字列配列で管理する。

---

## common.json

商品ページと人物ストーリーページの両方で共通して使う基本情報。

```json
{
  "id": "001",
  "shopName": "店舗名称",
  "position": "オーナーパティシエ",
  "name": "山田 太郎",
  "nameEn": "TARO YAMADA",
  "pageText": [
    "ページ共通テキストの1段落目です。",
    "ページ共通テキストの2段落目です。"
  ],
  "onlineShopUrl": "https://example.com/"
}
```

`position` には以下のような肩書き・職種・役職を入れる。

```txt
オーナーパティシエ
パティシエ
カメラマン
代表
店主
料理人
職人
作家
```

---

## info.json

Infoエリア専用の情報。

```json
{
  "infoShopName": "Info欄で表示する店名",
  "place": "熊本県熊本市〇〇〇〇",
  "mapUrl": "https://www.google.com/maps/embed?pb=xxxx",
  "businessHours": ["10:00〜18:00", "ランチ 11:30〜14:00", "夜営業は予約制"],
  "tel": "096-000-0000",
  "holiday": "月曜日"
}
```

用途の分け方。

```txt
common.shopName     → ページ全体で使う正式な店舗名称
info.infoShopName   → Info欄で表示する店名
```

表示側でフォールバックしてもよい。

```tsx
<h3>{info.infoShopName || common.shopName}</h3>
```

---

## events.json

イベント枠の情報。1枠固定のため配列にしない。

```json
{
  "isVisible": true,
  "image": "/db/roots/images/001/event.webp",
  "title": "イベントタイトル",
  "text": ["イベントテキストの1段落目です。", "イベントテキストの2段落目です。"]
}
```

イベントを表示しない場合。

```json
{
  "isVisible": false,
  "image": "",
  "title": "",
  "text": []
}
```

表示側。

```tsx
{
  event.isVisible && <EventSection event={event} />;
}
```

---

## productPage.json

商品page専用の情報。

```json
{
  "hero": {
    "image": "/db/roots/images/001/product-hero.webp",
    "text": ["heroテキストの1行目です。", "heroテキストの2行目です。"]
  },
  "main": {
    "title": "メインタイトル",
    "text": ["メインテキストの1段落目です。", "メインテキストの2段落目です。"]
  },
  "ecUrl": "https://example.com/",
  "items": [
    {
      "image": "/db/roots/images/001/product-item-01.webp",
      "title": "商品タイトル01",
      "textWithImage": [
        "画像が入ったバージョンのテキスト1段落目です。",
        "画像が入ったバージョンのテキスト2段落目です。"
      ]
    }
  ],
  "personStoryImage": "/db/roots/images/001/person-story.webp"
}
```

---

## storyPage.json

人物ストーリーpage専用の情報。

```json
{
  "hero": {
    "image": "/db/roots/images/001/story-hero.webp",
    "text": ["heroテキストの1行目です。", "heroテキストの2行目です。"]
  },
  "sections": [
    {
      "image": "/db/roots/images/001/story-section-01.webp",
      "title": "タイトル01",
      "textWithImage": [
        "画像が入ったバージョンのテキスト1段落目です。",
        "画像が入ったバージョンのテキスト2段落目です。"
      ]
    }
  ]
}
```

---

## 画像パスのルール

画像ディレクトリ。

```txt
public/db/roots/images/001/
```

JSON内では `/public` を含めず以下のように指定する。拡張子は実ファイルに合わせる（`.jpg` / `.webp` など）。

```json
"/db/roots/images/001/product-hero.jpg"
```

---

## 最終ファイル構成

```txt
public/
└─ db/
   └─ roots/
      ├─ details/
      │  └─ 001/
      │     ├─ common.json
      │     ├─ info.json
      │     ├─ events.json
      │     ├─ productPage.json
      │     └─ storyPage.json
      └─ images/
         └─ 001/
            ├─ product-hero.webp
            ├─ product-item-01.webp
            ├─ product-item-02.webp
            ├─ product-item-03.webp
            ├─ product-item-04.webp
            ├─ person-story.webp
            ├─ story-hero.webp
            ├─ story-section-01.webp
            └─ event.webp
```

---

## 将来的な拡張

### 一覧ページ

URL は `/roots/list/`。SEO的に `/roots/` の配下に置くことで、rootsコンテンツとの関係性をGoogleに伝えやすくする。

```txt
src/app/roots/
├── page.tsx        ← 商品・ストーリー（現在）
└── list/
    └── page.tsx    ← 一覧ページ（将来）
```

一覧データは `public/db/roots/index.json` を追加して管理する。

```json
[
  {
    "id": "roots_001",
    "shopName": "店舗名称",
    "thumbnail": "/db/roots/images/001/product-hero.webp",
    "summary": "一覧用の短い紹介文"
  }
]
```
