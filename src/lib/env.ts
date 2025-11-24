// 開発環境と本番環境の状態チェック
export const isRealProduction = process.env.NEXT_PUBLIC_IS_REAL_PROD === 'true';
