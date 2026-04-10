<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login - {{ config('app.name') }}</title>
    <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet">
    <style>
        *,
        *::before,
        *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #0A2540;
            /* Navy Blue */
            --accent: #2065D1;
            /* Royal Blue */
            --accent-light: #4A83E8;
            --white: #FFFFFF;
            --bg-body: #F4F6F8;
            --text-dark: #111827;
            --text-muted: #6B7280;
            --border: #E5E7EB;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-body);
            color: var(--text-dark);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-image: radial-gradient(circle at top right, rgba(32, 101, 209, 0.08), transparent 40%),
                radial-gradient(circle at bottom left, rgba(10, 37, 64, 0.05), transparent 40%);
        }

        .auth-container {
            background: var(--white);
            padding: 50px 40px;
            width: 100%;
            max-width: 440px;
            border: 1px solid var(--border);
            border-radius: 4px;
            /* subtle luxury radius */
            box-shadow: 0 16px 40px rgba(10, 37, 64, 0.06);
        }

        .logo {
            text-align: center;
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 6px;
            color: var(--primary);
            text-transform: uppercase;
            margin-bottom: 40px;
        }

        .logo span {
            color: var(--accent);
        }

        h2 {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 8px;
            letter-spacing: 1px;
            color: var(--primary);
        }

        p.subtitle {
            text-align: center;
            color: var(--text-muted);
            font-size: 14px;
            margin-bottom: 30px;
            letter-spacing: 0.5px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--text-muted);
            font-weight: 600;
        }

        input[type="text"] {
            width: 100%;
            padding: 16px 20px;
            margin-bottom: 24px;
            background: #FAFAFB;
            border: 1px solid var(--border);
            color: var(--text-dark);
            font-size: 15px;
            font-family: 'Inter', sans-serif;
            transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
            outline: none;
            border-radius: 2px;
        }

        input::placeholder {
            color: #A0AABF;
        }

        input:focus {
            border-color: var(--accent);
            background: var(--white);
            box-shadow: 0 0 0 4px rgba(32, 101, 209, 0.1);
        }

        button {
            width: 100%;
            padding: 16px;
            background: var(--primary);
            color: var(--white);
            border: none;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 0.3s, transform 0.2s;
            font-family: 'Inter', sans-serif;
            border-radius: 2px;
        }

        button:hover {
            background: #07192A;
            transform: translateY(-2px);
        }

        .alert {
            padding: 14px 18px;
            margin-bottom: 24px;
            font-size: 13px;
            border-left: 3px solid;
            letter-spacing: 0.5px;
            border-radius: 2px;
        }

        .alert-success {
            background: rgba(76, 175, 80, 0.1);
            color: #2E7D32;
            border-color: #4CAF50;
        }

        .alert-danger {
            background: rgba(244, 67, 54, 0.1);
            color: #C62828;
            border-color: #F44336;
        }

        .otp-box {
            background: rgba(32, 101, 209, 0.04);
            padding: 24px;
            text-align: center;
            margin-bottom: 30px;
            border: 1px dashed rgba(32, 101, 209, 0.3);
            border-radius: 2px;
        }

        .otp-box p {
            margin: 0 0 8px 0;
            font-size: 10px;
            color: var(--accent);
            letter-spacing: 3px;
            text-transform: uppercase;
            font-weight: 600;
        }

        .otp-box h3 {
            margin: 0;
            color: var(--primary);
            font-size: 32px;
            letter-spacing: 12px;
            font-family: 'Inter', sans-serif;
        }

        .form-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .form-footer a {
            font-size: 12px;
            color: var(--accent);
            text-decoration: none;
            transition: color 0.3s;
            font-weight: 500;
        }

        .form-footer a:hover {
            color: var(--primary);
        }

        #otp {
            text-align: center;
            letter-spacing: 8px;
            font-size: 24px;
            font-weight: 600;
            padding: 18px;
        }
    </style>
</head>

<body>

    <div class="auth-container">

        <div class="logo">LU<span>X</span>E</div>

        <h2>Welcome Back</h2>
        <p class="subtitle">Enter your details to access your luxury account.</p>

        @if(session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        @if(session('dev_otp'))
            <div class="otp-box">
                <p>Developer Access Code</p>
                <h3>{{ session('dev_otp') }}</h3>
            </div>
        @endif

        @if($errors->any())
            <div class="alert alert-danger">
                {{ $errors->first() }}
            </div>
        @endif

        @if(!session('dev_otp'))
            <!-- Request OTP Form -->
            <form method="POST" action="{{ route('send.otp') }}">
                @csrf
                <label for="identifier">Email or Phone Number</label>
                <input id="identifier" name="identifier" type="text" value="{{ old('identifier') }}" required
                    placeholder="your@email.com or 9999999999">

                <button type="submit">Send Access Code</button>
            </form>
        @else
            <!-- Verify OTP Form -->
            <form method="POST" action="{{ route('login.post') }}">
                @csrf
                <input type="hidden" name="identifier" value="{{ session('identifier') }}">

                <div class="form-footer">
                    <label for="otp" style="margin-bottom: 0;">6-Digit Access Code</label>
                    <a href="{{ route('login') }}">Change Info?</a>
                </div>
                <input id="otp" name="otp" type="text" inputmode="numeric" pattern="[0-9]*" required placeholder="------"
                    maxlength="6">

                <button type="submit">Verify & Sign In</button>
            </form>
        @endif

    </div>

</body>

</html>