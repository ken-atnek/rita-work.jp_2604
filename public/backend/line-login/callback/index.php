<?php
/*
 * [RITA WORK.JP]
 *  - 【フロントエンド】LINEで相談 -
 *  LINEログイン callback エンドポイント
 *
 * [初版]
 *  2025.12.26
 */

declare(strict_types=1);

#NOTE: PHP側は Next.js の .env.production を自動では読みません。
#切替はサーバー側の環境変数（Apacheなら SetEnv 等）で行う想定です。
define('LINE_LOGIN_CHANNEL_ID', getenv('RITA_LINE_LOGIN_CHANNEL_ID') ?: '');
define('LINE_LOGIN_CHANNEL_SECRET', getenv('RITA_LINE_LOGIN_CHANNEL_SECRET') ?: '');
define('LINE_LOGIN_REDIRECT_URI', getenv('RITA_LINE_LOGIN_REDIRECT_URI') ?: '');
#友だち追加（公式アカウント）は LINE Login のチャンネルとは別物なので、URLを明示的に切替できるようにする
define('LINE_ADD_FRIEND_URL', getenv('RITA_LINE_ADD_FRIEND_URL') ?: '');

#***** 定数定義ファイル：インクルード *****#
require_once __DIR__ . '/../../../../../../rita-work.jp/public_html/cms-panel/cms_config/common/define.php';
#***** 定数・関数宣言ファイル：インクルード *****#
require_once __DIR__ . '/../../../../../../rita-work.jp/public_html/cms-panel/cms_config/common/set_function.php';
#***** DB設定ファイル：インクルード *****#
require_once __DIR__ . '/../../../../../../rita-work.jp/public_html/cms-panel/cms_config/database/set_db.php';
#***** ★ DBテーブル読み書きファイル：インクルード ★ *****#
#法人情報
require_once __DIR__ . '/../../../../../../rita-work.jp/public_html/cms-panel/cms_config/database/db_corporations.php';
#事業所情報
require_once __DIR__ . '/../../../../../../rita-work.jp/public_html/cms-panel/cms_config/database/db_facilities.php';
#求人カード情報
require_once __DIR__ . '/../../../../../../rita-work.jp/public_html/cms-panel/cms_config/database/db_jobs.php';

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
if (!is_array($statePayload) || !isset($statePayload['nonce'])) {
	debug_log('state JSON が不正: ' . $stateJson);
	abort_with_message('state が不正です。', 400);
}
$jobId = isset($statePayload['job_id']) ? (string) $statePayload['job_id'] : '';
$nonce = (string) $statePayload['nonce'];
$flow = isset($statePayload['flow']) ? (string) $statePayload['flow'] : '';
debug_log('state decoded: job_id=' . $jobId . ', nonce=' . $nonce);
$tokenResponse = request_access_token($code);
if ($tokenResponse === null) {
	abort_with_message('トークンの取得に失敗しました。', 500);
}
$accessToken = $tokenResponse['access_token'] ?? '';
#LINEプロフィール（ニックネーム等）取得
$profile = null;
if ($accessToken !== '') {
	$profile = request_line_profile($accessToken);
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
$lineNickname = is_array($profile) && isset($profile['displayName']) ? (string) $profile['displayName'] : '';
$profileUserId = is_array($profile) && isset($profile['userId']) ? (string) $profile['userId'] : '';
if ($profileUserId !== '' && $profileUserId !== $lineUserId) {
	debug_log('WARN: profile.userId と id_token.sub が不一致: profile=' . $profileUserId . ', sub=' . $lineUserId);
}
debug_log('LINE user authenticated: job_id=' . $jobId . ', line_user_id=' . $lineUserId . ', nickname=' . $lineNickname);
#求人がある場合のみ事業者情報を取得（cms_config 側のDBアクセス関数を利用）
$business = null;
if (trim($jobId) !== '') {
	#※ 事業所コードは callback では受け取らず、求人カード情報の facility_id から取得する
	$business = load_business_info_by_codes_from_cms($jobId);
	if ($business === null) {
		#保険：DB取得に失敗した場合のみ、従来の public/db 参照へフォールバック
		$business = load_business_info_by_job_id($jobId);
		if ($business !== null) {
			debug_log('INFO: 事業者情報を public/db からフォールバック取得しました job_id=' . $jobId);
		}
	}
	if ($business === null) {
		debug_log('WARN: 事業者情報の取得に失敗 job_id=' . $jobId);
	}
} else {
	debug_log('INFO: job_id なし（友だち登録のみ）として処理します');
}
#DB登録（未設定の場合はログ保存で代替）
$now = date('Y-m-d H:i:s');
$jobIdNum = null;
$facilityIdNum = null;
$corpIdNum = null;
$jobCategoryId = '';
if (is_array($business)) {
	$jobIdNum = (int) pick_first_string(is_array($business['job'] ?? null) ? $business['job'] : [], ['job_id', 'id']);
	$facilityIdNum = (int) pick_first_string(is_array($business['facility'] ?? null) ? $business['facility'] : [], ['facility_id', 'id']);
	$corpIdNum = (int) pick_first_string(is_array($business['facility'] ?? null) ? $business['facility'] : [], ['corporation_id']);
	$jobCategoryId = pick_first_string(is_array($business['job'] ?? null) ? $business['job'] : [], ['job_category_id', 'jobCategoryId']);
	if ($jobIdNum === 0) $jobIdNum = null;
	if ($facilityIdNum === 0) $facilityIdNum = null;
	if ($corpIdNum === 0) $corpIdNum = null;
}
$status = ($jobIdNum === null ? 'friend_only' : 'applied');
$applicationRow = [
	'job_id' => $jobIdNum,
	'job_category_id' => ($jobCategoryId !== '' ? $jobCategoryId : null),
	'facility_id' => $facilityIdNum,
	'corporation_id' => $corpIdNum,
	'line_user_id' => $lineUserId,
	'line_display_name' => ($lineNickname !== '' ? $lineNickname : null),
	'applicant_name' => null,
	'status' => $status,
	'interview_at' => null,
	'memo' => null,
	'created_at' => $now,
	'updated_at' => $now,
];
#デバッグ用：生データもログに残す（DB未設定の際はJSONLへ保存される）
$record = [
	'application' => $applicationRow,
	'nonce' => $nonce,
	'flow' => $flow,
	'profile' => $profile,
	'business' => $business,
];
if (!save_application_record($applicationRow, $record)) {
	debug_log('WARN: 応募データの保存に失敗（ログ保存含む）');
}
$lineRedirectUrl = LINE_ADD_FRIEND_URL;
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
function request_line_profile(string $accessToken): ?array
{
	$ch = curl_init('https://api.line.me/v2/profile');
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $accessToken],
	]);
	$responseBody = curl_exec($ch);
	$statusCode   = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
	if ($responseBody === false) {
		debug_log('profile API cURL error: ' . curl_error($ch));
	}
	curl_close($ch);
	if ($responseBody === false || $statusCode !== 200) {
		debug_log('profile API error: status=' . $statusCode . ', body=' . ($responseBody ?: ''));
		return null;
	}
	$json = json_decode($responseBody, true);
	if (!is_array($json)) {
		debug_log('profile API JSON decode failed: ' . $responseBody);
		return null;
	}
	return $json;
}
function load_business_info_by_job_id(string $jobId): ?array
{
	$publicDir = realpath(__DIR__ . '/../../..');
	if ($publicDir === false) {
		debug_log('publicDir の解決に失敗');
		return null;
	}
	$detailsListPath = $publicDir . '/db/details_list.json';
	$detailsList = load_json_file($detailsListPath);
	if (!is_array($detailsList)) {
		debug_log('details_list.json の読み込みに失敗: ' . $detailsListPath);
		return null;
	}
	$target = null;
	foreach ($detailsList as $item) {
		if (is_array($item) && ($item['jobId'] ?? '') === $jobId) {
			$target = $item;
			break;
		}
	}
	if (!is_array($target) || !isset($target['path'], $target['facilityId'])) {
		debug_log('details_list に jobId が見つかりません: ' . $jobId);
		return null;
	}
	$jobJsonPath = $publicDir . '/' . ltrim((string) $target['path'], '/');
	$job = load_json_file($jobJsonPath);
	if (!is_array($job)) {
		debug_log('job json の読み込みに失敗: ' . $jobJsonPath);
		return null;
	}
	$facilityId = (string) ($job['facilityId'] ?? $target['facilityId']);
	$facilityPath = $publicDir . '/db/facilities/' . $facilityId . '/facility.json';
	$facility = load_json_file($facilityPath);
	$corpId = is_array($facility) ? (string) ($facility['corporationId'] ?? '') : '';
	$corp = null;
	if ($corpId !== '') {
		$corpsPath = $publicDir . '/db/master/corporations.json';
		$corps = load_json_file($corpsPath);
		if (is_array($corps)) {
			foreach ($corps as $c) {
				if (is_array($c) && ($c['id'] ?? '') === $corpId) {
					$corp = $c;
					break;
				}
			}
		}
	}
	return [
		'job' => $job,
		'facility' => $facility,
		'corporation' => $corp,
	];
}
function load_json_file(string $path): mixed
{
	if (!is_file($path)) {
		return null;
	}
	$raw = file_get_contents($path);
	if ($raw === false) {
		return null;
	}
	return json_decode($raw, true);
}
function get_cms_pdo(): ?PDO
{
	#set_db.php が $DB_CONNECT を生成しているので、それをそのまま使う
	if (isset($GLOBALS['DB_CONNECT']) && $GLOBALS['DB_CONNECT'] instanceof PDO) {
		return $GLOBALS['DB_CONNECT'];
	}
	#念のため：未生成なら set_db.php の db_connect() を使って生成
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
	debug_log('DB_CONNECT が取得できません（set_db.php の読み込み/初期化を確認してください）');
	return null;
}
function pick_first_string(array $row, array $keys): string
{
	foreach ($keys as $k) {
		if (array_key_exists($k, $row) && $row[$k] !== null) {
			return (string) $row[$k];
		}
	}
	return '';
}
function load_business_info_by_codes_from_cms(string $jobCode): ?array
{
	$job = null;
	if ($jobCode !== '' && function_exists('getJob_FindByCode')) {
		$job = call_user_func('getJob_FindByCode', $jobCode);
	}
	if (!is_array($job)) {
		debug_log('求人カード情報の取得に失敗: job_code=' . $jobCode);
		return null;
	}
	#事業所情報は求人カード情報の facility_id を使って取得
	$facilityId = (int) pick_first_string($job, ['facility_id', 'facilityId']);
	if ($facilityId <= 0 || !function_exists('getFacility_FindById')) {
		debug_log('facility_id が取得できない、または getFacility_FindById が存在しません: facility_id=' . $facilityId);
		return null;
	}
	$facility = call_user_func('getFacility_FindById', $facilityId);
	if (!is_array($facility)) {
		debug_log('事業所情報の取得に失敗: facility_id=' . $facilityId);
		return null;
	}
	#法人IDは事業所情報から取得して、getCorporations_FindById_Code() で取得
	$corpId = (int) pick_first_string($facility, ['corporation_id']);
	$corporation = null;
	if ($corpId > 0 && function_exists('getCorporations_FindById_Code')) {
		$corporation = call_user_func('getCorporations_FindById_Code', $corpId);
	}
	if ($corpId > 0 && !is_array($corporation)) {
		debug_log('法人情報の取得に失敗: corporation_id=' . $corpId);
	}
	return [
		'job' => $job,
		'facility' => $facility,
		'corporation' => $corporation,
		'codes' => [
			'job_code' => $jobCode,
		],
	];
}
function save_application_record(array $applicationRow, array $recordForLog): bool
{
	# 1) DBが設定されていればDBへ。未設定ならログ(JSONL)に保存。
	$table = getenv('RITA_DB_TABLE') ?: 'applications';
	$pdo = get_cms_pdo();
	if ($pdo instanceof PDO) {
		try {
			#applications テーブルへINSERT（重複応募は UNIQUE(job_id, line_user_id) を想定）
			$sql = "INSERT INTO {$table} (job_id, job_category_id, facility_id, corporation_id, line_user_id, line_display_name, applicant_name, status, interview_at, memo, created_at, updated_at)
				VALUES (:job_id, :job_category_id, :facility_id, :corporation_id, :line_user_id, :line_display_name, :applicant_name, :status, :interview_at, :memo, :created_at, :updated_at)";
			$stmt = $pdo->prepare($sql);
			$stmt->execute([
				':job_id' => $applicationRow['job_id'],
				':job_category_id' => $applicationRow['job_category_id'],
				':facility_id' => $applicationRow['facility_id'],
				':corporation_id' => $applicationRow['corporation_id'],
				':line_user_id' => $applicationRow['line_user_id'],
				':line_display_name' => $applicationRow['line_display_name'],
				':applicant_name' => $applicationRow['applicant_name'],
				':status' => $applicationRow['status'],
				':interview_at' => $applicationRow['interview_at'],
				':memo' => $applicationRow['memo'],
				':created_at' => $applicationRow['created_at'],
				':updated_at' => $applicationRow['updated_at'],
			]);
			return true;
		} catch (PDOException $e) {
			# 2回目以降の応募（Duplicate entry）は「新規応募扱いにしない」＝成功扱い
			if ($e->getCode() === '23000') {
				debug_log('duplicate application (job_id, line_user_id): ' . $e->getMessage());
				return true;
			}
			debug_log('DB保存失敗(PDO): ' . $e->getMessage());
			#DBが落ちていてもログ保存へフォールバック
		} catch (Throwable $e) {
			debug_log('DB保存失敗: ' . $e->getMessage());
			#DBが落ちていてもログ保存へフォールバック
		}
	}
	$dateDir = date('Y/m/d', time());
	$todayDir = __DIR__ . '/' . $dateDir;
	if (!is_dir($todayDir)) {
		@mkdir($todayDir, 0755, true);
	}
	$logFile = $todayDir . '/applications.jsonl';
	$line = json_encode($recordForLog, JSON_UNESCAPED_UNICODE) . PHP_EOL;
	return file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX) !== false;
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
