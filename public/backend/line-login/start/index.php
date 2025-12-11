<?php
// LINEログイン start エンドポイント
// job_id を受け取り、state を組み立てて LINE 認可画面へリダイレクトする

declare(strict_types=1);

const LINE_LOGIN_CHANNEL_ID = '2008588556';
const LINE_LOGIN_REDIRECT_URI = 'https://rita5258.xbiz.jp/backend/line-login/callback/';

function abort_with_message(string $message, int $statusCode = 400): never
{
	http_response_code($statusCode);
	header('Content-Type: text/plain; charset=UTF-8');
	echo $message;
	exit;
}

$jobId = isset($_GET['job_id']) ? trim((string)$_GET['job_id']) : '';
if ($jobId === '') {
	abort_with_message('job_id パラメータが必要です。');
}

try {
	$nonce = bin2hex(random_bytes(16));
} catch (Throwable $e) {
	abort_with_message('nonce の生成に失敗しました。', 500);
}

$statePayload = [
	'job_id' => $jobId,
	'nonce'  => $nonce,
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
	'scope'         => 'openid',
	'bot_prompt'    => 'normal',
], '', '&', PHP_QUERY_RFC3986);

$authorizeUrl = 'https://access.line.me/oauth2/v2.1/authorize?' . $query;

header('Location: ' . $authorizeUrl);
exit;
