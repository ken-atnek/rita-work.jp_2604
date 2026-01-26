/* =======================================
 * リタワーク 転職のヒント本文レンダラ
 * URL: src/components/tips/TipsBodyRenderer.tsx
 * Created: 2026-01-24
 * Last updated: 2026-01-24
 * ======================================= */
import Image from 'next/image';
import styles from '@/styles/PageTips.module.scss';
import type { ReactNode } from 'react';
import type {
  ProseMirrorDoc,
  ProseMirrorNode,
  ProseMirrorMark,
} from '@/types/tips';

type Props = {
  doc: ProseMirrorDoc;
};

export function TipsBodyRenderer({ doc }: Props) {
  return (
    <div className={styles.tipsBody}>
      {doc.content.map((node, index) => (
        <NodeRenderer key={index} node={node} />
      ))}
    </div>
  );
}

function NodeRenderer({ node }: { node: ProseMirrorNode }) {
  switch (node.type) {
    case 'paragraph':
      return <p>{renderInline(node.content)}</p>;

    case 'heading': {
      const level = getHeadingLevel(node);
      const children = renderInline(node.content);

      if (level === 1) return <h1>{children}</h1>;
      if (level === 2) return <h2>{children}</h2>;
      if (level === 3) return <h3>{children}</h3>;
      if (level === 4) return <h4>{children}</h4>;
      if (level === 5) return <h5>{children}</h5>;
      return <h6>{children}</h6>;
    }

    case 'bulletList':
      return (
        <ul>
          {node.content?.map((child, index) => (
            <NodeRenderer key={index} node={child} />
          ))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol>
          {node.content?.map((child, index) => (
            <NodeRenderer key={index} node={child} />
          ))}
        </ol>
      );

    case 'listItem':
      return (
        <li>
          {node.content?.map((child, index) => (
            <NodeRenderer key={index} node={child} />
          ))}
        </li>
      );

    case 'image': {
      const attrs = node.attrs as
        | { src?: string; alt?: string; title?: string | null }
        | undefined;
      const src = attrs?.src;
      if (!src) return null;

      return (
        <div className="tips-image">
          <Image src={src} alt={attrs?.alt ?? ''} width={1200} height={630} />
        </div>
      );
    }

    case 'imageGallery':
      return (
        <div className={styles.tipsGallery}>
          <ul>
            {node.content?.map((imgNode, index) => (
              <li key={index} className="tips-gallery__item">
                <NodeRenderer node={imgNode} />
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      // 未対応ノードはとりあえず無視（後で必要になったら追加）
      return null;
  }
}

/**
 * paragraph の中身など、インライン要素をレンダリング
 * - text
 * - hardBreak
 */
function renderInline(nodes?: ProseMirrorNode[]) {
  if (!nodes || nodes.length === 0) return null;

  return nodes.map((n, index) => {
    if (n.type === 'text') {
      return <InlineText key={index} node={n} />;
    }
    if (n.type === 'hardBreak') {
      return <br key={index} />;
    }
    // 仕様上ここに他の inline が来る可能性もあるので保険
    return null;
  });
}

function InlineText({ node }: { node: ProseMirrorNode }) {
  const text = node.text ?? '';
  const marks = node.marks ?? [];

  let el: ReactNode = text;

  // color（textStyle）
  const color = getTextColor(marks);
  if (color) {
    el = <span style={{ color }}>{el}</span>;
  }

  // strike / italic / bold（ネスト順は好みでOK）
  if (hasMark(marks, 'strike')) {
    el = <s>{el}</s>;
  }
  if (hasMark(marks, 'italic')) {
    el = <em>{el}</em>;
  }
  if (hasMark(marks, 'bold')) {
    el = <strong>{el}</strong>;
  }

  return <>{el}</>;
}

function hasMark(marks: ProseMirrorMark[], type: string) {
  return marks.some((m) => m.type === type);
}

function getTextColor(marks: ProseMirrorMark[]) {
  const mark = marks.find((m) => m.type === 'textStyle');
  if (!mark?.attrs) return undefined;

  const attrs = mark.attrs as { color?: string } | undefined;
  return attrs?.color;
}

function getHeadingLevel(node: ProseMirrorNode) {
  const attrs = node.attrs as { level?: number } | undefined;
  const level = attrs?.level ?? 2;

  // 想定外が来ても壊れないように
  if (level < 1) return 1;
  if (level > 6) return 6;
  return level;
}
