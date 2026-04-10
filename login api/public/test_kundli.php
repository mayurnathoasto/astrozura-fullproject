<?php
// Test script for Kundli API
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

$datetime = date('Y-01-01\TH:i:sP'); // Force Jan 1st for Sandbox
$coordinates = "28.61,77.20"; // Delhi

$endpoints = [
    'https://api.prokerala.com/v2/astrology/kundli',
    'https://api.prokerala.com/v2/astrology/chart?chart_type=rasi&chart_style=north-indian'
];

foreach ($endpoints as $url) {
    $params = [
        'datetime' => $datetime,
        'coordinates' => $coordinates,
        'ayanamsa' => 1
    ];
    $url .= (strpos($url, '?') !== false ? '&' : '?') . http_build_query($params);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token", "Accept: application/json"]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "URL: $url\nStatus: $httpCode\n";
    if ($httpCode != 200) {
        echo "Error: $response\n";
    }
    $data = json_decode($response, true);
    echo "Keys: " . implode(', ', array_keys($data['data'] ?? [])) . "\n";
    if (isset($data['data']['nakshatra_details'])) {
        echo "Nakshatra: " . $data['data']['nakshatra_details']['nakshatra']['name'] . "\n";
    }
    echo str_repeat("-", 30) . "\n";
}
