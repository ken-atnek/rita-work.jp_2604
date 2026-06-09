const fallbackSiteUrl = 'https://rita-work.jp/';
const defaultOgImagePath = '/ogp.jpg';

export const siteUrl =
  process.env.NEXT_PUBLIC_METADATA_BASE || fallbackSiteUrl;

export const getCanonicalUrl = (path: string) =>
  new URL(path, siteUrl).toString();

export const getDefaultOpenGraphImage = () => ({
  url: new URL(defaultOgImagePath, siteUrl).toString(),
  width: 1200,
  height: 630,
  alt: 'リタワークのOGP画像',
});

export const upsertCanonicalLink = (href: string) => {
  let link = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', href);
};

export const upsertRobotsMeta = (content: string) => {
  let meta = document.querySelector(
    'meta[name="robots"]'
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
};
