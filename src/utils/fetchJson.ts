/**
 * JSON を fetch して返すユーティリティ
 * - res.ok でない / fetch失敗 / json失敗 は fallback を返す
 */
export async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
