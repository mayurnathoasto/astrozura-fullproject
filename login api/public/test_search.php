<?php
// Fixed Shotgun test script for Location Search API
$clientId = "da221245-4578-434b-93f0-df449d41d2c0";
$clientSecret = "UeWx4JZovbVnHlMQB3vlToaeupOPhfZsPzhpxDRL";

function getAccessToken($clientId, $clientSecret) {
    $ch = curl_init('https://api.prokerala.com/token');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'grant_type' => 'client_credentials',
        'client_id' => $clientId,
        'client_secret' => $clientSecret,
    ]));
    $response = curl_exec($ch);
    $data = json_decode($response, true);
    curl_close($ch);
    return $data['access_token'] ?? null;
}

$token = getAccessToken($clientId, $clientSecret);
$q = "gandhinagar";

$endpoints = [
    'https://api.prokerala.com/v2/location/search',
    'https://api.prokerala.com/v2/location',
    'https://api.prokerala.com/v2/astrology/location',
    'https://api.prokerala.com/v2/astrology/location-search',
    'https://api.prokerala.com/v2/astrology/location/search'
];

foreach ($endpoints as $url) {
    echo "Testing $url...\n";
    $ch = curl_init($url . "?name=" . urlencode($q) . "&q=" . urlencode($q));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token", "Accept: application/json"]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    echo "Status: $httpCode\n";
    if ($httpCode == 200) {
        echo "SUCCESS! Body: " . substr($response, 0, 100) . "\n";
        break;
    }
}
