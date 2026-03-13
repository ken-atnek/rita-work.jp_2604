<?php
/*
 * [RITA WORK.JP]
 *  - 求人詳細導線用 -
 *  応募完了ページ / LINE Login 完了処理
 *
 * [初版]
 *  2026.03.13
 */

declare(strict_types=1);

define('LINE_ENTRY_ENV_CHANNEL_ID', 'RITA_LINE_LOGIN_CHANNEL_ID');
define('LINE_ENTRY_ENV_CHANNEL_SECRET', 'RITA_LINE_LOGIN_CHANNEL_SECRET');
define('LINE_ENTRY_ENV_REDIRECT_URI', 'RITA_LINE_ENTRY_COMPLETE_REDIRECT_URI');
define('LINE_ENTRY_ENV_STATE_SIGNING_KEY', 'RITA_LINE_ENTRY_STATE_SIGNING_KEY');
define('LINE_ENTRY_APPLICATIONS_TABLE', getenv('RITA_DB_TABLE_APPLICATIONS') ?: 'applications');

require_cms_config('common/define.php');
require_cms_config('common/set_function.php');
require_cms_config('database/set_db.php');
require_cms_config('database/db_jobs.php');
require_cms_config('database/db_facilities.php');

$runtimeConfig = load_runtime_config();

$error = isset($_GET['error']) ? trim((string) $_GET['error']) : '';
$code = isset($_GET['code']) ? trim((string) $_GET['code']) : '';
$state = isset($_GET['state']) ? trim((string) $_GET['state']) : '';
$routeCodeQuery = isset($_GET['route_code']) ? trim((string) $_GET['route_code']) : '';

if ($error !== '') {
	$errorDescription = isset($_GET['error_description']) ? trim((string) $_GET['error_description']) : 'unknown error';
	fail_error('LINE error: ' . $error . ' (' . $errorDescription . ')', [
		'title' => 'LINEログインでエラーが発生しました',
		'message' => '時間をおいて再度お試しください。',
	]);
}

if ($code === '' && $state === '') {
	$routeCode = validate_route_code($routeCodeQuery);
	redirect_to_line_login($routeCode, $runtimeConfig);
}

if ($code === '' || $state === '') {
	fail_error('callback parameters missing: code/state', [
		'title' => '応募完了ページを表示できません',
		'message' => '必要な情報が不足しています。',
	]);
}

$statePayload = decode_state_payload($state, $runtimeConfig['state_signing_key']);
$routeCode = validate_route_code((string) ($statePayload['route_code'] ?? ''));

$tokenResponse = request_access_token($code, $runtimeConfig);
if ($tokenResponse === null) {
	fail_error('access token request failed', [
		'title' => 'LINEログイン情報を取得できませんでした',
		'message' => '時間をおいて再度お試しください。',
	]);
}

$idToken = isset($tokenResponse['id_token']) ? (string) $tokenResponse['id_token'] : '';
$idTokenPayload = decode_id_token_payload($idToken);
if ($idTokenPayload === null) {
	fail_error('id_token payload decode failed', [
		'title' => '応募者情報を取得できませんでした',
		'message' => 'LINEユーザー情報の取得に失敗しました。',
	]);
}

validate_id_token_payload($idTokenPayload, $statePayload, $runtimeConfig);

$lineUserId = extract_line_user_id_from_payload($idTokenPayload);
if ($lineUserId === null || $lineUserId === '') {
	fail_error('line_user_id missing in id_token.sub', [
		'title' => '応募者情報を取得できませんでした',
		'message' => 'LINEユーザー情報の取得に失敗しました。',
	]);
}

$accessToken = isset($tokenResponse['access_token']) ? (string) $tokenResponse['access_token'] : '';
$profile = ($accessToken !== '') ? request_line_profile($accessToken) : null;
$profileUserId = is_array($profile) && isset($profile['userId']) ? trim((string) $profile['userId']) : '';
if (!is_array($profile) || $profileUserId === '') {
	fail_error('profile.userId could not be retrieved', [
		'title' => '応募者情報を取得できませんでした',
		'message' => 'LINEユーザー情報の取得に失敗しました。',
	]);
}

$lineUserId = resolve_line_user_id($idTokenPayload, $profileUserId);
$lineDisplayName = is_array($profile) && isset($profile['displayName']) ? trim((string) $profile['displayName']) : '';

$pdo = get_cms_pdo();
if (!($pdo instanceof PDO)) {
	fail_error('database connection unavailable before job lookup', [
		'title' => '応募情報を保存できませんでした',
		'message' => 'データベースに接続できません。',
	]);
}

$job = find_job_by_route_code($routeCode);
if ($job === null) {
	fail_invalid('job not found by route_code: ' . $routeCode, [
		'title' => '対象の求人が見つかりませんでした',
		'message' => '求人情報を確認できなかったため、応募を完了できませんでした。',
	]);
}

$facility = find_facility_by_id((int) ($job['facility_id'] ?? 0));
if ($facility === null) {
	fail_error('facility not found: facility_id=' . (string) ($job['facility_id'] ?? ''), [
		'title' => '事業所情報を取得できませんでした',
		'message' => '応募先情報の取得に失敗しました。',
	]);
}

try {
	$saveResult = save_completed_application($pdo, $job, $facility, $routeCode, $lineUserId, $lineDisplayName);
	if ($saveResult['status'] === 'duplicate') {
		render_result_page('duplicate', [
			'title' => 'すでに応募済みです',
			'message' => '担当よりの連絡をお待ちください。',
			'jobTitle' => (string) ($job['card_title'] ?? ''),
		]);
	}

	after_application_saved([
		'route_code' => $routeCode,
		'job_id' => (int) $job['job_id'],
		'facility_id' => (int) $facility['facility_id'],
		'corporation_id' => isset($facility['corporation_id']) ? (int) $facility['corporation_id'] : 0,
		'line_user_id' => $lineUserId,
	]);

	render_result_page('success', [
		'title' => 'ご応募ありがとうございました',
		'message' => '担当よりご連絡いたしますので、しばらくお待ちください。',
		'jobTitle' => (string) ($job['card_title'] ?? ''),
	]);
} catch (Throwable $e) {
	fail_error('応募完了処理エラー: ' . $e->getMessage(), [
		'title' => '応募情報を保存できませんでした',
		'message' => '時間をおいて再度お試しください。',
	]);
}

function require_cms_config(string $relativePath): void
{
	$normalized = str_replace('\\', '/', $relativePath);
	$candidates = [
		__DIR__ . '/../../../../../../cms-panel/cms_config/' . $normalized,
		__DIR__ . '/../../../../../../public_html/cms-panel/cms_config/' . $normalized,
		__DIR__ . '/../../../../../../rita-work.jp/public_html/cms-panel/cms_config/' . $normalized,
		__DIR__ . '/../../../../../../../rita-work.jp/public_html/cms-panel/cms_config/' . $normalized,
	];

	foreach ($candidates as $candidate) {
		if (is_file($candidate)) {
			require_once $candidate;
			return;
		}
	}

	throw new RuntimeException('cms-panel の設定ファイルが見つかりません: ' . $relativePath);
}

function debug_log(string $message): void
{
	$dateDir = date('Y/m/d');
	$todayDir = __DIR__ . '/' . $dateDir;
	if (!is_dir($todayDir)) {
		@mkdir($todayDir, 0755, true);
	}
	$logFile = $todayDir . '/line_entry_complete.log';
	$line = '[' . date('Y-m-d H:i:s') . '] ' . $message . PHP_EOL;
	file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

function load_runtime_config(): array
{
	$requiredEnvMap = [
		'channel_id' => LINE_ENTRY_ENV_CHANNEL_ID,
		'channel_secret' => LINE_ENTRY_ENV_CHANNEL_SECRET,
		'redirect_uri' => LINE_ENTRY_ENV_REDIRECT_URI,
	];
	$config = [];
	$missing = [];

	foreach ($requiredEnvMap as $key => $envName) {
		$value = trim((string) getenv($envName));
		if ($value === '') {
			$missing[] = $envName;
			continue;
		}

		$config[$key] = $value;
	}

	if ($missing !== []) {
		fail_error('required env missing: ' . implode(', ', $missing), [
			'title' => '応募完了ページを表示できません',
			'message' => '現在この応募完了導線を利用できません。時間をおいて再度お試しください。',
		]);
	}

	$stateSigningKey = trim((string) getenv(LINE_ENTRY_ENV_STATE_SIGNING_KEY));
	$config['state_signing_key'] = ($stateSigningKey !== '') ? $stateSigningKey : $config['channel_secret'];

	return $config;
}

function fail_invalid(string $logMessage, array $pageData): never
{
	debug_log('INVALID: ' . $logMessage);
	render_result_page('invalid', $pageData);
}

function fail_error(string $logMessage, array $pageData): never
{
	debug_log('ERROR: ' . $logMessage);
	render_result_page('error', $pageData);
}

function validate_route_code(string $value): string
{
	$routeCode = trim($value);
	if ($routeCode === '' || !preg_match('/^[0-9]+$/', $routeCode)) {
		fail_invalid('route_code invalid: ' . $value, [
			'title' => '応募完了ページを表示できません',
			'message' => 'route_code が不正です。',
		]);
	}

	return $routeCode;
}

function redirect_to_line_login(string $routeCode, array $runtimeConfig): never
{
	try {
		$nonce = bin2hex(random_bytes(16));
	} catch (Throwable $e) {
		fail_error('nonce generation failed: ' . $e->getMessage(), [
			'title' => 'LINEログインを開始できませんでした',
			'message' => '時間をおいて再度お試しください。',
		]);
	}

	$statePayload = [
		'route_code' => $routeCode,
		'nonce' => $nonce,
		'flow' => 'line_entry_complete',
	];
	$statePayload['sig'] = sign_state_payload($statePayload);
	$stateJson = json_encode($statePayload, JSON_UNESCAPED_UNICODE);
	if ($stateJson === false) {
		fail_error('state JSON encode failed', [
			'title' => 'LINEログインを開始できませんでした',
			'message' => 'state のエンコードに失敗しました。',
		]);
	}

	// 友だち追加は Lステップ流入時点で完了済みのため、complete 導線では bot_prompt を付与しない。
	$query = http_build_query([
		'response_type' => 'code',
		'client_id' => $runtimeConfig['channel_id'],
		'redirect_uri' => $runtimeConfig['redirect_uri'],
		'state' => base64_encode($stateJson),
		'scope' => 'openid profile',
		'nonce' => $nonce,
	], '', '&', PHP_QUERY_RFC3986);

	header('Location: https://access.line.me/oauth2/v2.1/authorize?' . $query);
	exit;
}

function decode_state_payload(string $state, string $stateSigningKey): array
{
	$stateJson = base64_decode($state, true);
	if ($stateJson === false) {
		fail_error('state base64 decode failed', [
			'title' => '応募完了ページを表示できません',
			'message' => 'state の解析に失敗しました。',
		]);
	}

	$payload = json_decode($stateJson, true);
	if (!is_array($payload) || !isset($payload['nonce']) || !isset($payload['sig'])) {
		fail_error('state payload invalid: ' . $stateJson, [
			'title' => '応募完了ページを表示できません',
			'message' => 'state が不正です。',
		]);
	}

	$signature = (string) $payload['sig'];
	unset($payload['sig']);
	if (!hash_equals(sign_state_payload($payload, $stateSigningKey), $signature)) {
		fail_error('state signature mismatch', [
			'title' => '応募完了ページを表示できません',
			'message' => 'state の署名検証に失敗しました。',
		]);
	}

	return $payload;
}

function sign_state_payload(array $payload, ?string $stateSigningKey = null): string
{
	ksort($payload);
	$json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	if ($json === false) {
		return '';
	}

	$signingKey = ($stateSigningKey !== null && $stateSigningKey !== '')
		? $stateSigningKey
		: trim((string) getenv(LINE_ENTRY_ENV_STATE_SIGNING_KEY));
	if ($signingKey === '') {
		$signingKey = trim((string) getenv(LINE_ENTRY_ENV_CHANNEL_SECRET));
	}

	return hash_hmac('sha256', $json, $signingKey);
}

function request_access_token(string $code, array $runtimeConfig): ?array
{
	$postData = http_build_query([
		'grant_type' => 'authorization_code',
		'code' => $code,
		'redirect_uri' => $runtimeConfig['redirect_uri'],
		'client_id' => $runtimeConfig['channel_id'],
		'client_secret' => $runtimeConfig['channel_secret'],
	], '', '&', PHP_QUERY_RFC3986);

	$ch = curl_init('https://api.line.me/oauth2/v2.1/token');
	curl_setopt_array($ch, [
		CURLOPT_POST => true,
		CURLOPT_POSTFIELDS => $postData,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
	]);

	$responseBody = curl_exec($ch);
	$statusCode = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
	if ($responseBody === false) {
		debug_log('token API cURL error: ' . curl_error($ch));
	}
	curl_close($ch);

	if ($responseBody === false || $statusCode !== 200) {
		debug_log('token API error: status=' . $statusCode . ', body=' . ($responseBody ?: ''));
		return null;
	}

	$json = json_decode($responseBody, true);
	return is_array($json) ? $json : null;
}

function request_line_profile(string $accessToken): ?array
{
	$ch = curl_init('https://api.line.me/v2/profile');
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $accessToken],
	]);

	$responseBody = curl_exec($ch);
	$statusCode = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
	if ($responseBody === false) {
		debug_log('profile API cURL error: ' . curl_error($ch));
	}
	curl_close($ch);

	if ($responseBody === false || $statusCode !== 200) {
		debug_log('profile API error: status=' . $statusCode . ', body=' . ($responseBody ?: ''));
		return null;
	}

	$json = json_decode($responseBody, true);
	return is_array($json) ? $json : null;
}

function decode_id_token_payload(string $idToken): ?array
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

	return $payloadData;
}

function validate_id_token_payload(array $idTokenPayload, array $statePayload, array $runtimeConfig): void
{
	$expectedNonce = isset($statePayload['nonce']) ? trim((string) $statePayload['nonce']) : '';
	$actualNonce = isset($idTokenPayload['nonce']) ? trim((string) $idTokenPayload['nonce']) : '';
	if ($expectedNonce === '' || $actualNonce === '' || !hash_equals($expectedNonce, $actualNonce)) {
		fail_error('id_token nonce mismatch: expected=' . $expectedNonce . ', actual=' . $actualNonce, [
			'title' => '応募者情報を取得できませんでした',
			'message' => 'LINEユーザー情報の取得に失敗しました。',
		]);
	}

	$audience = $idTokenPayload['aud'] ?? null;
	if (!matches_expected_audience($audience, $runtimeConfig['channel_id'])) {
		fail_error('id_token aud mismatch', [
			'title' => '応募者情報を取得できませんでした',
			'message' => 'LINEユーザー情報の取得に失敗しました。',
		]);
	}
}

function matches_expected_audience($audience, string $expectedAudience): bool
{
	if (is_string($audience)) {
		return hash_equals(trim($audience), $expectedAudience);
	}

	if (is_array($audience)) {
		foreach ($audience as $value) {
			if (is_string($value) && hash_equals(trim($value), $expectedAudience)) {
				return true;
			}
		}
	}

	return false;
}

function extract_line_user_id_from_payload(array $idTokenPayload): ?string
{
	$lineUserId = isset($idTokenPayload['sub']) ? trim((string) $idTokenPayload['sub']) : '';
	return ($lineUserId === '') ? null : $lineUserId;
}

function resolve_line_user_id(array $idTokenPayload, string $profileUserId): string
{
	$idTokenUserId = extract_line_user_id_from_payload($idTokenPayload);
	if ($idTokenUserId === null || $idTokenUserId === '') {
		fail_error('id_token.sub missing while resolving line_user_id', [
			'title' => '応募者情報を取得できませんでした',
			'message' => 'LINEユーザー情報の取得に失敗しました。',
		]);
	}

	if (!hash_equals($idTokenUserId, $profileUserId)) {
		fail_error('profile.userId and id_token.sub mismatch: profile=' . $profileUserId . ', sub=' . $idTokenUserId, [
			'title' => '応募者情報を取得できませんでした',
			'message' => 'LINEユーザー情報の整合確認に失敗しました。',
		]);
	}

	return $idTokenUserId;
}

function base64url_decode(string $input): ?string
{
	$remainder = strlen($input) % 4;
	if ($remainder > 0) {
		$input .= str_repeat('=', 4 - $remainder);
	}

	$decoded = base64_decode(strtr($input, '-_', '+/'), true);
	return ($decoded === false) ? null : $decoded;
}

function get_cms_pdo(): ?PDO
{
	if (isset($GLOBALS['DB_CONNECT']) && $GLOBALS['DB_CONNECT'] instanceof PDO) {
		return $GLOBALS['DB_CONNECT'];
	}

	if (function_exists('db_connect')) {
		try {
			$pdo = call_user_func('db_connect');
			if ($pdo instanceof PDO) {
				$GLOBALS['DB_CONNECT'] = $pdo;
				return $pdo;
			}
		} catch (Throwable $e) {
			debug_log('db_connect() に失敗: ' . $e->getMessage());
		}
	}

	return null;
}

function find_job_by_route_code(string $routeCode): ?array
{
	$jobId = (int) $routeCode;
	if ($jobId <= 0 || !function_exists('getJob_FindById')) {
		return null;
	}

	$job = call_user_func('getJob_FindById', $jobId);
	return is_array($job) ? $job : null;
}

function find_facility_by_id(int $facilityId): ?array
{
	if ($facilityId <= 0 || !function_exists('getFacility_FindById')) {
		return null;
	}

	$facility = call_user_func('getFacility_FindById', $facilityId);
	return is_array($facility) ? $facility : null;
}

function save_completed_application(PDO $pdo, array $job, array $facility, string $routeCode, string $lineUserId, string $lineDisplayName): array
{
	$sql = 'INSERT INTO ' . LINE_ENTRY_APPLICATIONS_TABLE . ' ('
		. 'job_id, job_category_id, facility_id, corporation_id, line_user_id, line_display_name, applicant_name, desired_job_type, status, interview_at, memo, created_at, updated_at, entry_source_type, entry_route_code, received_via'
		. ') VALUES ('
		. ':job_id, :job_category_id, :facility_id, :corporation_id, :line_user_id, :line_display_name, :applicant_name, :desired_job_type, :status, :interview_at, :memo, :created_at, :updated_at, :entry_source_type, :entry_route_code, :received_via'
		. ')';

	$now = date('Y-m-d H:i:s');

	try {
		$stmt = $pdo->prepare($sql);
		$stmt->execute([
			':job_id' => (int) $job['job_id'],
			':job_category_id' => nullable_string((string) ($job['job_category_id'] ?? '')),
			':facility_id' => (int) $facility['facility_id'],
			':corporation_id' => isset($facility['corporation_id']) ? (int) $facility['corporation_id'] : null,
			':line_user_id' => $lineUserId,
			':line_display_name' => nullable_string($lineDisplayName),
			':applicant_name' => null,
			':desired_job_type' => null,
			':status' => 'registered',
			':interview_at' => null,
			':memo' => null,
			':created_at' => $now,
			':updated_at' => $now,
			':entry_source_type' => 'lstep_route',
			':entry_route_code' => $routeCode,
			':received_via' => 'line_login_complete',
		]);

		return ['status' => 'success'];
	} catch (PDOException $e) {
		if ((string) $e->getCode() === '23000') {
			debug_log('duplicate application (job_id, line_user_id): ' . $e->getMessage());
			return ['status' => 'duplicate'];
		}

		throw $e;
	}
}

function nullable_string(string $value): ?string
{
	$value = trim($value);
	return ($value === '') ? null : $value;
}

function after_application_saved(array $context): void
{
	unset($context);
}

function render_result_page(string $variant, array $data): never
{
	$title = isset($data['title']) ? (string) $data['title'] : '応募完了';
	$message = isset($data['message']) ? (string) $data['message'] : '';
	$detail = isset($data['detail']) ? (string) $data['detail'] : '';
	$jobTitle = isset($data['jobTitle']) ? (string) $data['jobTitle'] : '';
	$routeCode = isset($data['routeCode']) ? (string) $data['routeCode'] : '';

	$accent = '#f29400';
	if ($variant === 'duplicate') {
		$accent = '#6b7280';
	}
	if ($variant === 'invalid') {
		$accent = '#b45309';
	}
	if ($variant === 'error') {
		$accent = '#c2410c';
	}

	http_response_code(($variant === 'success' || $variant === 'duplicate') ? 200 : 400);
	header('Content-Type: text/html; charset=UTF-8');

	echo '<!doctype html>';
	echo '<html lang="ja">';
	echo '<head>';
	echo '<meta charset="UTF-8">';
	echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
	echo '<title>' . escape_html($title) . '｜リタワーク</title>';
	echo '<style>';
	echo 'body{margin:0;font-family:"Noto Sans JP",sans-serif;background:#fffbf4;color:#1f2937;}';
	echo '.wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;}';
	echo '.card{width:min(720px,100%);background:#fff;border-radius:24px;box-shadow:0 20px 60px rgba(15,23,42,.12);padding:40px 32px;}';
	echo '.label{display:inline-block;padding:8px 14px;border-radius:999px;font-size:14px;font-weight:700;color:#fff;background:' . escape_html($accent) . ';}';
	echo 'h1{margin:20px 0 0;font-size:32px;line-height:1.4;}';
	echo 'p{margin:16px 0 0;font-size:16px;line-height:1.8;}';
	echo '.note{margin-top:24px;padding-top:24px;border-top:1px solid #e5e7eb;}';
	echo '.links{margin-top:32px;display:flex;gap:12px;flex-wrap:wrap;}';
	echo '.links a{display:inline-flex;align-items:center;justify-content:center;padding:14px 18px;border-radius:999px;text-decoration:none;font-weight:700;}';
	echo '.primary{background:' . escape_html($accent) . ';color:#fff;}';
	echo '.secondary{background:#f3f4f6;color:#111827;}';
	echo '@media (max-width:767px){.card{padding:32px 20px;border-radius:20px;}h1{font-size:24px;}}';
	echo '</style>';
	echo '</head>';
	echo '<body>';
	echo '<div class="wrap"><section class="card">';
	echo '<span class="label">LINE応募</span>';
	echo '<h1>' . escape_html($title) . '</h1>';
	if ($jobTitle !== '') {
		echo '<p>対象求人: ' . escape_html($jobTitle) . '</p>';
	}
	echo '<p>' . nl2br(escape_html($message)) . '</p>';
	if ($detail !== '') {
		echo '<p class="note">詳細: ' . escape_html($detail) . '</p>';
	}
	if ($routeCode !== '') {
		echo '<p class="note">route_code: ' . escape_html($routeCode) . '</p>';
	}
	echo '<div class="links">';
	echo '<a class="primary" href="/jobs/">求人一覧へ戻る</a>';
	echo '<a class="secondary" href="/">トップへ戻る</a>';
	echo '</div>';
	echo '</section></div>';
	echo '</body>';
	echo '</html>';
	exit;
}

function escape_html(string $value): string
{
	return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
