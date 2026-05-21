/* =======================================
 *リタワーク TOP メッセージ
 * URL: src/components/Top/ContainerMessage.tsx
 * Created: 2025-09-04
 * Last updated: 2025-09-04
 * ======================================= */
'use client';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import styles from '@/styles/PageTop.module.scss';
import ExternalLink from '@/components/common/ExternalLink';
import Image from 'next/image';
import { QRCodeCanvas } from 'qrcode.react';

const ContainerTopMessage = () => {
  // LINE応募用モーダル：PC判定（シンプルにUAと画面幅で判定）
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);

  // LINEログイン開始URL（Xサーバー側）
  const backendStartUrl = useMemo(() => {
    return `https://rita-work.jp/backend/line-login/start/`;
  }, []);

  const handleLineApplyClick = useCallback(() => {
    if (!backendStartUrl) return;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isMobile =
      /iPhone|iPod|Android.*Mobile|Windows Phone|Opera Mini/i.test(ua);
    if (isMobile) {
      window.location.href = backendStartUrl;
    } else {
      setIsModalOpen(true);
    }
  }, [backendStartUrl]);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const offset = rect.top * 0.15;

      element.style.setProperty('--parallax-offset', `${offset}px`);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <section ref={sectionRef} className={styles.containerMessage}>
        <article>
          <div className={styles.itemImage}>
            <Image
              src="/images/iphone.webp"
              width={346}
              height={728}
              alt="iPhone画像"
            />
          </div>
          <div className={styles.titleSp}>message</div>
          <div className={styles.wrapMessage}>
            <p className={styles.headSp}>これからはつなぐだけじゃない、</p>
            <h2 className={styles.statusPc}>message</h2>
            <h2 className={styles.statusSp}>
              <i>支</i>
              <i>え</i>
              <i>る</i>転職支援。
            </h2>
            <p>
              リタワークは、求人者と企業の橋渡しを超えた存在を目指しています。
              <br />
              一人ひとりの悩みや不安、業界の課題に正面から向き合い、理想の職場環境を一緒につくること。
              <br />
              「本当に納得できる職場」を見つけるために、私たちがいます。
              <br className="sp" />
              就職先のことに限らず、転職活動全般のお悩みやご不安も、お気軽にご相談ください。
            </p>
            <button
              type="button"
              className={styles.btnLink}
              onClick={handleLineApplyClick}
            >
              <span>LINEで応募する</span>
            </button>
          </div>
          <div className={styles.itemMascot}></div>
        </article>
      </section>
      {isModalOpen && backendStartUrl && (
        <div className={styles.boxLineModal}>
          <div className={styles.modalDetails}>
            <div className={styles.boxHead}>
              <h3>LINEで応募</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="閉じる"
              ></button>
            </div>
            <div className={styles.boxDetails}>
              <h4>スマートフォンでQRコードを読み取る</h4>
              <p className={styles.headAnnounce}>
                下記のQRコードをスマートフォンで読み取ると、
                <br />
                LINEアプリで応募手続きが始まります。
              </p>
              <div className={styles.itemQR}>
                <QRCodeCanvas value={backendStartUrl} size={170} />
              </div>
              <div className={styles.wrapBottom}>
                <h5>このPCから応募する</h5>
                <p>
                  LINEアプリをPCにインストール済みの場合は、
                  <br />
                  以下のリンクから直接ログインできます。
                </p>
                <ExternalLink href={backendStartUrl}>
                  このPCからログインして応募する
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContainerTopMessage;
