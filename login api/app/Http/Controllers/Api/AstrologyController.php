<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AstrologyController extends Controller
{
    /**
     * Get OAuth 2.0 Access Token from Prokerala (Cached for 1 hour)
     */
    private function getAccessToken()
    {
        return Cache::remember('prokerala_access_token', 3500, function () {
            $response = Http::asForm()->post('https://api.prokerala.com/token', [
                'grant_type' => 'client_credentials',
                'client_id' => env('PROKERALA_CLIENT_ID'),
                'client_secret' => env('PROKERALA_CLIENT_SECRET'),
            ]);

            if ($response->successful()) {
                return $response->json('access_token');
            }

            throw new \Exception('Failed to get Prokerala Access Token: ' . $response->body());
        });
    }

    /**
     * Get Daily Horoscope (Rashifal)
     */
    public function getDailyHoroscope(Request $request, $sign = null)
    {
        try {
            $token = $this->getAccessToken();
            // Handle sign from path or query
            $sign = $sign ?: $request->query('sign');
            $day = $request->query('day', 'today'); // yesterday, today, tomorrow

            if (!$sign) {
                return response()->json(['status' => 'error', 'message' => 'Sign is required'], 400);
            }

            // Calculate datetime based on the requested day
            $datetime = match($day) {
                'yesterday' => now()->subDay()->format('Y-m-d\TH:i:sP'),
                'tomorrow'  => now()->addDay()->format('Y-m-d\TH:i:sP'),
                default     => now()->format('Y-m-d\TH:i:sP'),
            };

            // Correct advanced endpoint for detailed categorical predictions
            $url = "https://api.prokerala.com/v2/horoscope/daily/advanced";

            $response = Http::withToken($token)->get($url, [
                'sign'     => strtolower($sign),
                'datetime' => $datetime,
                'type'     => 'all', // Get all categories: General, Health, Career, Love
            ]);

            $prokeralaData = $response->json();

            if ($response->successful() && isset($prokeralaData['data'])) {
                $predictionsArr = $prokeralaData['data']['daily_predictions'][0]['predictions'] ?? [];
                
                // Initialize default predictions
                $dailyPrediction = [
                    'personal'   => 'No personal insights available.',
                    'profession' => 'No career insights available.',
                    'health'     => 'No health insights available.',
                    'emotions'   => 'No emotional insights available.',
                ];

                // Map categorical predictions from the API response
                foreach ($predictionsArr as $p) {
                    $type = strtolower($p['type']);
                    $text = $p['prediction'] ?? '';
                    
                    if ($type === 'general') $dailyPrediction['personal'] = $text;
                    if ($type === 'health')  $dailyPrediction['health'] = $text;
                    if ($type === 'career')  $dailyPrediction['profession'] = $text;
                    if ($type === 'love')    $dailyPrediction['emotions'] = $text;
                }

                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'daily_prediction' => $dailyPrediction,
                        'sign' => $sign,
                        'day'  => $day,
                        'date' => $prokeralaData['data']['datetime'] ?? now()->toDateString(),
                    ]
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch horoscope data from Prokerala.',
                'raw_error' => $prokeralaData
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Generate Kundli (Birth Chart)
     */
    /**
     * Generate Kundli (Birth Chart)
     */
    public function generateKundli(Request $request)
    {
        $request->validate([
            'datetime' => 'required|string', // Allow any string, we will normalize it
            'coordinates' => 'required|string', // e.g. 28.61,77.20
            'ayanamsa' => 'nullable|integer',
        ]);

        try {
            $token = $this->getAccessToken();
            $datetime = $request->datetime;

            // FOR SANDBOX MODE: Force Jan 1st
            // The API rejects any other date in Sandbox mode
            try {
                $dt = new \DateTime($datetime);
                $datetime = $dt->format('Y-01-01\TH:i:sP');
            } catch (\Exception $e) {
                // fallback if date format is weird
                $datetime = now()->format('Y-01-01\TH:i:sP');
            }

            $url = "https://api.prokerala.com/v2/astrology/kundli";

            $response = Http::withToken($token)->get($url, [
                'datetime' => $datetime,
                'coordinates' => $request->coordinates,
                'ayanamsa' => $request->ayanamsa ?? 1,
            ]);

            // Also fetch the visual chart
            $chartResponse = Http::withToken($token)->get("https://api.prokerala.com/v2/astrology/chart", [
                'datetime' => $datetime,
                'coordinates' => $request->coordinates,
                'chart_type' => 'rasi', // rasi chart
                'chart_style' => 'north-indian', // options: north-indian, south-indian, east-indian
                'ayanamsa' => $request->ayanamsa ?? 1,
            ]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'kundli' => $response->json('data'),
                    'chart' => $chartResponse->json('data'),
                    'sandbox_note' => 'Demo Mode: Results stabilized to Jan 1st of the selected year.'
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Kundli Matching (Marriage Matching / Ashta Kuta)
     */
    /**
     * Kundli Matching (Marriage Matching / Ashta Kuta)
     */
    public function matchMaking(Request $request)
    {
        $request->validate([
            'girl_coordinates' => 'required|string',
            'girl_dob' => 'required|string',
            'boy_coordinates' => 'required|string',
            'boy_dob' => 'required|string',
        ]);

        try {
            $token = $this->getAccessToken();
            
            // Normalize dates for Sandbox mode
            $girlDob = $request->girl_dob;
            $boyDob = $request->boy_dob;

            try {
                $girlDt = new \DateTime($girlDob);
                $girlDob = $girlDt->format('Y-01-01\TH:i:sP');
                
                $boyDt = new \DateTime($boyDob);
                $boyDob = $boyDt->format('Y-01-01\TH:i:sP');
            } catch (\Exception $e) {
                // fallback
                $girlDob = now()->format('Y-01-01\TH:i:sP');
                $boyDob = now()->format('Y-01-01\TH:i:sP');
            }

            $url = "https://api.prokerala.com/v2/astrology/kundli-matching";

            $response = Http::withToken($token)->get($url, [
                'girl_coordinates' => $request->girl_coordinates,
                'girl_dob' => $girlDob,
                'boy_coordinates' => $request->boy_coordinates,
                'boy_dob' => $boyDob,
                'ayanamsa' => 1, // Mandatory for matching
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $response->json('data'),
                'sandbox_note' => 'Demo Mode: Results stabilized to Jan 1st of the selected years.'
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Location Search Proxy
     */
    public function searchLocation(Request $request)
    {
        $q = $request->get('q');
        if (!$q) return response()->json(['data' => []]);

        try {
            $token = $this->getAccessToken();
            // Prokerala V2 Location Search
            $response = Http::withToken($token)->get("https://api.prokerala.com/v2/location/search", [
                'name' => $q,
            ]);

            $data = $response->json();

            // If API fails or returns no results, provide a Demo Fallback for common cities
            if ($response->failed() || empty($data['data'])) {
                $fallbacks = [
                    ['name' => 'Gandhinagar, Gujarat, India', 'coordinates' => ['latitude' => 23.21, 'longitude' => 72.63]],
                    ['name' => 'Ahmedabad, Gujarat, India', 'coordinates' => ['latitude' => 23.02, 'longitude' => 72.57]],
                    ['name' => 'Delhi, India', 'coordinates' => ['latitude' => 28.61, 'longitude' => 77.20]],
                    ['name' => 'Mumbai, Maharashtra, India', 'coordinates' => ['latitude' => 19.07, 'longitude' => 72.87]],
                    ['name' => 'Bangalore, Karnataka, India', 'coordinates' => ['latitude' => 12.97, 'longitude' => 77.59]],
                    ['name' => 'Pune, Maharashtra, India', 'coordinates' => ['latitude' => 18.52, 'longitude' => 73.85]],
                    ['name' => 'Surat, Gujarat, India', 'coordinates' => ['latitude' => 21.17, 'longitude' => 72.83]],
                    ['name' => 'Hyderabad, Telangana, India', 'coordinates' => ['latitude' => 17.38, 'longitude' => 78.48]],
                    ['name' => 'Chennai, Tamil Nadu, India', 'coordinates' => ['latitude' => 13.08, 'longitude' => 80.27]],
                    ['name' => 'Kolkata, West Bengal, India', 'coordinates' => ['latitude' => 22.57, 'longitude' => 88.36]],
                ];

                $filtered = array_values(array_filter($fallbacks, function($city) use ($q) {
                    return stripos($city['name'], $q) !== false;
                }));

                if (!empty($filtered)) {
                    return response()->json([
                        'status' => 'success',
                        'data' => $filtered,
                        'note' => 'Demo fallback results'
                    ]);
                }
            }

            return response()->json([
                'status' => 'success',
                'data' => $data['data'] ?? $data
            ]);
        } catch (\Exception $e) {
            // Even on error, return an empty array instead of 500 to keep frontend stable
            return response()->json(['status' => 'error', 'message' => $e->getMessage(), 'data' => []], 200);
        }
    }
}
