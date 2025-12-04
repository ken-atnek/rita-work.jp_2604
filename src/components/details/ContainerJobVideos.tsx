/* =======================================
 * リタワーク 求人詳細ページ｜職場関連動画
 * URL: src/components/details/ContainerJobVideos.tsx
 * Referenced in: src/components/details/JobDetailContent.tsx
 * Created: 2025-12-04
 * Last updated: 2025-12-04
 * ======================================= */
import type { FC } from 'react';
import styles from './ContainerJobVideos.module.scss';

type JobVideo = {
  id: string;
  url: string;
  title: string;
};
type ContainerJobVideosProps = {
  jobVideos: JobVideo[];
};

const ContainerJobVideos: FC<ContainerJobVideosProps> = ({ jobVideos }) => {
  // 動画が1件もなければ何も表示しない
  if (!jobVideos.length) return null;
  console.log('jobVideos in ContainerJobVideos:', jobVideos);
  return (
    <section className={styles.containerJobVideos}>
      <ul className={styles.videoList}>
        {jobVideos.map((video) => (
          <li key={video.id}>
            <h2>{video.title}</h2>
            <div>
              <iframe
                src={video.url}
                title={`動画 ${video.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ContainerJobVideos;
