## Next.js 15 App Router の制約

### params は Promise型を使う（同期型は型エラーになる）

**Next.js 15 では `output: 'export'` であっても、型制約として `params: Promise<...>` が必須。**  
ビルド時に静的生成されるため `await params` は問題なく動作する。

#### ✅ 正しい書き方（静的エクスポートでも同じ）

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
}
```

#### ❌ NG（型エラーになる）

```typescript
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // Type error: Promise のプロパティが不足
}
```

### generateMetadata / generateStaticParams

**静的エクスポート時は async 禁止**

#### ❌ NG

```typescript
export async function generateMetadata(): Promise<Metadata> {
  return { title: "Page" };
}

export async function generateStaticParams() {
  return [{ id: "1" }];
}
```

#### ✅ OK

```typescript
export function generateMetadata(): Metadata {
  return { title: "Page" };
}

export function generateStaticParams() {
  return [{ id: "1" }];
}
```

**理由**: `output: 'export'` 時は全て事前生成されるため、非同期処理は不要
