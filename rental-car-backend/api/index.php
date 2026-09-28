<?php

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

if (isset($_SERVER['VERCEL_URL']) || isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $_SERVER['SCRIPT_NAME'] = '/index.php';
}

require __DIR__ . '/../public/index.php';