/* =======================================
 * リタワーク 求人詳細ページ｜一日の流れ
 * URL: src/components/details/ContainerDailySchedule.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * Last updated: 2025-11-29
 * ======================================= */

'use client';

import styles from './ContainerDailySchedule.module.scss';
import type { Job } from '@/types/job';

type ContainerDailyScheduleProps = {
  job: Job;
};

export default function ContainerDailySchedule({
  job,
}: ContainerDailyScheduleProps) {
  const { dailySchedule } = job;

  // dailySchedule が無い／中身が空なら表示しない
  if (
    !dailySchedule ||
    (!dailySchedule.dayShift?.length && !dailySchedule.nightShift?.length)
  ) {
    return null;
  }

  const { dayShift, nightShift } = dailySchedule;

  return (
    <section className={styles.containerDailySchedule}>
      <article>
        {/* セクション全体の見出し：ページ内なので h2 */}
        <h2 className={styles.title}>1日の流れ</h2>
        <div className={styles.innerList}>
          {/* 日勤 */}
          {dayShift?.length > 0 && (
            <div className={styles.boxShiftBlock}>
              <h3>日勤</h3>
              <ul>
                {dayShift.map((item, index) => (
                  <li key={`${item.time}-${index}`}>
                    <div className={styles.time}>{item.time}</div>
                    <div className={styles.contents}>
                      {item.body.map((text, i) => (
                        <p key={i} className={styles.bodyText}>
                          {text}
                        </p>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* 夜勤 */}
          {nightShift?.length > 0 && (
            <div className={styles.boxShiftBlock}>
              <h3>夜勤</h3>
              <ul>
                {nightShift.map((item, index) => (
                  <li key={`${item.time}-${index}`}>
                    <div className={styles.time}>{item.time}</div>
                    <div className={styles.contents}>
                      {item.body.map((text, i) => (
                        <p key={i} className={styles.bodyText}>
                          {text}
                        </p>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
