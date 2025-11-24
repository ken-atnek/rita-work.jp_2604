/* =======================================
 * リタワーク 求人詳細ページ｜Heroビジュアル表示コンポーネント
 * URL: src/components/details/ContainerJobHero.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-11-24
 * Last updated: 2025-11-24
 * ======================================= */
import type { Job } from '@/types/job';
import styles from './ContainerJobHero.module.scss';

type ContainerJobHeroProps = {
  job: Job;
};

export default function ContainerJobHero({ job }: ContainerJobHeroProps) {
  return (
    <section className={styles.ContainerJobHero}>
      <h2 className="job-hero__title">{job.title}</h2>
    </section>
  );
}
