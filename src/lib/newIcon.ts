// 日付文字列と「何日までを新着とみなすか」を受け取って NEW 判定する関数
export function isNewByPublishedPeriod(
  startDate: string | undefined,
  limitDays: number
): boolean {
  if (!startDate) {
    return false;
  }

  const today = new Date();
  const start = new Date(startDate);

  // 日付が変な場合も一応ガード
  if (Number.isNaN(start.getTime())) {
    return false;
  }

  const diffMs = today.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= limitDays;
}
