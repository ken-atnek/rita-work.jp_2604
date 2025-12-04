/* =======================================
 * リタワーク 求人詳細ページ｜インタビュー
 * URL: src/components/details/ContainerInterview.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-12-04
 * Last updated: 2025-12-04
 * ======================================= */

/* =======================================
 * リタワーク 求人詳細ページ｜インタビュー
 * URL: src/components/details/ContainerInterview.tsx
 * ======================================= */

'use client';

import clsx from 'clsx';
import { useState } from 'react';
import styles from './ContainerInterview.module.scss';
import Image from 'next/image';
import type { InterviewContent } from '@/types/job';

type ContainerInterviewProps = {
  interviewContent: InterviewContent | null;
  contractPlanId: string;
};

export default function ContainerInterview({
  interviewContent,
  contractPlanId,
}: ContainerInterviewProps) {
  // ===============================
  // Hook は必ずコンポーネント先頭で呼ぶ！
  // ===============================
  const [openArticleIds, setOpenArticleIds] = useState<number[]>(() => {
    if (!interviewContent || !interviewContent.articles?.length) {
      return [];
    }
    // 読み込み時は最初の記事だけ開いておく
    return [interviewContent.articles[0].id];
  });

  // ===============================
  // データが無ければここで return
  // （Hook の後ならOK）
  // ===============================
  if (!interviewContent || !interviewContent.articles?.length) {
    return null;
  }

  const { interviewee, articles } = interviewContent;

  const handleToggle = (id: number) => {
    setOpenArticleIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <section
      className={clsx(
        styles.containerInterview,
        styles[`plan-${contractPlanId}`]
      )}
    >
      <article className={styles.inner}>
        <h2 className={styles.heading}>職場インタビュー</h2>

        <p className={styles.interviewee}>
          <span className={styles.intervieweeRole}>{interviewee.role}</span>
          <span className={styles.intervieweeName}>{interviewee.name}</span>
        </p>

        <ul className={styles.articleList}>
          {articles.map((article, index) => {
            const isOpen = openArticleIds.includes(article.id);

            return (
              <li
                key={article.id}
                className={clsx(
                  styles.articleItem,
                  isOpen && styles.articleItemOpen
                )}
              >
                {/* ▼アコーディオンのヘッダー */}
                <button
                  type="button"
                  onClick={() => handleToggle(article.id)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.articleNumber}>
                    {`#${String(index + 1).padStart(2, '0')}`}
                  </span>
                  <h3>{article.title}</h3>
                  <span
                    className={styles.articleToggleIcon}
                    aria-hidden="true"
                  />
                </button>

                {/* ▼ 開いているときだけ本文を表示 */}
                {isOpen && (
                  <div className={styles.articlePanel}>
                    {article.image && (
                      <div className={styles.articleImage}>
                        <Image
                          src={article.image}
                          alt={article.title}
                          width={980}
                          height={550}
                        />
                      </div>
                    )}

                    <div className={styles.articleBody}>
                      {article.sections.map((section, sIndex) => (
                        <section key={sIndex} className={styles.sectionBlock}>
                          {section.heading && (
                            <h3 className={styles.sectionHeading}>
                              {section.heading}
                            </h3>
                          )}

                          <div className={styles.sectionBody}>
                            {section.body.map((line, i) =>
                              line === '' ? (
                                <br key={i} />
                              ) : (
                                <p key={i}>{line}</p>
                              )
                            )}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}
