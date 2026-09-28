<?php

// Tangani preflight OPTIONS secara eksplisit dengan header yang valid
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: {$origin}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");
    header("Access-Control-Allow-Credentials: true");
    http_response_code(200);
    exit(0);
}

if (isset($_SERVER['VERCEL_URL']) || isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $_SERVER['SCRIPT_NAME'] = '/index.php';
}

require __DIR__ . '/../public/index.php';