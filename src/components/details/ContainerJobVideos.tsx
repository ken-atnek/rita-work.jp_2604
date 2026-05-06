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

const getYoutubeEmbedUrl = (url: string): string => {
  try {
    const parsed = new URL(url);

    // youtu.be 短縮 URL → https://www.youtube.com/embed/{id}
    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.replace('/', '');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // 通常の YouTube URL (https://www.youtube.com/watch?v=xxxx)
    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // 変換できなければ元の URL をそのまま返す
    return url;
  } catch (e) {
    // URL パースに失敗した場合も元の URL を返す
    console.warn('YouTube URL の解析に失敗しました', e);
    return url;
  }
};

const ContainerJobVideos: FC<ContainerJobVideosProps> = ({ jobVideos }) => {
  // 動画が1件もなければ何も表示しない
  if (!jobVideos.length) return null;
  return (
    <section className={styles.containerJobVideos}>
      <ul className={styles.videoList}>
        {jobVideos.map((video) => (
          <li key={video.id}>
            <h2>{video.title}</h2>
            <div>
              <iframe
                src={getYoutubeEmbedUrl(video.url)}
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
