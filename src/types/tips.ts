export type TipIndexItem = {
  id: string; // tips0001
  title: string;
  summary: string;
  thumbnail: string; // /db/tips/tips0001/thumb.jpg
  publishedAt: string; // YYYY-MM-DD
};

export type TipsIndexJson = {
  items: TipIndexItem[];
};

export type TipDetail = {
  id: string;
  title: string;
  publishedAt: string;
  heroImage?: string;
  body: ProseMirrorDoc;
};

export type ProseMirrorDoc = {
  type: 'doc';
  content: ProseMirrorNode[];
};

export type ProseMirrorNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ProseMirrorNode[];
  marks?: ProseMirrorMark[];
  text?: string;
};

export type ProseMirrorMark = {
  type: string;
  attrs?: Record<string, unknown>;
};
