// src/utils/isNewByPublishedStart.ts

/**
 * 求人の「新着」判定ユーティリティ
 *
 * - publishedPeriod.start を基準に「新着かどうか」を判定する
 * - 判定期間（日数）は newIconPeriodDays で外部から制御する
 * - end（掲載終了日）は現時点では考慮しない
 *
 * 想定用途：
 * - 求人カード一覧（TOP / 検索結果 / 事業所内）
 * - 求人詳細ヘッダー
 * - マイページ（お気に入り・閲覧履歴）
 */
type Args = {
  /**
   * 掲載開始日（YYYY-MM-DD）
   * - job.publishedPeriod.start をそのまま渡す想定
   * - undefined / null の場合は false（新着扱いしない）
   */
  start: string | undefined | null;

  /**
   * 新着として扱う期間（日数）
   * - 例: 30 → 掲載開始から30日以内を「新着」と表示
   * - master / config 側で一元管理する想定
   */
  newIconPeriodDays: number;

  /**
   * 現在日時（通常は指定しない）
   * - テスト・検証用に差し替え可能
   */
  now?: Date;
};

export function isNewByPublishedStart({
  start,
  newIconPeriodDays,
  now = new Date(),
}: Args): boolean {
  // start が文字列でなければ新着扱いしない
  if (typeof start !== 'string') return false;

  // 判定日数が不正な場合も新着扱いしない
  if (!Number.isFinite(newIconPeriodDays) || newIconPeriodDays <= 0) {
    return false;
  }

  /**
   * start は "YYYY-MM-DD" 形式を想定
   * JST 00:00 起点で日数計算するため、T00:00:00 を付与
   */
  const startDate = new Date(`${start}T00:00:00`);

  // Date パース失敗時は新着扱いしない
  if (Number.isNaN(startDate.getTime())) return false;

  /**
   * 掲載開始日から現在までの経過日数を算出
   * - ミリ秒 → 日に変換
   */
  const diffDays =
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  /**
   * 判定ルール：
   * - 未来日（diffDays < 0）は新着にしない
   * - diffDays が newIconPeriodDays 以内なら新着
   */
  return diffDays >= 0 && diffDays <= newIconPeriodDays;
}
