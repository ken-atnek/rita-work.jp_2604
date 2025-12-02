# RITA 求人サイト — master フォルダ一覧

`public/db/master/` は、求人サイト全体で共通して参照する  
「マスタデータ」を管理するフォルダです。

求人データ・施設データ・検索機能などで使用する  
分類・項目・選択肢などの定義をここにまとめています。

将来的に DB を構築する際の「元ネタ（マスタテーブル設計のたたき台）」としても利用します。

---

## ◆ このフォルダの基本ルール

- 各ファイルは **1つのマスタテーブル** を表すイメージ  
  （例：`jobCategories.json` ⇔ `m_job_categories`）
- 各要素は基本的に
  - `id` … 永続的に変えないキー（DB の主キー相当 or 永続キー）
  - `name` / `label` … 画面表示用の文言
  - `sortOrder` … 画面表示の並び順
- 求人データや施設データには「id だけ」持たせて、  
  表示時にこのマスタを参照してラベルに変換する方針。

---

## 1. jobCategories.json（職種マスタ）

**用途**  
求人の「職種」を ID で管理し、画面表示や検索条件に使用。

**想定DBテーブル**  
`m_job_categories`

**主な使用箇所**

- 求人詳細ページの「募集職種」
- 求人一覧のカテゴリ表示
- 検索条件（職種絞り込み）
- `job_0001.json` などの `jobCategoryId`

**データ例**

```json
[
  { "id": "nurse", "name": "看護師" },
  { "id": "care", "name": "介護士" },
  { "id": "pt", "name": "理学療法士" },
  { "id": "ot", "name": "作業療法士" },
  { "id": "st", "name": "言語聴覚士" }
]
```

---

## 2. employmentTypes.json（雇用形態マスタ）

**用途**  
正社員 / 契約職員 / パート などの雇用形態を ID で管理。

**想定DBテーブル**  
`m_employment_types`

**主な使用箇所**

- 求人詳細の「雇用形態」表示
- 求人検索（雇用形態フィルタ）
- `job_0001.json` などの `employmentTypeId`

**データ例**

```json
[
  { "id": "fulltime", "name": "正社員" },
  { "id": "contract", "name": "契約職員" },
  { "id": "part", "name": "パート・アルバイト" },
  { "id": "outsourcing", "name": "委託業務" }
]
```

---

## 3. salaryUnits.json（給与単位マスタ）

**用途**  
給与の単位（時給 / 月給）を ID で管理。

**想定DBテーブル**  
`m_salary_units`

**主な使用箇所**

- 求人詳細ページの「給与」表示
- 管理画面の給与入力セレクト
- `job_0001.json` の `salary.unitId`

**データ例**

```json
[
  { "id": "monthly", "name": "月給" },
  { "id": "hourly", "name": "時給" }
]
```

---

## 4. firstYearIncomeRanges.json（初年度年収レンジ）

**用途**  
初年度年収を、「〜300万円」「300〜400万円」などの範囲で表現。

**想定DBテーブル**  
`m_first_year_income_ranges`

**主な使用箇所**

- 求人詳細の「初年度年収」表示
- 将来的な検索条件（年収レンジ絞り込み）
- `job_0001.json` の `firstYearIncomeRangeId`

**データ例**

```json
[
  {
    "id": "fy_0001",
    "label": "〜300万円",
    "min": 0,
    "max": 3000000
  },
  {
    "id": "fy_0002",
    "label": "300〜400万円",
    "min": 3000000,
    "max": 4000000
  },
  {
    "id": "fy_0003",
    "label": "400〜500万円",
    "min": 4000000,
    "max": 5000000
  },
  {
    "id": "fy_0004",
    "label": "500万円以上",
    "min": 5000000,
    "max": null
  }
]
```

---

## 5. benefitOptions.json（待遇・福利厚生マスタ）

**用途**  
「待遇・福利厚生」のチェックボックス項目を定義するマスタ。  
`sortOrder` は画面での表示順を制御するための数値。

**想定DBテーブル**  
`m_benefit_options`

**主な使用箇所**

- 求人詳細の「待遇」一覧表示
- 管理画面のチェックボックス
- 将来的な検索条件（「寮あり・社宅あり」など）
- `job_0001.json` の `benefits.optionIds`

**データ例**

```json
[
  { "id": "dormitory", "name": "寮あり・社宅あり", "sortOrder": 1 },
  { "id": "childcare_support", "name": "託児所・保育支援あり", "sortOrder": 2 },
  { "id": "welfare_pension", "name": "社会保険完備", "sortOrder": 3 }
]
```

※ `sortOrder` … 昇順にソートしてから表示する。  
後から項目を挿入したい場合は、間の番号を使って調整する。

---

## 5-1. trainingSupportOptions.json（研修・サポート項目マスタ）

**用途**  
求人詳細ページの「研修・サポート」項目（例：資格取得支援、研修制度）を ID で管理。

**想定DBテーブル**  
`m_training_support_options`

**主な使用箇所**

- 求人詳細の「研修・サポート」表示
- 管理画面のチェックボックス
- `job_0001.json` の `trainingSupport.options`

**データ例**

```json
[
  { "id": "qualification_support", "label": "資格取得支援あり" },
  { "id": "training_available", "label": "研修制度あり" }
]
```

---

## 5-2. accessOptions.json（アクセス条件マスタ）

**用途**  
「駅から徒歩5分」「車通勤OK」などのアクセス条件を ID で管理。

**想定DBテーブル**  
`m_access_options`

**主な使用箇所**

- 求人詳細の「アクセス」表示
- 将来的な検索条件（通勤条件フィルタ）
- `job_0001.json` の `access.options`

**データ例**

```json
[
  { "id": "near_station_5min", "label": "駅から徒歩5分以内" },
  { "id": "car_commute_ok", "label": "車通勤OK" }
]
```

---

## 5-3. applicationRequirementOptions.json（応募要件マスタ）

**用途**  
「応募要件」（未経験可／ブランク可／資格必須 など）のチェックボックス項目を定義するマスタ。  
`sortOrder` は画面での表示順を制御するための数値。

**想定DBテーブル**  
`m_application_requirement_options`

**主な使用箇所**

- 求人詳細の「応募要件」一覧表示
- 管理画面のチェックボックス
- 将来的な検索条件（「未経験可のみ表示」など）
- `job_0001.json` の `applicationRequirements.optionIds`

**データ例**

```json
[
  { "id": "no_experience_ok", "name": "未経験可", "sortOrder": 1 },
  { "id": "career_gap_ok", "name": "ブランク可", "sortOrder": 2 },
  { "id": "age_not_required", "name": "年齢不問", "sortOrder": 4 }
]
```

---

## 6. workEnvironmentMetrics.json（職場環境データマスタ）

**用途**  
「月平均残業時間」「有休取得率」など、  
職場環境を数値で表す項目と、その単位を定義。

**想定DBテーブル**  
`m_work_environment_metrics`

**主な使用箇所**

- 求人詳細の「職場環境データ」表示
- 将来のグラフ表示やランキング機能
- `job_0001.json`（または facility 側）で数値を持たせて紐づけ予定

**データ例**

```json
[
  { "id": "monthly_avg_overtime", "label": "月平均残業時間", "unit": "h" },
  { "id": "paid_leave_rate", "label": "有休取得率", "unit": "day" },
  { "id": "childcare_leave_rate", "label": "育休取得率", "unit": "%" },
  { "id": "annual_holidays", "label": "年間休日数", "unit": "day" }
]
```

---

## 7. facilityTypes.json（事業所種別マスタ）

**用途**  
事業所が「病院なのか、介護施設なのか」などの種別を定義。

**想定DBテーブル**  
`m_facility_types`

**主な使用箇所**

- `facility.json` の `facilityTypeId`
- 事業所詳細の表示
- 検索条件（病院だけ・介護施設だけ…）

**データ例**

```json
[
  { "id": "hospital", "label": "病院" },
  { "id": "clinic", "label": "診療所" },
  { "id": "nursing_care", "label": "介護施設" },
  { "id": "dental", "label": "歯科診療所" }
]
```

---

## 8. corporations.json（法人マスタ）

**用途**  
運営法人の基本情報。  
複数の事業所（facility）が 1つの法人に紐づく想定。

**想定DBテーブル**  
`m_corporations`

**主な使用箇所**

- `facility.json` の `corporationId`
- 管理画面の「法人ごとの契約管理」など

**データ例**

```json
[
  {
    "id": "corp_0001",
    "contractDate": "2025-06-01",
    "name": "有限会社ART-FACTORY",
    "nameKana": "あーとふぁくとりー",
    "postalCode": "860-00807",
    "prefecture": "熊本県",
    "city": "熊本市中央区下通2丁目",
    "addressLine": "5番18号",
    "phone": "096-312-8039",
    "email": "info@a-fact.co.jp"
  }
]
```

---

## 9. contractPlans.json（掲載プランマスタ）

**用途**  
ライトプラン / スタンダードプラン / プレミアムプランなど、  
求人の掲載プランを管理。

**想定DBテーブル**  
`m_contract_plans`

**主な使用箇所**

- `job_0001.json` の `contractPlanId`
- 詳細ページのプラン名表示
- プランごとのコンテンツ表示制御  
  （ライト：基本のみ、スタンダード：＋インタビュー、プレミアム：＋動画・福利厚生 など）

**データ例**

```json
[
  { "id": "light", "name": "ライトプラン" },
  { "id": "standard", "name": "スタンダードプラン" },
  { "id": "premium", "name": "プレミアムプラン" }
]
```

---

## メモ（将来の自分＆DB担当者用）

- マスタの `id` は極力変更しない（DB・JSON すべてに影響するため）
- ラベル変更は `name` / `label` のみ変更で対応する
- 新しい選択肢を追加したい場合は、  
  **既存の id を使い回さず、新しい id を追加する**
- DB 構築時は、このファイルを見ながら  
  `m_xxx` 系のマスタテーブルを作成していく想定
