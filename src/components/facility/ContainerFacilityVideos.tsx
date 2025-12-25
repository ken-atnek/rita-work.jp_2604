/* =======================================
 * リタワーク 事業所紹介動画
 * URL: src/components/facility/ContainerFacilityVideos.tsx
 * Referenced in: src/components/facility/FacilityDetailContent.tsx
 * Created: 2025-12-25
 * Last updated: 2025-12-25
 * ======================================= */

import styles from './ContainerFacilityVideos.module.scss';

type JobVideo = {
  id: string;
  url: string;
};

type ContainerFacilityVideosProps = {
  jobVideos: JobVideo[];
};

const getYoutubeEmbedUrl = (url: string): string => {
  try {
    const parsed = new URL(url);

    // youtu.be 短縮 URL → https://www.youtube.com/embed/{id}
    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.replace('/', '');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    // 通常の YouTube URL (https://www.youtube.com/watch?v=xxxx)
    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    // 変換できないURLは空にして表示しない（安全）
    return '';
  } catch {
    return '';
  }
};

export function ContainerFacilityVideos({
  jobVideos,
}: ContainerFacilityVideosProps) {
  // 動画が1件もなければ何も表示しない
  if (!jobVideos || jobVideos.length === 0) return null;

  return (
    <section className={styles.containerFacilityVideos}>
      <article>
        <h2>事業所紹介動画</h2>
        {jobVideos.map((video) => {
          const embedUrl = getYoutubeEmbedUrl(video.url);
          if (!embedUrl) return null;
          return (
            <div key={video.id} className={styles.itemCVideo}>
              <iframe
                src={embedUrl}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        })}
      </article>
    </section>
  );
}
