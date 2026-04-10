<?php
// Test script for Kundli Matching API
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

// Force Jan 1st for Sandbox
$girlDob = "2004-01-01T15:00:00+05:30";
$boyDob  = "2000-01-01T10:00:00+05:30";
$coords  = "28.61,77.20";

$url = "https://api.prokerala.com/v2/astrology/kundli-matching";
$params = [
    'girl_coordinates' => $coords,
    'girl_dob' => $girlDob,
    'boy_coordinates' => $coords,
    'boy_dob' => $boyDob,
    'ayanamsa' => 1
];

$ch = curl_init($url . "?" . http_build_query($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token", "Accept: application/json"]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: $httpCode\n";
echo "Response Keys: " . implode(', ', array_keys(json_decode($response, true)['data'] ?? [])) . "\n";
echo "Full Response (partial): " . substr($response, 0, 500) . "...\n";
