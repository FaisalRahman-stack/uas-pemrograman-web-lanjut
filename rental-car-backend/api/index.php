<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Pastikan Laravel membaca REQUEST_URI yang masuk dari Vercel
if (isset($_SERVER['VERCEL_URL']) || isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $_SERVER['SCRIPT_NAME'] = '/index.php';
}

require __DIR__ . '/../public/index.php';