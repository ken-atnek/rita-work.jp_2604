/* =======================================
 * リタワーク ライン応募
 * URL: src/app/lineApply/page.tsx
 * Created: 2025-12-10
 * Last updated: 2025-12-10
 * ======================================= */
'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';

const BACKEND_START_BASE_URL =
  'https://rita5258.xbiz.jp/backend/line-login/start/';
const MOBILE_UA_REGEX =
  /iPhone|iPod|iPad.*Mobile|Android.*Mobile|Windows Phone|BlackBerry|Opera Mini/i;

export default function LineApplyPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job_id') ?? '';
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const backendStartUrl = useMemo(() => {
    if (!jobId) return '';
    return `${BACKEND_START_BASE_URL}?job_id=${encodeURIComponent(jobId)}`;
  }, [jobId]);

  useEffect(() => {
    if (!jobId || !backendStartUrl) {
      setIsMobile(false);
      return;
    }

    const ua = navigator.userAgent || '';
    const isMobileUa = MOBILE_UA_REGEX.test(ua);
    setIsMobile(isMobileUa);

    if (isMobileUa) {
      window.location.href = backendStartUrl;
    }
  }, [jobId, backendStartUrl]);

  if (!jobId) {
    return (
      <main style={styles.main}>
        <article style={styles.card}>
          <h1>LINE応募</h1>
          <p>job_id が指定されていません。URL をご確認ください。</p>
        </article>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <article style={styles.card}>
        <h1>LINE応募</h1>
        {isMobile === null && <p>利用環境を確認しています…</p>}
        {isMobile === true && (
          <p>LINEログインへ自動的に遷移しています。しばらくお待ちください。</p>
        )}
        {isMobile === false && backendStartUrl && (
          <div style={styles.desktopContent}>
            <section>
              <h2>スマートフォンでQRコードを読み取る</h2>
              <p>
                下記のQRコードをスマートフォンで読み取ると、LINEアプリで応募手続きが始まります。
              </p>
              <div style={styles.qrWrapper}>
                <QRCodeCanvas value={backendStartUrl} size={220} includeMargin />
              </div>
            </section>
            <section>
              <h2>このPCから直接応募する</h2>
              <p>
                LINEアプリをPCにインストール済みの場合は、以下のリンクから直接ログインできます。
              </p>
              <a
                href={backendStartUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                このPCからLINEログインして応募する
              </a>
            </section>
          </div>
        )}
      </article>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    padding: '40px 16px',
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '24px clamp(16px, 4vw, 32px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  desktopContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    marginTop: 24,
    textAlign: 'left',
  },
  qrWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
    borderRadius: 999,
    backgroundColor: '#06C755',
    color: '#fff',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
