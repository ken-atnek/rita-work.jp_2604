# リファクタ候補

将来対応すべき技術的負債をまとめたファイル。  
動作には問題ないが、保守性・拡張性のために対応したい項目。

---

## [R-01] salaryUnits / job_common の重複fetch を統合する

### 現状
`/db/master/salaryUnits.json` と `/db/config/job_common.json` を以下の6コンポーネントが個別にfetchしている。

- `src/components/jobs/JobsPageClient.tsx`
- `src/components/Top/ContainerSpotlightCard.tsx`
- `src/components/facility/FacilitySearchPageClient.tsx`
- `src/components/facility/FacilityPageClient.tsx`
- `src/components/library/LibraryClientWrapper.tsx`
- `src/components/details/JobDetailsClient.tsx`

### 方針案
- `loadJobsFilterMasters()` とは別に `loadJobCommonMasters()` を `src/utils/` に新規作成
- 取得内容: `salaryUnits`（給与単位マップ）+ `job_common`（newアイコン日数など）
- 各コンポーネントの個別fetchを削除してこの関数に統一する

### 注意
- `loadJobsFilterMasters` は検索フィルター用途なので混在させない
- 変更対象が6コンポーネントと広いため、一括で対応する
