<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class AstrologyController extends Controller
{
    /**
     * Get OAuth 2.0 access token from Prokerala.
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

            throw new \Exception('Failed to get Prokerala access token: ' . $response->body());
        });
    }

    /**
     * Get daily horoscope (Rashifal).
     */
    public function getDailyHoroscope(Request $request, $sign = null)
    {
        try {
            $token = $this->getAccessToken();
            $sign = strtolower($sign ?: $request->query('sign', ''));
            $day = strtolower($request->query('day', 'today'));
            $supportedLanguages = ['en'];
            $language = $this->resolveRequestedLanguage($request, $supportedLanguages);

            if (!$sign) {
                return response()->json(['status' => 'error', 'message' => 'Sign is required.'], 400);
            }

            $baseDate = now('Asia/Kolkata');
            $datetime = match ($day) {
                'yesterday' => $baseDate->copy()->subDay()->format('Y-m-d\TH:i:sP'),
                'tomorrow' => $baseDate->copy()->addDay()->format('Y-m-d\TH:i:sP'),
                default => $baseDate->format('Y-m-d\TH:i:sP'),
            };

            $response = Http::withToken($token)->timeout(20)->get('https://api.prokerala.com/v2/horoscope/daily/advanced', [
                'sign' => $sign,
                'datetime' => $datetime,
                'type' => 'all',
                'la' => $language,
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($response, 'Failed to fetch horoscope data from Prokerala.'),
                ], 200);
            }

            $payload = $response->json('data', []);
            $predictions = $payload['daily_predictions'][0]['predictions'] ?? [];
            $dailyPrediction = [
                'personal' => 'No personal insights available.',
                'profession' => 'No career insights available.',
                'health' => 'No health insights available.',
                'emotions' => 'No emotional insights available.',
            ];

            foreach ($predictions as $prediction) {
                $type = strtolower($prediction['type'] ?? '');
                $text = $prediction['prediction'] ?? '';

                if ($type === 'general' && $text) {
                    $dailyPrediction['personal'] = $text;
                }

                if ($type === 'career' && $text) {
                    $dailyPrediction['profession'] = $text;
                }

                if ($type === 'health' && $text) {
                    $dailyPrediction['health'] = $text;
                }

                if ($type === 'love' && $text) {
                    $dailyPrediction['emotions'] = $text;
                }
            }

            $scores = [
                'love' => $this->scorePredictionText($dailyPrediction['emotions'], 58),
                'career' => $this->scorePredictionText($dailyPrediction['profession'], 64),
                'health' => $this->scorePredictionText($dailyPrediction['health'], 61),
            ];

            $averageScore = (int) round(collect($scores)->avg());

            return response()->json([
                'status' => 'success',
                'data' => [
                    'daily_prediction' => $dailyPrediction,
                    'scores' => $scores,
                    'status_label' => $averageScore >= 72 ? 'Highly Favorable' : ($averageScore >= 55 ? 'Favorable' : 'Balanced'),
                    'display_date' => $baseDate->format('d M Y'),
                    'sign' => $sign,
                    'day' => $day,
                    'language' => $language,
                    'supported_languages' => $supportedLanguages,
                    'requested_datetime' => $datetime,
                    'date' => $datetime,
                    'provider_date' => $payload['datetime'] ?? null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Get weekly horoscope.
     */
    public function getWeeklyHoroscope(Request $request, $sign = null)
    {
        try {
            $token = $this->getAccessToken();
            $sign = strtolower($sign ?: $request->query('sign', ''));

            if (!$sign) {
                return response()->json(['status' => 'error', 'message' => 'Sign is required.'], 400);
            }

            $baseDate = now('Asia/Kolkata');
            $datetime = $baseDate->format('Y-m-d\TH:i:sP');

            $response = Http::withToken($token)->timeout(20)->get('https://api.prokerala.com/v2/horoscope/weekly/basic', [
                'sign' => $sign,
                'datetime' => $datetime,
                'type' => 'all',
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($response, 'Weekly horoscope unavailable.'),
                ], 200);
            }

            $payload = $response->json('data', []);
            $predictions = $payload['weekly_predictions'][0]['predictions'] ?? $payload['predictions'] ?? [];

            $weeklyPrediction = [
                'personal'  => 'No personal insights available for this week.',
                'profession' => 'No career insights available for this week.',
                'health'    => 'No health insights available for this week.',
                'emotions'  => 'No emotional insights available for this week.',
            ];

            foreach ($predictions as $prediction) {
                $type = strtolower($prediction['type'] ?? '');
                $text = $prediction['prediction'] ?? '';
                if ($type === 'general' && $text) $weeklyPrediction['personal'] = $text;
                if ($type === 'career' && $text) $weeklyPrediction['profession'] = $text;
                if ($type === 'health' && $text) $weeklyPrediction['health'] = $text;
                if ($type === 'love' && $text) $weeklyPrediction['emotions'] = $text;
            }

            $scores = [
                'love'   => $this->scorePredictionText($weeklyPrediction['emotions'], 60),
                'career' => $this->scorePredictionText($weeklyPrediction['profession'], 65),
                'health' => $this->scorePredictionText($weeklyPrediction['health'], 62),
            ];

            $weekStart = $baseDate->copy()->startOfWeek()->format('d M');
            $weekEnd   = $baseDate->copy()->endOfWeek()->format('d M Y');

            return response()->json([
                'status' => 'success',
                'data' => [
                    'daily_prediction' => $weeklyPrediction,
                    'scores'       => $scores,
                    'status_label' => (int) round(collect($scores)->avg()) >= 72 ? 'Highly Favorable' : 'Favorable',
                    'display_date' => "{$weekStart} – {$weekEnd}",
                    'sign'         => $sign,
                    'day'          => 'weekly',
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Get monthly horoscope.
     */
    public function getMonthlyHoroscope(Request $request, $sign = null)
    {
        try {
            $token = $this->getAccessToken();
            $sign = strtolower($sign ?: $request->query('sign', ''));

            if (!$sign) {
                return response()->json(['status' => 'error', 'message' => 'Sign is required.'], 400);
            }

            $baseDate = now('Asia/Kolkata');
            $datetime = $baseDate->format('Y-m-d\TH:i:sP');

            $response = Http::withToken($token)->timeout(20)->get('https://api.prokerala.com/v2/horoscope/monthly/basic', [
                'sign' => $sign,
                'datetime' => $datetime,
                'type' => 'all',
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($response, 'Monthly horoscope unavailable.'),
                ], 200);
            }

            $payload = $response->json('data', []);
            $predictions = $payload['monthly_predictions'][0]['predictions'] ?? $payload['predictions'] ?? [];

            $monthlyPrediction = [
                'personal'  => 'No personal insights available for this month.',
                'profession' => 'No career insights available for this month.',
                'health'    => 'No health insights available for this month.',
                'emotions'  => 'No emotional insights available for this month.',
            ];

            foreach ($predictions as $prediction) {
                $type = strtolower($prediction['type'] ?? '');
                $text = $prediction['prediction'] ?? '';
                if ($type === 'general' && $text) $monthlyPrediction['personal'] = $text;
                if ($type === 'career' && $text) $monthlyPrediction['profession'] = $text;
                if ($type === 'health' && $text) $monthlyPrediction['health'] = $text;
                if ($type === 'love' && $text) $monthlyPrediction['emotions'] = $text;
            }

            $scores = [
                'love'   => $this->scorePredictionText($monthlyPrediction['emotions'], 62),
                'career' => $this->scorePredictionText($monthlyPrediction['profession'], 66),
                'health' => $this->scorePredictionText($monthlyPrediction['health'], 60),
            ];

            return response()->json([
                'status' => 'success',
                'data' => [
                    'daily_prediction' => $monthlyPrediction,
                    'scores'       => $scores,
                    'status_label' => (int) round(collect($scores)->avg()) >= 72 ? 'Highly Favorable' : 'Favorable',
                    'display_date' => $baseDate->format('F Y'),
                    'sign'         => $sign,
                    'day'          => 'monthly',
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Generate kundli (birth chart).
     */
    public function generateKundli(Request $request)
    {
        $request->validate([
            'datetime' => 'required|string',
            'coordinates' => 'required|string',
            'ayanamsa' => 'nullable|integer',
            'chart_type' => 'nullable|in:rasi,navamsa,lagna',
            'chart_style' => 'nullable|in:north-indian,south-indian,east-indian',
            'la' => 'nullable|string',
        ]);

        try {
            $token = $this->getAccessToken();
            $requestedDatetime = $this->normalizeIsoDatetime($request->datetime);
            $chartType = $request->input('chart_type', 'rasi');
            $chartStyle = $request->input('chart_style', 'north-indian');
            $supportedLanguages = ['en', 'ta', 'te', 'ml', 'gu', 'bn'];
            $language = $this->resolveRequestedLanguage($request, $supportedLanguages);
            $query = [
                'datetime' => $requestedDatetime,
                'coordinates' => $request->coordinates,
                'ayanamsa' => (int) ($request->ayanamsa ?? 1),
                'la' => $language,
            ];

            $response = Http::withToken($token)->timeout(25)->get('https://api.prokerala.com/v2/astrology/kundli/advanced', $query);
            $effectiveDatetime = $requestedDatetime;
            $sandboxWarning = null;

            if ($this->isSandboxDateRestriction($response)) {
                $effectiveDatetime = $this->toSandboxDatetime($requestedDatetime);
                $query['datetime'] = $effectiveDatetime;
                $sandboxWarning = 'The current Prokerala app is still responding in sandbox mode for kundli, so the upstream API only accepts January 1 of the selected birth year.';
                $response = Http::withToken($token)->timeout(25)->get('https://api.prokerala.com/v2/astrology/kundli/advanced', $query);
            }

            if (!$response->successful()) {
                $response = Http::withToken($token)->timeout(25)->get('https://api.prokerala.com/v2/astrology/kundli', $query);
            }

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($response, 'Failed to generate kundli.'),
                ], 200);
            }

            $kundliData = $response->json('data', []);
            $dashaSummary = $this->extractDashaSummary($kundliData['dasha_periods'] ?? []);

            if (isset($kundliData['dasha_periods'])) {
                $kundliData['dasha_periods'] = collect($kundliData['dasha_periods'])
                    ->map(function ($period) {
                        return [
                            'id' => $period['id'] ?? null,
                            'name' => $period['name'] ?? null,
                            'start' => $period['start'] ?? null,
                            'end' => $period['end'] ?? null,
                        ];
                    })
                    ->values()
                    ->all();
            }

            $chartResponse = Http::withToken($token)
                ->accept('image/svg+xml')
                ->timeout(25)
                ->get('https://api.prokerala.com/v2/astrology/chart', array_merge($query, [
                    'chart_type' => $chartType,
                    'chart_style' => $chartStyle,
                    'format' => 'svg',
                ]));

            return response()->json([
                'status' => 'success',
                'data' => [
                    'kundli' => $kundliData,
                    'chart' => $chartResponse->successful() ? $chartResponse->body() : null,
                    'chart_meta' => [
                        'chart_type' => $chartType,
                        'chart_style' => $chartStyle,
                    ],
                    'dasha_summary' => $dashaSummary,
                    'language' => $language,
                    'supported_languages' => $supportedLanguages,
                    'requested_datetime' => $requestedDatetime,
                    'effective_datetime' => $effectiveDatetime,
                    'is_sandbox_demo' => $sandboxWarning !== null,
                    'warning' => $sandboxWarning,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    public function downloadFreeKundliPdf(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female,Other',
            'date_of_birth' => 'required|date',
            'time_of_birth' => 'required|date_format:H:i',
            'place_of_birth' => 'required|string|max:255',
            'coordinates' => 'required|string',
            'ayanamsa' => 'nullable|integer',
            'la' => 'nullable|string',
        ]);

        try {
            $token = $this->getAccessToken();
            $language = $this->resolveRequestedLanguage($request, ['en', 'ta', 'te', 'ml', 'gu', 'bn']);
            $datetime = $this->normalizeIsoDatetime(
                $request->date_of_birth . 'T' . $request->time_of_birth . ':00+05:30'
            );

            $query = [
                'datetime' => $datetime,
                'coordinates' => $request->coordinates,
                'ayanamsa' => (int) ($request->ayanamsa ?? 1),
                'la' => $language,
            ];

            $response = Http::withToken($token)->timeout(25)->get('https://api.prokerala.com/v2/astrology/kundli/advanced', $query);

            if (!$response->successful()) {
                $response = Http::withToken($token)->timeout(25)->get('https://api.prokerala.com/v2/astrology/kundli', $query);
            }

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($response, 'Failed to generate free kundli PDF.'),
                ], 200);
            }

            $kundliData = $response->json('data', []);
            $pdf = Pdf::loadView('pdf.free-kundli', [
                'name' => $request->name,
                'gender' => $request->gender,
                'placeOfBirth' => $request->place_of_birth,
                'dateOfBirth' => $request->date_of_birth,
                'timeOfBirth' => $request->time_of_birth,
                'generatedOn' => now('Asia/Kolkata')->format('d M Y, h:i A'),
                'kundli' => $kundliData,
                'dashaSummary' => $this->extractDashaSummary($kundliData['dasha_periods'] ?? []),
            ])->setPaper('a4');

            $safeName = preg_replace('/[^A-Za-z0-9\-]+/', '-', strtolower($request->name));

            return $pdf->download(($safeName ?: 'free-kundli') . '-kundli.pdf');
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Kundli matching (Marriage Matching / Ashta Kuta).
     */
    public function matchMaking(Request $request)
    {
        $request->validate([
            'girl_coordinates' => 'required|string',
            'girl_dob' => 'required|string',
            'boy_coordinates' => 'required|string',
            'boy_dob' => 'required|string',
            'ayanamsa' => 'nullable|integer',
            'la' => 'nullable|string',
        ]);

        try {
            $token = $this->getAccessToken();
            $requestedGirlDob = $this->normalizeIsoDatetime($request->girl_dob);
            $requestedBoyDob = $this->normalizeIsoDatetime($request->boy_dob);
            $supportedLanguages = ['en', 'hi', 'ta', 'te', 'ml'];
            $language = $this->resolveRequestedLanguage($request, $supportedLanguages);
            $query = [
                'girl_coordinates' => $request->girl_coordinates,
                'girl_dob' => $requestedGirlDob,
                'boy_coordinates' => $request->boy_coordinates,
                'boy_dob' => $requestedBoyDob,
                'ayanamsa' => (int) ($request->ayanamsa ?? 1),
                'la' => $language,
            ];

            $response = Http::withToken($token)->timeout(25)->get('https://api.prokerala.com/v2/astrology/kundli-matching/advanced', $query);
            $effectiveGirlDob = $requestedGirlDob;
            $effectiveBoyDob = $requestedBoyDob;
            $sandboxWarning = null;

            if ($this->isSandboxDateRestriction($response)) {
                $effectiveGirlDob = $this->toSandboxDatetime($requestedGirlDob);
                $effectiveBoyDob = $this->toSandboxDatetime($requestedBoyDob);
                $query['girl_dob'] = $effectiveGirlDob;
                $query['boy_dob'] = $effectiveBoyDob;
                $sandboxWarning = 'The current Prokerala app is still responding in sandbox mode for kundli matching, so the upstream API only accepts January 1 of each selected birth year.';
                $response = Http::withToken($token)->timeout(25)->get('https://api.prokerala.com/v2/astrology/kundli-matching/advanced', $query);
            }

            if (!$response->successful()) {
                $response = Http::withToken($token)->timeout(25)->get('https://api.prokerala.com/v2/astrology/kundli-matching', $query);
            }

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($response, 'Failed to fetch kundli matching result.'),
                ], 200);
            }

            $data = $response->json('data', []);
            if (isset($data['message']['description']) && is_array($data['message']['description'])) {
                $data['message']['description'] = implode(' ', array_filter($data['message']['description']));
            }

            return response()->json([
                'status' => 'success',
                'data' => $data,
                'meta' => [
                    'language' => $language,
                    'supported_languages' => $supportedLanguages,
                    'requested_girl_dob' => $requestedGirlDob,
                    'requested_boy_dob' => $requestedBoyDob,
                    'effective_girl_dob' => $effectiveGirlDob,
                    'effective_boy_dob' => $effectiveBoyDob,
                    'is_sandbox_demo' => $sandboxWarning !== null,
                    'warning' => $sandboxWarning,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Location search proxy.
     */
    public function searchLocation(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        if ($q === '') {
            return response()->json(['status' => 'success', 'data' => []]);
        }

        $language = $this->resolveRequestedLanguage(
            $request,
            ['en', 'hi', 'ta', 'te', 'ml', 'gu', 'bn'],
            'en',
            'language'
        );

        try {
            $googleResults = $this->searchGoogleLocations($q, $language);
            if (!empty($googleResults)) {
                return response()->json([
                    'status' => 'success',
                    'data' => $googleResults,
                    'source' => 'google_maps',
                ]);
            }

            $token = $this->getAccessToken();
            $response = Http::withToken($token)->timeout(20)->get('https://api.prokerala.com/v2/location/search', [
                'name' => $q,
            ]);

            if ($response->successful() && !empty($response->json('data'))) {
                return response()->json([
                    'status' => 'success',
                    'data' => $this->normalizeLocations($response->json('data', [])),
                    'source' => 'prokerala',
                ]);
            }

            $fallbacks = $this->searchFallbackLocations($q);

            return response()->json([
                'status' => 'success',
                'data' => $fallbacks,
                'source' => 'fallback',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'data' => $this->searchFallbackLocations($q),
            ], 200);
        }
    }

    /**
     * Get Panchang and daily muhurat details.
     */
    public function getPanchang(Request $request)
    {
        $request->validate([
            'datetime' => 'required|string',
            'coordinates' => 'required|string',
            'ayanamsa' => 'nullable|integer',
            'la' => 'nullable|string',
        ]);

        try {
            $token = $this->getAccessToken();
            $requestedDatetime = $this->normalizeIsoDatetime($request->datetime);
            $supportedLanguages = ['en', 'ta', 'ml', 'hi'];
            $language = $this->resolveRequestedLanguage($request, $supportedLanguages);
            $query = [
                'datetime' => $requestedDatetime,
                'coordinates' => $request->coordinates,
                'ayanamsa' => (int) ($request->ayanamsa ?? 1),
                'la' => $language,
            ];

            $response = Http::withToken($token)->timeout(25)->get('https://api.prokerala.com/v2/astrology/panchang/advanced', $query);

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($response, 'Failed to fetch panchang details.'),
                ], 200);
            }

            $data = $response->json('data', []);
            $reference = \Illuminate\Support\Carbon::parse($requestedDatetime);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'panchang' => $data,
                    'summary' => [
                        'vaara' => $data['vaara'] ?? null,
                        'sunrise' => $data['sunrise'] ?? null,
                        'sunset' => $data['sunset'] ?? null,
                        'moonrise' => $data['moonrise'] ?? null,
                        'moonset' => $data['moonset'] ?? null,
                        'current_tithi' => $this->findActiveTimedEntry($data['tithi'] ?? [], $reference),
                        'current_nakshatra' => $this->findActiveTimedEntry($data['nakshatra'] ?? [], $reference),
                        'current_karana' => $this->findActiveTimedEntry($data['karana'] ?? [], $reference),
                        'current_yoga' => $this->findActiveTimedEntry($data['yoga'] ?? [], $reference),
                    ],
                    'language' => $language,
                    'supported_languages' => $supportedLanguages,
                    'requested_datetime' => $requestedDatetime,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Get Divisional Charts (D1 to D60).
     */
    public function getDivisionalCharts(Request $request)
    {
        $request->validate([
            'datetime' => 'required|string',
            'coordinates' => 'required|string',
            'chart_type' => 'required|string',
            'chart_style' => 'nullable|string',
        ]);

        $query = [
            'datetime' => $this->normalizeIsoDatetime($request->datetime),
            'coordinates' => $request->coordinates,
            'chart_type' => $request->chart_type,
            'chart_style' => $request->input('chart_style', 'north-indian'),
            'format' => 'svg',
        ];

        return $this->proxyProkeralaRequest('https://api.prokerala.com/v2/astrology/chart', $query, true);
    }

    /**
     * Get Predictions (Career, Love, Health, etc.).
     */
    public function getPredictions(Request $request)
    {
        $request->validate([
            'datetime' => 'required|string',
            'coordinates' => 'required|string',
            'type' => 'required|string', // career, love-and-relationship, etc.
        ]);

        $type = $request->type;
        $query = [
            'datetime' => $this->normalizeIsoDatetime($request->datetime),
            'coordinates' => $request->coordinates,
        ];

        return $this->proxyProkeralaRequest("https://api.prokerala.com/v2/astrology/prediction/{$type}", $query);
    }

    public function getVedicCalculator(Request $request, string $calculator)
    {
        $configs = $this->getVedicCalculatorConfigs();
        if (!isset($configs[$calculator])) {
            return response()->json(['status' => 'error', 'message' => 'Unsupported Vedic calculator.'], 404);
        }

        $request->validate([
            'datetime' => 'required|string',
            'coordinates' => 'required|string',
            'ayanamsa' => 'nullable|integer|in:1,3,5',
            'la' => 'nullable|string',
            'year' => 'nullable|integer|min:1900|max:2100',
            'planet' => 'nullable|integer',
            'chart_style' => 'nullable|string|in:north-indian,south-indian,east-indian',
            'detailed_report' => 'nullable|boolean',
            'planets' => 'nullable|string',
        ]);

        try {
            $token = $this->getAccessToken();
            $config = $configs[$calculator];
            $ayanamsa = (int) ($request->input('ayanamsa') ?: 1);
            $language = $request->input('la', 'en');
            $requestedDatetime = $this->normalizeIsoDatetime($request->input('datetime'));

            $query = [
                'datetime' => $requestedDatetime,
                'coordinates' => $request->input('coordinates'),
                'ayanamsa' => $ayanamsa,
                'la' => $language,
            ];

            if (!empty($config['requires_year'])) {
                $query['year'] = (int) ($request->input('year') ?: now('Asia/Kolkata')->year);
            }

            if (!empty($config['requires_planet'])) {
                $query['planet'] = (int) $request->input('planet', 0);
            }

            if (!empty($config['requires_chart_style'])) {
                $query['chart_style'] = $request->input('chart_style', 'north-indian');
            }

            if (!empty($config['supports_planets_filter']) && $request->filled('planets')) {
                $query['planets'] = $request->input('planets');
            }

            $path = $config['path'];
            if (!empty($config['supports_advanced']) && filter_var($request->input('detailed_report', false), FILTER_VALIDATE_BOOLEAN)) {
                $path .= '/advanced';
            }

            $response = Http::withToken($token)
                ->timeout(25)
                ->when(!empty($config['returns_svg']), fn ($client) => $client->accept('image/svg+xml'))
                ->get('https://api.prokerala.com/v2' . $path, $query);

            $effectiveDatetime = $requestedDatetime;
            $warnings = [];

            if ($this->isSandboxDateRestriction($response)) {
                $effectiveDatetime = $this->toSandboxDatetime($requestedDatetime);
                $query['datetime'] = $effectiveDatetime;
                $warnings[] = 'The current Prokerala app is responding in sandbox mode, so only January 1 of the selected year is allowed for date-based astrology calculations.';
                $response = Http::withToken($token)
                    ->timeout(25)
                    ->when(!empty($config['returns_svg']), fn ($client) => $client->accept('image/svg+xml'))
                    ->get('https://api.prokerala.com/v2' . $path, $query);
            }

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($response, 'Failed to fetch Vedic calculator result.'),
                ], 200);
            }

            $data = !empty($config['returns_svg']) ? ['svg' => $response->body()] : $response->json('data');

            if (!empty($config['companion_chart_path'])) {
                $chartResponse = Http::withToken($token)
                    ->accept('image/svg+xml')
                    ->timeout(25)
                    ->get('https://api.prokerala.com/v2' . $config['companion_chart_path'], $query);

                if ($chartResponse->successful()) {
                    $data = [
                        'chart_data' => $data,
                        'chart_svg' => $chartResponse->body(),
                    ];
                }
            }

            return response()->json([
                'status' => 'success',
                'data' => $data,
                'meta' => [
                    'calculator' => $calculator,
                    'requested_datetime' => $requestedDatetime,
                    'effective_datetime' => $effectiveDatetime,
                    'is_sandbox_demo' => !empty($warnings),
                    'warning' => $warnings ? implode(' ', array_unique($warnings)) : null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    public function getMatchingCalculator(Request $request, string $calculator)
    {
        $configs = $this->getMatchingCalculatorConfigs();
        if (!isset($configs[$calculator])) {
            return response()->json(['status' => 'error', 'message' => 'Unsupported matching calculator.'], 404);
        }

        $request->validate([
            'girl_coordinates' => 'nullable|string',
            'girl_dob' => 'nullable|string',
            'boy_coordinates' => 'nullable|string',
            'boy_dob' => 'nullable|string',
            'girl_nakshatra' => 'nullable|integer|min:0|max:26',
            'girl_nakshatra_pada' => 'nullable|integer|min:1|max:4',
            'boy_nakshatra' => 'nullable|integer|min:0|max:26',
            'boy_nakshatra_pada' => 'nullable|integer|min:1|max:4',
            'ayanamsa' => 'nullable|integer|in:1,3,5',
            'system' => 'nullable|string|in:tamil,kerala',
            'detailed_report' => 'nullable|boolean',
            'la' => 'nullable|string',
        ]);

        try {
            $token = $this->getAccessToken();
            $config = $configs[$calculator];
            $language = $request->input('la', 'en');
            $warnings = [];
            $query = ['la' => $language];

            if ($config['input'] === 'nakshatra') {
                $query = array_merge($query, [
                    'girl_nakshatra' => (int) $request->input('girl_nakshatra', 0),
                    'girl_nakshatra_pada' => (int) $request->input('girl_nakshatra_pada', 1),
                    'boy_nakshatra' => (int) $request->input('boy_nakshatra', 0),
                    'boy_nakshatra_pada' => (int) $request->input('boy_nakshatra_pada', 1),
                ]);
            } else {
                $query = array_merge($query, [
                    'girl_coordinates' => $request->input('girl_coordinates'),
                    'girl_dob' => $this->normalizeIsoDatetime($request->input('girl_dob')),
                    'boy_coordinates' => $request->input('boy_coordinates'),
                    'boy_dob' => $this->normalizeIsoDatetime($request->input('boy_dob')),
                    'ayanamsa' => (int) ($request->input('ayanamsa') ?: 1),
                ]);

                if (!empty($config['requires_system'])) {
                    $query['system'] = $request->input('system', 'tamil');
                }
            }

            $path = $config['path'];
            if (!empty($config['supports_advanced']) && filter_var($request->input('detailed_report', false), FILTER_VALIDATE_BOOLEAN)) {
                $path .= '/advanced';
            }

            $response = Http::withToken($token)
                ->timeout(25)
                ->get('https://api.prokerala.com/v2' . $path, $query);

            if ($config['input'] === 'nakshatra' && $this->isSandboxNakshatraRestriction($response)) {
                $query['girl_nakshatra'] = 0;
                $query['boy_nakshatra'] = 0;
                $warnings[] = 'The current Prokerala app is responding in sandbox mode, so only Ashwini nakshatra is accepted for nakshatra-based matching calculators.';
                $response = Http::withToken($token)
                    ->timeout(25)
                    ->get('https://api.prokerala.com/v2' . $path, $query);
            }

            if ($config['input'] === 'birth_profiles' && $this->isSandboxDateRestriction($response)) {
                $query['girl_dob'] = $this->toSandboxDatetime($query['girl_dob']);
                $query['boy_dob'] = $this->toSandboxDatetime($query['boy_dob']);
                $warnings[] = 'The current Prokerala app is responding in sandbox mode, so only January 1 of the selected year is allowed for date-based matching calculations.';
                $response = Http::withToken($token)
                    ->timeout(25)
                    ->get('https://api.prokerala.com/v2' . $path, $query);
            }

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($response, 'Failed to fetch matching calculator result.'),
                ], 200);
            }

            return response()->json([
                'status' => 'success',
                'data' => $response->json('data'),
                'meta' => [
                    'calculator' => $calculator,
                    'is_sandbox_demo' => !empty($warnings),
                    'warning' => $warnings ? implode(' ', array_unique($warnings)) : null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Get Numerology Report.
     */
    public function getNumerology(Request $request)
    {
        $configs = $this->getNumerologyCalculatorConfigs();
        $request->validate([
            'calculator' => 'nullable|string|in:' . implode(',', array_keys($configs)),
            'system' => 'nullable|string|in:pythagorean,chaldean',
            'date_of_birth' => 'nullable|date',
            'time_of_birth' => 'nullable|date_format:H:i',
            'first_name' => 'nullable|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'reference_year' => 'nullable|integer|min:1900|max:2100',
            'additional_vowel' => 'nullable|boolean',
            'datetime' => 'nullable|string',
            'name' => 'nullable|string|max:255',
        ]);

        try {
            $token = $this->getAccessToken();
            $calculator = $request->input('calculator');
            if (!$calculator) {
                $calculator = $request->filled('datetime') && $request->filled('name')
                    ? 'maturity-number'
                    : 'life-path-number';
            }
            $config = $configs[$calculator];

            $requestData = $this->buildNumerologyRequestData($request, $config);
            $query = $requestData['query'];
            $requestedDatetime = $requestData['requested_datetime'];
            $requestedNames = $requestData['requested_names'];
            $effectiveDatetime = $requestedDatetime;
            $effectiveNames = $requestedNames;
            $warnings = [];

            $response = Http::withToken($token)
                ->timeout(25)
                ->get("https://api.prokerala.com/v2{$config['path']}", $query);

            if ($this->isSandboxDateRestriction($response) && isset($query['datetime'])) {
                $effectiveDatetime = $this->toSandboxDatetime($query['datetime']);
                $query['datetime'] = $effectiveDatetime;
                $warnings[] = 'The current Prokerala numerology app is responding in sandbox mode, so only January 1 of the selected year is allowed for date-based numerology calculations.';
                $response = Http::withToken($token)
                    ->timeout(25)
                    ->get("https://api.prokerala.com/v2{$config['path']}", $query);
            }

            if ($this->isSandboxNumerologyNameRestriction($response) && $this->numerologyRequestUsesNames($query)) {
                $effectiveNames = $this->applySandboxNumerologyNames($query);
                $query = array_merge($query, $effectiveNames);
                $warnings[] = 'The current Prokerala numerology app is responding in sandbox mode, so only test names are accepted for name-based numerology calculations.';
                $response = Http::withToken($token)
                    ->timeout(25)
                    ->get("https://api.prokerala.com/v2{$config['path']}", $query);
            }

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($response, 'Failed to fetch numerology report.'),
                ], 200);
            }

            return response()->json([
                'status' => 'success',
                'data' => $response->json('data'),
                'meta' => [
                    'calculator' => $calculator,
                    'calculator_label' => $config['label'],
                    'system' => $config['system'],
                    'requested_datetime' => $requestedDatetime,
                    'effective_datetime' => $effectiveDatetime,
                    'requested_names' => $requestedNames,
                    'effective_names' => $effectiveNames,
                    'is_sandbox_demo' => !empty($warnings),
                    'warning' => $warnings ? implode(' ', array_unique($warnings)) : null,
                ],
            ]);
        } catch (\InvalidArgumentException $exception) {
            return response()->json([
                'status' => 'error',
                'message' => $exception->getMessage(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Get Sadesati Report.
     */
    public function getSadesati(Request $request)
    {
        $request->validate([
            'datetime' => 'required|string',
            'coordinates' => 'required|string',
        ]);

        $query = [
            'datetime' => $this->normalizeIsoDatetime($request->datetime),
            'coordinates' => $request->coordinates,
        ];

        return $this->proxyProkeralaRequest('https://api.prokerala.com/v2/astrology/sadesati', $query);
    }

    /**
     * Get Lal Kitab Remedies.
     */
    public function getLalKitab(Request $request)
    {
        $request->validate([
            'datetime' => 'required|string',
            'coordinates' => 'required|string',
        ]);

        $query = [
            'datetime' => $this->normalizeIsoDatetime($request->datetime),
            'coordinates' => $request->coordinates,
        ];

        return $this->proxyProkeralaRequest('https://api.prokerala.com/v2/astrology/lal-kitab-remedy', $query);
    }

    /**
     * Helper to proxy requests to Prokerala with sandbox handling.
     */
    private function proxyProkeralaRequest(string $url, array $query, bool $isImage = false)
    {
        try {
            $token = $this->getAccessToken();
            $requestedDatetime = $query['datetime'];

            $response = Http::withToken($token)->timeout(25);
            if ($isImage) $response = $response->accept('image/svg+xml');
            
            $res = $response->get($url, $query);

            if ($this->isSandboxDateRestriction($res)) {
                $query['datetime'] = $this->toSandboxDatetime($requestedDatetime);
                $res = $response->get($url, $query);
            }

            if (!$res->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $this->extractProkeralaError($res, 'Prokerala API error.'),
                ], 200);
            }

            return response()->json([
                'status' => 'success',
                'data' => $isImage ? $res->body() : $res->json('data'),
                'effective_datetime' => $query['datetime'],
                'requested_datetime' => $requestedDatetime,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    private function getNumerologyCalculatorConfigs(): array
    {
        return [
            'life-path-number' => [
                'label' => 'Life Path Number',
                'system' => 'pythagorean',
                'path' => '/numerology/life-path-number',
                'requires_datetime' => true,
            ],
            'birthday-number' => [
                'label' => 'Birthday Number',
                'system' => 'pythagorean',
                'path' => '/numerology/birthday-number',
                'requires_datetime' => true,
            ],
            'birth-month-number' => [
                'label' => 'Birth Month Number',
                'system' => 'pythagorean',
                'path' => '/numerology/birth-month-number',
                'requires_datetime' => true,
            ],
            'expression-number' => [
                'label' => 'Expression Number',
                'system' => 'pythagorean',
                'path' => '/numerology/expression-number',
                'requires_names' => true,
            ],
            'soul-urge-number' => [
                'label' => 'Soul Urge Number',
                'system' => 'pythagorean',
                'path' => '/numerology/soul-urge-number',
                'requires_names' => true,
                'requires_additional_vowel' => true,
            ],
            'personality-number' => [
                'label' => 'Personality Number',
                'system' => 'pythagorean',
                'path' => '/numerology/personality-number',
                'requires_names' => true,
                'requires_additional_vowel' => true,
            ],
            'maturity-number' => [
                'label' => 'Maturity Number',
                'system' => 'pythagorean',
                'path' => '/numerology/maturity-number',
                'requires_datetime' => true,
                'requires_names' => true,
            ],
            'personal-year-number' => [
                'label' => 'Personal Year Number',
                'system' => 'pythagorean',
                'path' => '/numerology/personal-year-number',
                'requires_datetime' => true,
                'requires_reference_year' => true,
            ],
            'personal-month-number' => [
                'label' => 'Personal Month Number',
                'system' => 'pythagorean',
                'path' => '/numerology/personal-month-number',
                'requires_datetime' => true,
                'requires_reference_year' => true,
            ],
            'personal-day-number' => [
                'label' => 'Personal Day Number',
                'system' => 'pythagorean',
                'path' => '/numerology/personal-day-number',
                'requires_datetime' => true,
                'requires_reference_year' => true,
            ],
            'chaldean-life-path-number' => [
                'label' => 'Chaldean Life Path Number',
                'system' => 'chaldean',
                'path' => '/numerology/chaldean/life-path-number',
                'requires_datetime' => true,
            ],
            'chaldean-birth-number' => [
                'label' => 'Chaldean Birth Number',
                'system' => 'chaldean',
                'path' => '/numerology/chaldean/birth-number',
                'requires_datetime' => true,
            ],
            'whole-name-number' => [
                'label' => 'Whole Name Number',
                'system' => 'chaldean',
                'path' => '/numerology/chaldean/whole-name-number',
                'requires_names' => true,
            ],
            'daily-name-number' => [
                'label' => 'Daily Name Number',
                'system' => 'chaldean',
                'path' => '/numerology/chaldean/daily-name-number',
                'requires_names' => true,
            ],
            'identity-initial-code-number' => [
                'label' => 'Identity Initial Code Number',
                'system' => 'chaldean',
                'path' => '/numerology/chaldean/identity-initial-code-number',
                'requires_names' => true,
            ],
        ];
    }

    private function getVedicCalculatorConfigs(): array
    {
        return [
            'mangal-dosha' => [
                'path' => '/astrology/mangal-dosha',
                'supports_advanced' => true,
            ],
            'kaal-sarp-dosha' => [
                'path' => '/astrology/kaal-sarp-dosha',
            ],
            'papasamyam' => [
                'path' => '/astrology/papasamyam',
            ],
            'planet-position' => [
                'path' => '/astrology/planet-position',
                'supports_planets_filter' => true,
            ],
            'sade-sati' => [
                'path' => '/astrology/sade-sati',
                'supports_advanced' => true,
            ],
            'yoga' => [
                'path' => '/astrology/yoga',
            ],
            'dasha-periods' => [
                'path' => '/astrology/dasha-periods',
            ],
            'planet-relationship' => [
                'path' => '/astrology/planet-relationship',
            ],
            'ashtakavarga' => [
                'path' => '/astrology/ashtakavarga',
                'requires_planet' => true,
                'requires_chart_style' => true,
            ],
            'sarvashtakavarga' => [
                'path' => '/astrology/sarvashtakavarga',
                'requires_chart_style' => true,
                'companion_chart_path' => '/astrology/sarvashtakavarga-chart',
            ],
            'sudarshana-chakra' => [
                'path' => '/astrology/sudarshana-chakra',
                'returns_svg' => true,
            ],
            'chandrashtama-periods' => [
                'path' => '/astrology/chandrashtama-periods',
                'requires_year' => true,
            ],
            'gowri-nalla-neram' => [
                'path' => '/astrology/gowri-nalla-neram',
            ],
            'birth-details' => [
                'path' => '/astrology/birth-details',
            ],
        ];
    }

    private function getMatchingCalculatorConfigs(): array
    {
        return [
            'nakshatra-porutham' => [
                'path' => '/astrology/nakshatra-porutham',
                'input' => 'nakshatra',
                'supports_advanced' => true,
            ],
            'thirumana-porutham' => [
                'path' => '/astrology/thirumana-porutham',
                'input' => 'nakshatra',
                'supports_advanced' => true,
            ],
            'porutham' => [
                'path' => '/astrology/porutham',
                'input' => 'birth_profiles',
                'supports_advanced' => true,
                'requires_system' => true,
            ],
            'papasamyam-check' => [
                'path' => '/astrology/papasamyam-check',
                'input' => 'birth_profiles',
            ],
        ];
    }

    private function buildNumerologyRequestData(Request $request, array $config): array
    {
        $query = [];
        $requestedDatetime = null;
        $requestedNames = null;

        if (!empty($config['requires_datetime'])) {
            $requestedDatetime = $this->resolveNumerologyDatetime($request);
            $query['datetime'] = $requestedDatetime;
        }

        if (!empty($config['requires_names'])) {
            $names = $this->resolveNumerologyNames($request);
            $requestedNames = $names;
            $query['first_name'] = $names['first_name'];
            $query['middle_name'] = $names['middle_name'];
            $query['last_name'] = $names['last_name'];
        }

        if (!empty($config['requires_reference_year'])) {
            $query['reference_year'] = (int) ($request->input('reference_year') ?: now('Asia/Kolkata')->year);
        }

        if (!empty($config['requires_additional_vowel'])) {
            $query['additional_vowel'] = filter_var($request->input('additional_vowel', false), FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
        }

        return [
            'query' => $query,
            'requested_datetime' => $requestedDatetime,
            'requested_names' => $requestedNames,
        ];
    }

    private function resolveNumerologyDatetime(Request $request): string
    {
        if ($request->filled('datetime')) {
            return $this->normalizeIsoDatetime($request->input('datetime'));
        }

        if (!$request->filled('date_of_birth')) {
            throw new \InvalidArgumentException('Date of birth is required for the selected numerology calculator.');
        }

        $time = $request->input('time_of_birth', '12:00');
        return $this->normalizeIsoDatetime($request->input('date_of_birth') . 'T' . $time . ':00+05:30');
    }

    private function resolveNumerologyNames(Request $request): array
    {
        if ($request->filled('first_name') || $request->filled('last_name')) {
            if (!$request->filled('first_name')) {
                throw new \InvalidArgumentException('First name is required for the selected numerology calculator.');
            }

            return [
                'first_name' => trim((string) $request->input('first_name')),
                'middle_name' => trim((string) $request->input('middle_name', '')),
                'last_name' => trim((string) $request->input('last_name', '')),
            ];
        }

        $name = trim((string) $request->input('name', ''));
        if ($name === '') {
            throw new \InvalidArgumentException('Name details are required for the selected numerology calculator.');
        }

        $parts = preg_split('/\s+/', $name);
        $firstName = array_shift($parts) ?: '';
        $lastName = count($parts) > 0 ? array_pop($parts) : '';
        $middleName = implode(' ', $parts);

        return [
            'first_name' => $firstName,
            'middle_name' => $middleName,
            'last_name' => $lastName,
        ];
    }

    private function numerologyRequestUsesNames(array $query): bool
    {
        return !empty($query['first_name']) || !empty($query['middle_name']) || !empty($query['last_name']);
    }

    private function isSandboxNumerologyNameRestriction(Response $response): bool
    {
        if ($response->successful()) {
            return false;
        }

        $details = collect($response->json('errors', []))
            ->pluck('detail')
            ->filter()
            ->implode(' ');

        return stripos($details, 'only these test names are allowed') !== false;
    }

    private function isSandboxNakshatraRestriction(Response $response): bool
    {
        if ($response->successful()) {
            return false;
        }

        $details = collect($response->json('errors', []))
            ->pluck('detail')
            ->filter()
            ->implode(' ');

        return stripos($details, 'only the `Ashwini') !== false || stripos($details, 'only Ashwini') !== false;
    }

    private function applySandboxNumerologyNames(array $query): array
    {
        $allowedNames = ['alice', 'bob', 'charlie', 'diana', 'eve', 'frank', 'grace', 'heidi', 'ivan', 'judy'];
        $mapped = [];

        foreach (['first_name', 'middle_name', 'last_name'] as $index => $field) {
            $value = trim((string) ($query[$field] ?? ''));

            if ($value === '') {
                $mapped[$field] = '';
                continue;
            }

            $lower = strtolower($value);
            if (in_array($lower, $allowedNames, true)) {
                $mapped[$field] = $lower;
                continue;
            }

            $mapped[$field] = $allowedNames[crc32($lower . $field) % count($allowedNames)];
        }

        return $mapped;
    }

    private function normalizeIsoDatetime(string $datetime): string
    {
        try {
            return (new \DateTimeImmutable($datetime))->format('Y-m-d\TH:i:sP');
        } catch (\Exception $e) {
            throw new \InvalidArgumentException('Invalid datetime format. Use ISO 8601, for example 1990-05-12T10:30:00+05:30.');
        }
    }

    private function toSandboxDatetime(string $datetime): string
    {
        return (new \DateTimeImmutable($datetime))->format('Y-01-01\TH:i:sP');
    }

    private function isSandboxDateRestriction(Response $response): bool
    {
        if ($response->successful()) {
            return false;
        }

        $details = collect($response->json('errors', []))
            ->pluck('detail')
            ->filter()
            ->implode(' ');

        return stripos($details, 'sandbox mode') !== false
            && stripos($details, 'January 1st') !== false;
    }

    private function extractProkeralaError(Response $response, string $fallback): string
    {
        $details = collect($response->json('errors', []))
            ->pluck('detail')
            ->filter()
            ->implode(' ');

        return $details !== '' ? $details : $fallback;
    }

    private function searchGoogleLocations(string $query, string $language = 'en'): array
    {
        $apiKey = env('GOOGLE_MAPS_API_KEY');
        if (!$apiKey) {
            return [];
        }

        $response = Http::timeout(20)->get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $query,
            'key' => $apiKey,
            'language' => $language,
        ]);

        if (!$response->successful()) {
            return [];
        }

        $results = $response->json('results', []);

        return collect($results)
            ->take(5)
            ->map(function ($result) {
                return [
                    'name' => $result['formatted_address'] ?? '',
                    'coordinates' => [
                        'latitude' => $result['geometry']['location']['lat'] ?? null,
                        'longitude' => $result['geometry']['location']['lng'] ?? null,
                    ],
                ];
            })
            ->filter(function ($result) {
                return $result['name'] !== ''
                    && $result['coordinates']['latitude'] !== null
                    && $result['coordinates']['longitude'] !== null;
            })
            ->values()
            ->all();
    }

    private function normalizeLocations(array $locations): array
    {
        return collect($locations)
            ->map(function ($location) {
                $latitude = $location['coordinates']['latitude'] ?? $location['latitude'] ?? null;
                $longitude = $location['coordinates']['longitude'] ?? $location['longitude'] ?? null;

                return [
                    'name' => $location['name'] ?? $location['loc_name'] ?? $location['formatted_address'] ?? '',
                    'coordinates' => [
                        'latitude' => $latitude,
                        'longitude' => $longitude,
                    ],
                ];
            })
            ->filter(function ($location) {
                return $location['name'] !== ''
                    && $location['coordinates']['latitude'] !== null
                    && $location['coordinates']['longitude'] !== null;
            })
            ->values()
            ->all();
    }

    private function searchFallbackLocations(string $query): array
    {
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

        return array_values(array_filter($fallbacks, function ($city) use ($query) {
            return stripos($city['name'], $query) !== false;
        }));
    }

    private function resolveRequestedLanguage(
        Request $request,
        array $supportedLanguages,
        string $default = 'en',
        string $primaryField = 'la'
    ): string {
        $candidate = strtolower((string) (
            $request->input($primaryField)
            ?? $request->query($primaryField)
            ?? $request->input('language')
            ?? $request->query('language')
            ?? $default
        ));

        return in_array($candidate, $supportedLanguages, true) ? $candidate : $default;
    }

    private function extractDashaSummary(array $dashaPeriods): array
    {
        if (empty($dashaPeriods)) {
            return [];
        }

        $now = now('Asia/Kolkata');
        $currentMaha = null;
        $currentAntar = null;
        $currentPratyantar = null;

        foreach ($dashaPeriods as $maha) {
            if (!$this->datetimeFallsWithin($now, $maha['start'] ?? null, $maha['end'] ?? null)) {
                continue;
            }

            $currentMaha = $this->formatDashaPeriod($maha);

            foreach ($maha['antardasha'] ?? [] as $antar) {
                if (!$this->datetimeFallsWithin($now, $antar['start'] ?? null, $antar['end'] ?? null)) {
                    continue;
                }

                $currentAntar = $this->formatDashaPeriod($antar);

                foreach ($antar['pratyantardasha'] ?? [] as $pratyantar) {
                    if ($this->datetimeFallsWithin($now, $pratyantar['start'] ?? null, $pratyantar['end'] ?? null)) {
                        $currentPratyantar = $this->formatDashaPeriod($pratyantar);
                        break;
                    }
                }

                break;
            }

            break;
        }

        $nextMaha = collect($dashaPeriods)
            ->map(fn ($period) => $this->formatDashaPeriod($period))
            ->filter(function ($period) use ($now) {
                return !empty($period['start']) && $period['start'] > $now->toIso8601String();
            })
            ->take(4)
            ->values()
            ->all();

        return [
            'current_mahadasha' => $currentMaha,
            'current_antardasha' => $currentAntar,
            'current_pratyantardasha' => $currentPratyantar,
            'next_mahadasha' => $nextMaha,
        ];
    }

    private function datetimeFallsWithin($reference, ?string $start, ?string $end): bool
    {
        if (!$start || !$end) {
            return false;
        }

        return $reference->betweenIncluded(
            \Illuminate\Support\Carbon::parse($start),
            \Illuminate\Support\Carbon::parse($end)
        );
    }

    private function formatDashaPeriod(array $period): array
    {
        return [
            'id' => $period['id'] ?? null,
            'name' => $period['name'] ?? null,
            'start' => $period['start'] ?? null,
            'end' => $period['end'] ?? null,
        ];
    }

    private function findActiveTimedEntry(array $entries, $reference): ?array
    {
        foreach ($entries as $entry) {
            if ($this->datetimeFallsWithin($reference, $entry['start'] ?? null, $entry['end'] ?? null)) {
                return $entry;
            }
        }

        return $entries[0] ?? null;
    }

    private function scorePredictionText(string $text, int $default): int
    {
        $positiveWords = ['good', 'great', 'excellent', 'support', 'progress', 'success', 'strong', 'favorable', 'happy', 'positive', 'growth', 'gain'];
        $cautionWords = ['delay', 'stress', 'avoid', 'concern', 'challenge', 'careful', 'slow', 'conflict', 'uncertain', 'tension'];

        $lower = strtolower($text);
        $score = $default;

        foreach ($positiveWords as $word) {
            if (str_contains($lower, $word)) {
                $score += 4;
            }
        }

        foreach ($cautionWords as $word) {
            if (str_contains($lower, $word)) {
                $score -= 4;
            }
        }

        return max(25, min(95, $score));
    }
}
