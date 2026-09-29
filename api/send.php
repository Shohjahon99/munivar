<?php
// Saytdagi ariza formasini Telegram botga yuboradi.
// Sozlash: api/config.example.php faylini api/config.php nomi bilan nusxalang va token/chat_id yozing.
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['ok' => false, 'error' => 'method']));
}

$cfgFile = __DIR__ . '/config.php';
if (!is_file($cfgFile)) {
    http_response_code(500);
    exit(json_encode(['ok' => false, 'error' => 'config']));
}
$cfg = require $cfgFile;

$in = json_decode(file_get_contents('php://input'), true) ?: [];
$clean = fn($v, $max) => mb_substr(trim(strip_tags((string)($v ?? ''))), 0, $max);

// bot-spam tuzog'i
if (!empty($in['website'])) exit(json_encode(['ok' => true]));

$name  = $clean($in['name'] ?? '', 80);
$phone = $clean($in['phone'] ?? '', 30);
$type  = $clean($in['type'] ?? '', 40);
$lang  = $clean($in['lang'] ?? '', 5);

if (mb_strlen($name) < 2 || strlen(preg_replace('/\D/', '', $phone)) < 7) {
    http_response_code(422);
    exit(json_encode(['ok' => false, 'error' => 'invalid']));
}

// oddiy cheklov: bitta IP'dan 30 soniyada 1 ta ariza
$lock = sys_get_temp_dir() . '/munivar_' . md5($_SERVER['REMOTE_ADDR'] ?? '') . '.lock';
if (is_file($lock) && time() - filemtime($lock) < 30) {
    http_response_code(429);
    exit(json_encode(['ok' => false, 'error' => 'rate']));
}
@touch($lock);

$h = fn($s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
$text = "🛍 <b>Yangi ariza — MUNIVAR</b>\n\n"
      . "👤 <b>Ism:</b> " . $h($name) . "\n"
      . "📞 <b>Telefon:</b> " . $h($phone) . "\n"
      . "📍 <b>Turi:</b> " . $h($type) . "\n"
      . "🌐 <b>Til:</b> " . $h(strtoupper($lang)) . "\n"
      . "🕒 " . date('d.m.Y H:i');

$ch = curl_init("https://api.telegram.org/bot{$cfg['bot_token']}/sendMessage");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_POSTFIELDS => [
        'chat_id' => $cfg['chat_id'],
        'text' => $text,
        'parse_mode' => 'HTML',
    ],
]);
$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200) {
    http_response_code(502);
    exit(json_encode(['ok' => false, 'error' => 'telegram']));
}
echo json_encode(['ok' => true]);
