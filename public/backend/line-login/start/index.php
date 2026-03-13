<?php
#LINEログイン start エンドポイント
#job_id を受け取り、state を組み立てて LINE 認可画面へリダイレクトする

declare(strict_types=1);

#NOTE: PHP側は Next.js の .env.production を自動では読みません。
#切替はサーバー側の環境変数（Apacheなら SetEnv 等）で行う想定です。
define('LINE_LOGIN_CHANNEL_ID', getenv('RITA_LINE_LOGIN_CHANNEL_ID') ?: '');
define('LINE_LOGIN_REDIRECT_URI', getenv('RITA_LINE_LOGIN_REDIRECT_URI') ?: '');
function abort_with_message(string $message, int $statusCode = 400): never
{
	http_response_code($statusCode);
	header('Content-Type: text/plain; charset=UTF-8');
	echo $message;
	exit;
}
$jobId = isset($_GET['job_id']) ? trim((string)$_GET['job_id']) : '';
try {
	$nonce = bin2hex(random_bytes(16));
} catch (Throwable $e) {
	abort_with_message('nonce の生成に失敗しました。', 500);
}
$statePayload = [
	#求人を選ばずに友だち登録だけを行う導線では空文字になり得る
	'job_id' => $jobId,
	'nonce'  => $nonce,
	'flow'   => ($jobId === '' ? 'friend_only' : 'apply'),
];
$stateJson = json_encode($statePayload, JSON_UNESCAPED_UNICODE);
if ($stateJson === false) {
	abort_with_message('state のエンコードに失敗しました。', 500);
}
$state = base64_encode($stateJson);
$query = http_build_query([
	'response_type' => 'code',
	'client_id'     => LINE_LOGIN_CHANNEL_ID,
	'redirect_uri'  => LINE_LOGIN_REDIRECT_URI,
	'state'         => $state,
	#ニックネーム取得のため profile を含める
	'scope'         => 'openid profile',
	#OIDC nonce（将来的に id_token の nonce と突合する用途）
	'nonce'         => $nonce,
	'bot_prompt'    => 'normal',
], '', '&', PHP_QUERY_RFC3986);
$authorizeUrl = 'https://access.line.me/oauth2/v2.1/authorize?' . $query;
header('Location: ' . $authorizeUrl);
exit;
