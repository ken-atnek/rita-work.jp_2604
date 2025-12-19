<?php
// LINEログイン callback エンドポイント

declare(strict_types=1);

const LINE_LOGIN_CHANNEL_ID = '';
const LINE_LOGIN_CHANNEL_SECRET = '';
const LINE_LOGIN_REDIRECT_URI = 'https://rita5258.xbiz.jp/backend/line-login/callback/';

function debug_log(string $message): void
{
	$dateDir = date('Y/m/d', time());
	$todayDir = __DIR__ . '/' . $dateDir;
	#ディレクトリが存在しない場合は作成
	if (!is_dir($todayDir)) {
		@mkdir($todayDir, 0755, true);
	}
	$logFile = $todayDir . '/line_login_debug.log';
	$line = '[' . date('Y-m-d H:i:s') . '] ' . $message . PHP_EOL;
	file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

function abort_with_message(string $message, int $statusCode = 400): never
{
	http_response_code($statusCode);
	header('Content-Type: text/plain; charset=UTF-8');
	echo $message;
	exit;
}

$error = $_GET['error'] ?? null;
if ($error !== null) {
	$errorDescription = $_GET['error_description'] ?? 'unknown error';
	debug_log("LINE error: {$error} ({$errorDescription})");
	abort_with_message('LINEログインでエラーが発生しました: ' . $errorDescription, 400);
}

$code = $_GET['code'] ?? '';
$state = $_GET['state'] ?? '';
if ($code === '' || $state === '') {
	abort_with_message('code または state が不足しています。', 400);
}

$stateJson = base64_decode($state, true);
if ($stateJson === false) {
	debug_log('state の base64 デコードに失敗');
	abort_with_message('state の解析に失敗しました。', 400);
}

$statePayload = json_decode($stateJson, true);
if (!is_array($statePayload) || !isset($statePayload['job_id'], $statePayload['nonce'])) {
	debug_log('state JSON が不正: ' . $stateJson);
	abort_with_message('state が不正です。', 400);
}

$jobId = (string) $statePayload['job_id'];
$nonce = (string) $statePayload['nonce'];

debug_log('state decoded: job_id=' . $jobId . ', nonce=' . $nonce);

$tokenResponse = request_access_token($code);
if ($tokenResponse === null) {
	abort_with_message('トークンの取得に失敗しました。', 500);
}

$idToken = $tokenResponse['id_token'] ?? '';
if ($idToken === '') {
	debug_log('id_token がレスポンスに含まれていません');
	abort_with_message('id_token が取得できませんでした。', 500);
}

$lineUserId = extract_line_user_id($idToken);
if ($lineUserId === null) {
	abort_with_message('LINEユーザーIDの解析に失敗しました。', 500);
}

debug_log('LINE user authenticated: job_id=' . $jobId . ', line_user_id=' . $lineUserId);

$lineRedirectUrl = 'https://line.me/ti/p/%40842lufbc';
header('Location: ' . $lineRedirectUrl);
exit;

function request_access_token(string $code): ?array
{
	$postData = http_build_query([
		'grant_type'    => 'authorization_code',
		'code'          => $code,
		'redirect_uri'  => LINE_LOGIN_REDIRECT_URI,
		'client_id'     => LINE_LOGIN_CHANNEL_ID,
		'client_secret' => LINE_LOGIN_CHANNEL_SECRET,
	], '', '&', PHP_QUERY_RFC3986);

	$ch = curl_init('https://api.line.me/oauth2/v2.1/token');
	curl_setopt_array($ch, [
		CURLOPT_POST           => true,
		CURLOPT_POSTFIELDS     => $postData,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
	]);

	$responseBody = curl_exec($ch);
	$statusCode   = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
	if ($responseBody === false) {
		debug_log('cURL error: ' . curl_error($ch));
	}
	curl_close($ch);

	if ($responseBody === false || $statusCode !== 200) {
		debug_log('token API error: status=' . $statusCode . ', body=' . ($responseBody ?: ''));
		return null;
	}

	$json = json_decode($responseBody, true);
	if (!is_array($json)) {
		debug_log('token API JSON decode failed: ' . $responseBody);
		return null;
	}

	return $json;
}

function extract_line_user_id(string $idToken): ?string
{
	$parts = explode('.', $idToken);
	if (count($parts) !== 3) {
		debug_log('id_token format invalid');
		return null;
	}

	$payload = base64url_decode($parts[1]);
	if ($payload === null) {
		debug_log('id_token base64url decode failed');
		return null;
	}

	$payloadData = json_decode($payload, true);
	if (!is_array($payloadData) || !isset($payloadData['sub'])) {
		debug_log('id_token JSON invalid: ' . $payload);
		return null;
	}

	return (string) $payloadData['sub'];
}

function base64url_decode(string $input): ?string
{
	$remainder = strlen($input) % 4;
	if ($remainder > 0) {
		$input .= str_repeat('=', 4 - $remainder);
	}
	$decoded = base64_decode(strtr($input, '-_', '+/'), true);
	return $decoded === false ? null : $decoded;
}
