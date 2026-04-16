<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Free Kundli</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #1e3557; font-size: 12px; line-height: 1.5; }
        .page { padding: 18px; }
        h1 { font-size: 28px; margin: 0 0 6px; }
        h2 { font-size: 16px; margin: 22px 0 10px; color: #d4a73c; }
        .muted { color: #6b7280; }
        .hero { border-bottom: 2px solid #d4a73c; padding-bottom: 14px; margin-bottom: 18px; }
        .grid { width: 100%; border-collapse: collapse; }
        .grid td { padding: 8px 10px; border: 1px solid #e5e7eb; vertical-align: top; }
        .label { width: 32%; font-weight: bold; background: #faf7f2; }
        .card { background: #faf7f2; border: 1px solid #ece6d8; padding: 12px; margin-bottom: 12px; border-radius: 6px; }
        .footer { margin-top: 30px; font-size: 10px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="page">
        <div class="hero">
            <h1>Astro Zura Free Kundli</h1>
            <div class="muted">Generated on {{ $generatedOn }}</div>
        </div>

        <h2>Birth Details</h2>
        <table class="grid">
            <tr><td class="label">Full Name</td><td>{{ $name }}</td></tr>
            <tr><td class="label">Gender</td><td>{{ $gender }}</td></tr>
            <tr><td class="label">Date of Birth</td><td>{{ $dateOfBirth }}</td></tr>
            <tr><td class="label">Time of Birth</td><td>{{ $timeOfBirth }}</td></tr>
            <tr><td class="label">Place of Birth</td><td>{{ $placeOfBirth }}</td></tr>
        </table>

        <h2>Core Kundli Summary</h2>
        <table class="grid">
            <tr><td class="label">Nakshatra</td><td>{{ data_get($kundli, 'nakshatra_details.nakshatra.name', '-') }}</td></tr>
            <tr><td class="label">Nakshatra Lord</td><td>{{ data_get($kundli, 'nakshatra_details.nakshatra.lord.name', '-') }}</td></tr>
            <tr><td class="label">Pada / Charan</td><td>{{ data_get($kundli, 'nakshatra_details.charan.name', '-') }}</td></tr>
            <tr><td class="label">Rasi</td><td>{{ data_get($kundli, 'nakshatra_details.rasi.name', '-') }}</td></tr>
            <tr><td class="label">Ayanamsa</td><td>{{ data_get($kundli, 'ayanamsa.name', '-') }}</td></tr>
            <tr><td class="label">Dasha Balance</td><td>{{ data_get($kundli, 'dasha_balance.description', '-') }}</td></tr>
        </table>

        <h2>Mangal Dosha</h2>
        <div class="card">
            <strong>Status:</strong> {{ data_get($kundli, 'mangal_dosha.has_dosha') ? 'Present' : 'Not Present' }}<br>
            <strong>Description:</strong> {{ data_get($kundli, 'mangal_dosha.description', 'No mangal dosha details available.') }}
        </div>

        <h2>Dasha Snapshot</h2>
        <div class="card">
            <strong>Current Maha Dasha:</strong> {{ data_get($dashaSummary, 'current_mahadasha.name', data_get($kundli, 'dasha_balance.lord.name', '-')) }}<br>
            <strong>Current Antar Dasha:</strong> {{ data_get($dashaSummary, 'current_antardasha.name', '-') }}<br>
            <strong>Current Pratyantar Dasha:</strong> {{ data_get($dashaSummary, 'current_pratyantardasha.name', '-') }}
        </div>

        <h2>Yoga Details</h2>
        @php($yogas = data_get($kundli, 'yoga_details', []))
        @if(!empty($yogas))
            @foreach(array_slice($yogas, 0, 5) as $yoga)
                <div class="card">
                    <strong>{{ data_get($yoga, 'name', 'Yoga') }}</strong><br>
                    {{ data_get($yoga, 'description', 'No description available.') }}
                </div>
            @endforeach
        @else
            <div class="card">No yoga details were returned for this chart.</div>
        @endif

        <div class="footer">
            This free kundli PDF is generated from Astro Zura using live astrology data. It is intended as a basic summary for the current project phase.
        </div>
    </div>
</body>
</html>
