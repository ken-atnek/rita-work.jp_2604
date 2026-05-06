# Claude Instructions

作業開始時は必ず以下の順で **全ファイルを読んでから** 作業を開始すること。

1. `AGENTS.md`
2. `docs/ROOTS_SPEC.md`
3. `docs/PAGE_STRUCTURE.md`
4. `docs/rules/tsx-comment-rules.md`（`tsx` 編集時）
5. `docs/rules/project-setup.md`
6. `docs/rules/coding-style.md`
7. `docs/rules/nextjs-export.md`
8. `docs/rules/fetch-pattern.md`
9. `docs/rules/ui-interactions.md`
10. `docs/rules/checklist.md`

必須ルール（最優先）:

- `next.config.ts` の `output: 'export'` を維持する
- Tailwind CSS は使用しない（SCSSで実装）
- 仕様と異なる実装はしない（仮実装時は明示）
