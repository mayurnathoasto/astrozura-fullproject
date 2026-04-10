<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Home - {{ config('app.name') }}</title>
    <style>
        body {
            font-family: sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        .container {
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }

        h1,
        h2 {
            margin: 0;
            color: #333;
        }

        .user-controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .btn-logout {
            background: none;
            border: none;
            color: #dc3545;
            cursor: pointer;
            text-decoration: underline;
            font-size: 14px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 30px;
        }

        .info-item label {
            display: block;
            font-size: 12px;
            color: #666;
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .info-item div {
            font-size: 16px;
            color: #000;
        }

        .token-box {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
            margin-top: 10px;
        }

        .section-title {
            font-size: 18px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }

        /* Bottom Nav Bar Styles */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: white;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
            z-index: 1000;
        }

        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #999;
            text-decoration: none;
            font-size: 12px;
            font-weight: bold;
        }

        .nav-item.active {
            color: #3f51b5;
            /* Purple/Blue active color */
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
            fill: currentColor;
        }

        /* Adjust main container to avoid navbar overlap on mobile */
        body {
            padding-bottom: 80px;
        }
    </style>
</head>

<body>
    <div class="container">

        <div class="header">
            <h1>Home</h1>
            <div class="user-controls">
                <span>Welcome, <strong>{{ $user->name }}</strong></span>
                <form method="POST" action="{{ route('logout') }}" style="margin: 0;">
                    @csrf
                    <button type="submit" class="btn-logout">Logout</button>
                </form>
            </div>
        </div>

        <div>
            <h2 class="section-title">Profile Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <label>Name</label>
                    <div>{{ $user->name }}</div>
                </div>
                <div class="info-item">
                    <label>Phone</label>
                    <div>{{ $user->phone ?? 'Not provided' }}</div>
                </div>
                <div class="info-item">
                    <label>Email Address</label>
                    <div>{{ $user->email ?? 'Not provided' }}</div>
                </div>
            </div>
        </div>

        <div>
            <h2 class="section-title">Sanctum Token</h2>
            <div class="token-box">
                {{ $token ?? 'No token found in session.' }}
            </div>
        </div>

    </div>

    <!-- Bottom Navigation Bar -->
    <div class="bottom-nav">
        <a href="#" class="nav-item active">
            <svg class="nav-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Home
        </a>
        <a href="#" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
        </a>
    </div>
</body>

</html>