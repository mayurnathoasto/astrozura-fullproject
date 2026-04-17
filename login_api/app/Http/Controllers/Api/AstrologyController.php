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
        ]);

        try {
            $token = $this->getAccessToken();
            $requestedDatetime = $this->normalizeIsoDatetime($request->datetime);
            $chartType = $request->input('chart_type', 'rasi');
            $chartStyle = $request->input('chart_style', 'north-indian');
            $query = [
                'datetime' => $requestedDatetime,
                'coordinates' => $request->coordinates,
                'ayanamsa' => (int) ($request->ayanamsa ?? 1),
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
        ]);

        try {
            $token = $this->getAccessToken();
            $datetime = $this->normalizeIsoDatetime(
                $request->date_of_birth . 'T' . $request->time_of_birth . ':00+05:30'
            );

            $query = [
                'datetime' => $datetime,
                'coordinates' => $request->coordinates,
                'ayanamsa' => (int) ($request->ayanamsa ?? 1),
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
        ]);

        try {
            $token = $this->getAccessToken();
            $requestedGirlDob = $this->normalizeIsoDatetime($request->girl_dob);
            $requestedBoyDob = $this->normalizeIsoDatetime($request->boy_dob);
            $query = [
                'girl_coordinates' => $request->girl_coordinates,
                'girl_dob' => $requestedGirlDob,
                'boy_coordinates' => $request->boy_coordinates,
                'boy_dob' => $requestedBoyDob,
                'ayanamsa' => (int) ($request->ayanamsa ?? 1),
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

        try {
            $googleResults = $this->searchGoogleLocations($q);
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
        ]);

        try {
            $token = $this->getAccessToken();
            $requestedDatetime = $this->normalizeIsoDatetime($request->datetime);
            $query = [
                'datetime' => $requestedDatetime,
                'coordinates' => $request->coordinates,
                'ayanamsa' => (int) ($request->ayanamsa ?? 1),
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

    /**
     * Get Numerology Report.
     */
    public function getNumerology(Request $request)
    {
        $request->validate([
            'datetime' => 'required|string',
            'name' => 'required|string',
        ]);

        $query = [
            'datetime' => $this->normalizeIsoDatetime($request->datetime),
            'name' => $request->name,
        ];

        return $this->proxyProkeralaRequest('https://api.prokerala.com/v2/numerology/report', $query);
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

    private function searchGoogleLocations(string $query): array
    {
        $apiKey = env('GOOGLE_MAPS_API_KEY');
        if (!$apiKey) {
            return [];
        }

        $response = Http::timeout(20)->get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $query,
            'key' => $apiKey,
            'language' => 'en',
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
