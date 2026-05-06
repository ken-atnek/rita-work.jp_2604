# ページ構成メモ

スクリーンショット参照: `docs/screenshots/`

---

## 商品ページ `/roots/?id=roots_001`

参照: `PRODUCTS.jpg`

| # | セクション | 内容 |
|---|-----------|------|
| 1 | Header | SPICEロゴ + ナビ |
| 2 | Hero | 人物写真 + テキスト（複数行） |
| 3 | 人物情報 | 肩書き・名前 |
| 4 | ページ共通テキスト | `common.json` の `pageText` |
| 5 | WEB STORE ボタン | `common.json` の `onlineShopUrl` |
| 6 | **CRAFT** | セクション見出し |
| 7 | 商品アイテム × 複数 | 画像 + タイトル + テキスト（`productPage.json` の `items`） |
| 8 | **STORY** | 人物写真 + ストーリーページへのリンク |
| 9 | **INFO** | 店名・住所・営業時間・TEL・求人 |
| 10 | **EVENT** | イベント写真 + タイトル + テキスト（`isVisible` で表示切替） |
| 11 | WEB STORE ボタン | 再掲 |
| 12 | Footer | SPICEロゴ |

---

## ストーリーページ `/roots/?id=roots_001&page=story`

参照: `SOTRY.jpg`

| # | セクション | 内容 |
|---|-----------|------|
| 1 | Header | SPICEロゴ + ナビ |
| 2 | Hero | 人物写真 + テキスト（複数行） |
| 3 | 人物情報 | 肩書き・名前 |
| 4 | **STORY** セクション × 複数 | 各セクション: 写真 + タイトル + テキスト（`storyPage.json` の `sections`） |
| 5 | WEB STORE ボタン | `common.json` の `onlineShopUrl` |
| 6 | **INFO** | 店名・住所・営業時間・TEL・求人 |
| 7 | **EVENT** | イベント写真 + タイトル + テキスト（`isVisible` で表示切替） |
| 8 | WEB STORE ボタン | 再掲 |
| 9 | Footer | SPICEロゴ |

---

## 両ページ共通セクション

- Header / Footer
- INFO（`info.json`）
- EVENT（`events.json`、`isVisible: false` で非表示）
- WEB STORE ボタン（`common.json` の `onlineShopUrl`）
