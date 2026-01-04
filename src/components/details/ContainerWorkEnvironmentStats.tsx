/* =======================================
 * リタワーク 求人詳細ページ｜業務環境統計
 * URL: ssrc/components/details/ContainerWorkEnvironmentStats.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * Last updated: 2025-11-24
 * ======================================= */
import styles from './ContainerWorkEnvironmentStats.module.scss';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import type { Job } from '@/types/job';

type ContainerWorkEnvironmentStatsProps = {
  job: Job;
  contractPlanId: string;
};
type WorkEnvironmentMetric = {
  id: string;
  label: string;
  unit: 'h' | 'day' | '%' | 'yen' | 'year';
};

export default function ContainerWorkEnvironmentStats({
  job,
  contractPlanId,
}: ContainerWorkEnvironmentStatsProps) {
  const [metrics, setMetrics] = useState<WorkEnvironmentMetric[]>([]);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await fetch('/db/master/workEnvironmentMetrics.json');
        if (!res.ok) return;
        const data = (await res.json()) as WorkEnvironmentMetric[];
        setMetrics(data);
      } catch {
        // 失敗したら空のまま（業務環境統計セクションを非表示でOK）
      }
    };

    loadMetrics();
  }, []);
  const metricsMap = metrics.reduce<Record<string, WorkEnvironmentMetric>>(
    (acc, metric) => {
      acc[metric.id] = metric;
      return acc;
    },
    {}
  );
  const formatValueWithUnit = (
    value: number,
    unit: WorkEnvironmentMetric['unit']
  ): ReactNode => {
    switch (unit) {
      case 'h':
        return (
          <>
            <span className={styles.value}>{value}</span>
            <span className={styles.unit}>h</span>
          </>
        );
      case 'day':
        return (
          <>
            <span className={styles.value}>{value}</span>
            <span className={styles.unit}>日</span>
          </>
        );
      case '%':
        return (
          <>
            <span className={styles.value}>{value}</span>
            <span className={styles.unit}>%</span>
          </>
        );
      case 'yen':
        return (
          <>
            <span className={styles.value}>{value}</span>
            <span className={styles.unit}>万円</span>
          </>
        );
      case 'year':
        return (
          <>
            <span className={styles.value}>{value}</span>
            <span className={styles.unit}>年</span>
          </>
        );
      default:
        return <span className={styles.value}>{value}</span>;
    }
  };
  return (
    <section
      className={clsx(
        styles.containerWorkEnvironmentStats,
        styles[`plan-${contractPlanId}`] // ★ 追加
      )}
    >
      <ul className={styles.environmentStatList}>
        {job.workEnvironmentStats.map((stat) => {
          const metric = metricsMap[stat.metricId];
          if (!metric) return null; // マスターに無いIDはスキップ

          const title = metric.label;
          const valueText = formatValueWithUnit(stat.value, metric.unit);

          return (
            <li key={stat.metricId}>
              <h3>{title}</h3>
              <div
                className={clsx(
                  styles.boxContents,
                  styles[`${stat.metricId.replace(/_/g, '-')}`]
                )}
              >
                {valueText}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
