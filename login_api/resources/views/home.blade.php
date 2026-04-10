<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LUXE — Premium Fashion Store</title>
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
            /* Deep Navy Blue */
            --accent: #2065D1;
            /* Royal Blue */
            --accent-light: #4A83E8;
            --white: #FFFFFF;
            --bg-body: #F4F6F8;
            /* Light Off-White/Gray */
            --bg-card: #FFFFFF;
            --text-dark: #111827;
            /* Near Black */
            --text-muted: #6B7280;
            /* Gray */
            --border: #E5E7EB;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-body);
            color: var(--text-dark);
            overflow-x: hidden;
        }

        /* === NAVBAR === */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 60px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border);
            transition: all 0.3s ease;
        }

        .logo {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 6px;
            color: var(--primary);
            text-transform: uppercase;
            text-decoration: none;
        }

        .logo span {
            color: var(--accent);
        }

        .nav-links {
            display: flex;
            gap: 40px;
            list-style: none;
        }

        .nav-links a {
            color: var(--text-dark);
            font-size: 13px;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--accent);
        }

        .nav-right {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .nav-icon {
            cursor: pointer;
            color: var(--text-dark);
            transition: color 0.3s;
        }

        .nav-icon:hover {
            color: var(--accent);
        }

        .cart-badge {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: var(--accent);
            color: var(--white);
            font-size: 10px;
            font-weight: 700;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* === HERO === */
        .hero {
            position: relative;
            height: 100vh;
            min-height: 700px;
            display: flex;
            align-items: center;
            background: url('/hero_banner.png') center center / cover no-repeat;
            overflow: hidden;
            margin-top: 80px;
            /* Offset for white navbar to show image below it properly or keep full screen */
            margin-top: 0;
        }

        .hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(110deg, rgba(10, 37, 64, 0.95) 40%, rgba(10, 37, 64, 0.4) 100%);
        }

        .hero-content {
            position: relative;
            z-index: 1;
            padding: 0 80px;
            max-width: 750px;
            animation: fadeUp 1s ease both;
        }

        .hero-badge {
            display: inline-block;
            border: 1px solid var(--accent-light);
            color: var(--accent-light);
            font-size: 11px;
            letter-spacing: 4px;
            text-transform: uppercase;
            padding: 6px 18px;
            margin-bottom: 28px;
            background: rgba(32, 101, 209, 0.1);
        }

        .hero h1 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(48px, 6vw, 80px);
            line-height: 1.1;
            font-weight: 700;
            margin-bottom: 24px;
            color: var(--white);
        }

        .hero h1 em {
            color: var(--accent-light);
            font-style: italic;
        }

        .hero p {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.8;
            margin-bottom: 44px;
            max-width: 480px;
        }

        .hero-btns {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
        }

        .btn-primary {
            display: inline-block;
            padding: 16px 40px;
            background: var(--accent);
            color: var(--white);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            text-decoration: none;
            transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
            cursor: pointer;
            border: none;
            border-radius: 2px;
        }

        .btn-primary:hover {
            background: var(--primary);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(10, 37, 64, 0.2);
        }

        .btn-outline {
            display: inline-block;
            padding: 16px 40px;
            background: transparent;
            color: var(--white);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            text-decoration: none;
            border: 1px solid rgba(255, 255, 255, 0.4);
            transition: border-color 0.3s, color 0.3s;
            cursor: pointer;
            border-radius: 2px;
        }

        .btn-outline:hover {
            border-color: var(--white);
            color: var(--white);
        }

        .hero-scroll {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 11px;
            letter-spacing: 3px;
            text-transform: uppercase;
            animation: bounce 2s infinite;
        }

        .scroll-line {
            width: 1px;
            height: 40px;
            background: rgba(255, 255, 255, 0.4);
        }

        /* === SECTION COMMON === */
        section {
            padding: 100px 60px;
        }

        .section-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .section-tag {
            display: inline-block;
            color: var(--accent);
            font-size: 11px;
            letter-spacing: 5px;
            text-transform: uppercase;
            margin-bottom: 16px;
            font-weight: 700;
        }

        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(32px, 4vw, 52px);
            font-weight: 600;
            color: var(--primary);
            line-height: 1.2;
        }

        .section-line {
            width: 60px;
            height: 3px;
            background: var(--accent);
            margin: 20px auto 0;
        }

        /* === CATEGORIES === */
        .categories {
            background: var(--white);
        }

        .cat-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .cat-card {
            position: relative;
            height: 380px;
            overflow: hidden;
            cursor: pointer;
            border-radius: 4px;
            /* subtle luxury */
            background: var(--bg-body);
        }

        .cat-card:first-child {
            grid-column: span 2;
            height: 460px;
        }

        .cat-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            filter: brightness(0.65);
            transition: filter 0.5s, transform 0.6s;
        }

        .cat-card:hover .cat-bg {
            filter: brightness(0.5);
            transform: scale(1.04);
        }

        .cat-bg-1 {
            background-image: url('/p1.png');
        }

        .cat-bg-2 {
            background-image: url('/p2.png');
        }

        .cat-bg-3 {
            background-image: url('/p3.png');
        }

        .cat-bg-4 {
            background-image: url('/p4.png');
        }

        .cat-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 30px;
            background: linear-gradient(to top, rgba(10, 37, 64, 0.9) 0%, transparent 100%);
        }

        .cat-info h3 {
            font-family: 'Playfair Display', serif;
            font-size: 22px;
            color: var(--white);
            margin-bottom: 6px;
        }

        .cat-info span {
            font-size: 12px;
            color: var(--accent-light);
            letter-spacing: 2px;
            font-weight: 600;
        }

        .cat-arrow {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s;
        }

        .cat-card:hover .cat-arrow {
            opacity: 1;
            transform: translateX(0);
            background: var(--accent);
            border-color: var(--accent);
        }

        /* === FEATURED PRODUCTS === */
        .featured {
            background: var(--bg-body);
        }

        .product-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 28px;
        }

        .product-card {
            background: var(--bg-card);
            cursor: pointer;
            position: relative;
            transition: transform 0.3s, box-shadow 0.3s;
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid var(--border);
        }

        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(10, 37, 64, 0.08);
            border-color: transparent;
        }

        .product-card:hover .product-overlay {
            opacity: 1;
        }

        .product-img-wrap {
            position: relative;
            overflow: hidden;
            aspect-ratio: 3/4;
            background: #fff;
        }

        .product-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 20px;
            transition: transform 0.5s;
        }

        .product-card:hover .product-img-wrap img {
            transform: scale(1.06);
        }

        .product-badge {
            position: absolute;
            top: 14px;
            left: 14px;
            background: var(--accent);
            color: var(--white);
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 2px;
            padding: 4px 10px;
            text-transform: uppercase;
            border-radius: 2px;
        }

        .product-overlay {
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .product-overlay button {
            background: var(--primary);
            color: var(--white);
            border: none;
            padding: 14px 30px;
            border-radius: 2px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 0.2s, transform 0.2s;
        }

        .product-overlay button:hover {
            background: var(--accent);
            transform: scale(1.05);
        }

        .product-info {
            padding: 20px 20px 24px;
            border-top: 1px solid var(--border);
        }

        .product-brand {
            font-size: 10px;
            color: var(--accent);
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 6px;
            font-weight: 700;
        }

        .product-name {
            font-family: 'Playfair Display', serif;
            font-size: 17px;
            color: var(--primary);
            margin-bottom: 12px;
            font-weight: 600;
        }

        .product-price-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .product-price {
            font-size: 18px;
            font-weight: 700;
            color: var(--primary);
        }

        .product-old-price {
            font-size: 13px;
            color: var(--text-muted);
            text-decoration: line-through;
            margin-left: 8px;
        }

        .wishlist-btn {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 1px solid var(--border);
            background: var(--white);
            color: var(--text-muted);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            font-size: 16px;
        }

        .wishlist-btn:hover {
            border-color: var(--accent);
            color: var(--accent);
            background: rgba(32, 101, 209, 0.05);
        }

        .view-all-btn {
            display: inline-block;
            padding: 16px 40px;
            background: transparent;
            color: var(--primary);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            text-decoration: none;
            border: 2px solid var(--primary);
            transition: all 0.3s;
            cursor: pointer;
            border-radius: 2px;
        }

        .view-all-btn:hover {
            background: var(--primary);
            color: var(--white);
        }

        /* === PROMO BANNER === */
        .promo-section {
            background: var(--white);
            padding: 60px;
        }

        .promo-inner {
            position: relative;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            overflow: hidden;
            max-width: 1200px;
            margin: 0 auto;
            border-radius: 4px;
            box-shadow: 0 20px 40px rgba(10, 37, 64, 0.08);
        }

        .promo-left {
            background: var(--primary);
            padding: 80px 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .promo-left h2 {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            color: var(--white);
            line-height: 1.1;
            margin-bottom: 16px;
        }

        .promo-left p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 32px;
            font-size: 15px;
        }

        .promo-left .btn-dark {
            background: var(--accent);
            color: var(--white);
            display: inline-block;
            padding: 16px 36px;
            align-self: flex-start;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: background 0.3s;
            border-radius: 2px;
        }

        .promo-left .btn-dark:hover {
            background: var(--accent-light);
        }

        .promo-right {
            background: url('/p1.png') center center / cover no-repeat;
            min-height: 380px;
            position: relative;
        }

        .promo-right::before {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(10, 37, 64, 0.2);
        }

        /* === TESTIMONIALS === */
        .testimonials {
            background: var(--bg-body);
            text-align: center;
        }

        .testimonial-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin-top: 60px;
        }

        .testimonial-card {
            background: var(--white);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 40px 32px;
            position: relative;
            text-align: left;
            transition: all 0.3s;
        }

        .testimonial-card:hover {
            border-color: var(--accent);
            box-shadow: 0 10px 30px rgba(32, 101, 209, 0.08);
            transform: translateY(-4px);
        }

        .stars {
            color: var(--accent);
            font-size: 14px;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }

        .testimonial-text {
            font-family: 'Playfair Display', serif;
            font-size: 16px;
            color: var(--text-dark);
            line-height: 1.8;
            margin-bottom: 28px;
            font-style: italic;
        }

        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .author-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent), var(--primary));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
            color: var(--white);
        }

        .author-name {
            font-weight: 700;
            font-size: 14px;
            color: var(--primary);
        }

        .author-tag {
            font-size: 12px;
            color: var(--text-muted);
        }

        .quote-icon {
            position: absolute;
            top: 24px;
            right: 28px;
            font-size: 60px;
            color: rgba(32, 101, 209, 0.06);
            font-family: 'Playfair Display', serif;
            line-height: 1;
        }

        /* === NEWSLETTER === */
        .newsletter {
            background: var(--primary);
            text-align: center;
            padding: 100px 60px;
            color: var(--white);
        }

        .newsletter .section-tag {
            color: var(--accent-light);
        }

        .newsletter h2 {
            font-family: 'Playfair Display', serif;
            font-size: 44px;
            margin-bottom: 16px;
        }

        .newsletter p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 40px;
            font-size: 16px;
        }

        .email-form {
            display: flex;
            max-width: 500px;
            margin: 0 auto;
        }

        .email-form input {
            flex: 1;
            padding: 18px 24px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-right: none;
            border-radius: 2px 0 0 2px;
            color: var(--white);
            font-size: 14px;
            outline: none;
            font-family: 'Inter', sans-serif;
            transition: border-color 0.3s, background 0.3s;
        }

        .email-form input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .email-form input:focus {
            border-color: var(--accent-light);
            background: rgba(255, 255, 255, 0.1);
        }

        .email-form button {
            padding: 18px 36px;
            border-radius: 0 2px 2px 0;
            background: var(--accent);
            color: var(--white);
            border: none;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 0.3s;
        }

        .email-form button:hover {
            background: var(--accent-light);
        }

        /* === FOOTER === */
        footer {
            background: var(--white);
            border-top: 1px solid var(--border);
            padding: 80px 60px 40px;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 60px;
            margin-bottom: 60px;
        }

        .footer-brand .logo {
            display: block;
            margin-bottom: 20px;
            font-size: 22px;
            text-align: left;
        }

        .footer-brand p {
            color: var(--text-muted);
            font-size: 14px;
            line-height: 1.8;
            max-width: 280px;
        }

        .footer-socials {
            display: flex;
            gap: 14px;
            margin-top: 24px;
        }

        .social-icon {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 1px solid var(--border);
            background: var(--bg-body);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        }

        .social-icon:hover {
            border-color: var(--accent);
            color: var(--white);
            background: var(--accent);
        }

        .footer-col h4 {
            font-size: 12px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--primary);
            margin-bottom: 24px;
            font-weight: 800;
        }

        .footer-col ul {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .footer-col ul a {
            color: var(--text-muted);
            font-size: 14px;
            text-decoration: none;
            transition: color 0.3s;
            font-weight: 500;
        }

        .footer-col ul a:hover {
            color: var(--accent);
            padding-left: 4px;
        }

        .footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 40px;
            border-top: 1px solid var(--border);
            color: var(--text-muted);
            font-size: 13px;
            font-weight: 500;
        }

        /* === ANIMATIONS === */
        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes bounce {

            0%,
            100% {
                transform: translateX(-50%) translateY(0);
            }

            50% {
                transform: translateX(-50%) translateY(-10px);
            }
        }

        /* === SCROLLBAR === */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-body);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--accent);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary);
        }
    </style>
</head>

<body>

    <!-- NAVBAR -->
    <nav class="navbar">
        <a href="#" class="logo">LU<span>X</span>E</a>
        <ul class="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Collections</a></li>
            <li><a href="#">New In</a></li>
            <li><a href="#">Sale</a></li>
            <li><a href="#">About</a></li>
        </ul>
        <div class="nav-right">
            <!-- Search -->
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
            <!-- Wishlist -->
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <!-- Cart -->
            <div class="cart-badge">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span class="badge">3</span>
            </div>
            <!-- Profile (Logout button for auth flow demo) -->
            <form method="POST" action="{{ route('logout') }}" style="display:inline; margin:0;">
                @csrf
                <button type="submit"
                    style="background:none;border:none;padding:0;cursor:pointer;display:flex;align-items:center;">
                    <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </button>
            </form>
        </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
        <div class="hero-content">
            <div class="hero-badge">New Collection 2025</div>
            <h1>Redefine Your <em>Elegance</em></h1>
            <p>Curated luxury pieces for those who appreciate refined craftsmanship, timeless style, and the art of
                sophisticated living.</p>
            <div class="hero-btns">
                <a href="#" class="btn-primary">Explore Collection</a>
                <a href="#" class="btn-outline">Watch Story</a>
            </div>
        </div>
        <div class="hero-scroll">
            <div class="scroll-line"></div>
            Scroll
        </div>
    </section>

    <!-- CATEGORIES -->
    <section class="categories">
        <div class="section-header">
            <div class="section-tag">Shop by Category</div>
            <h2 class="section-title">Curated Collections</h2>
            <div class="section-line"></div>
        </div>
        <div class="cat-grid">
            <div class="cat-card">
                <div class="cat-bg cat-bg-1"></div>
                <div class="cat-arrow">→</div>
                <div class="cat-info">
                    <h3>Handbags</h3>
                    <span>48 Products</span>
                </div>
            </div>
            <div class="cat-card">
                <div class="cat-bg cat-bg-2"></div>
                <div class="cat-arrow">→</div>
                <div class="cat-info">
                    <h3>Watches</h3>
                    <span>32 Products</span>
                </div>
            </div>
            <div class="cat-card">
                <div class="cat-bg cat-bg-3"></div>
                <div class="cat-arrow">→</div>
                <div class="cat-info">
                    <h3>Footwear</h3>
                    <span>56 Products</span>
                </div>
            </div>
            <div class="cat-card">
                <div class="cat-bg cat-bg-4"></div>
                <div class="cat-arrow">→</div>
                <div class="cat-info">
                    <h3>Eyewear</h3>
                    <span>24 Products</span>
                </div>
            </div>
        </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="featured">
        <div class="section-header">
            <div class="section-tag">Handpicked</div>
            <h2 class="section-title">Featured Products</h2>
            <div class="section-line"></div>
        </div>
        <div class="product-grid">
            <div class="product-card">
                <div class="product-img-wrap">
                    <img src="/p1.png" alt="Leather Bag">
                    <div class="product-badge">New</div>
                    <div class="product-overlay"><button>Quick Add</button></div>
                </div>
                <div class="product-info">
                    <div class="product-brand">LUXE Collection</div>
                    <div class="product-name">Milano Leather Tote</div>
                    <div class="product-price-row">
                        <div><span class="product-price">₹14,999</span><span class="product-old-price">₹19,999</span>
                        </div>
                        <button class="wishlist-btn">♡</button>
                    </div>
                </div>
            </div>
            <div class="product-card">
                <div class="product-img-wrap">
                    <img src="/p2.png" alt="Watch">
                    <div class="product-badge" style="background:var(--primary)">Bestseller</div>
                    <div class="product-overlay"><button>Quick Add</button></div>
                </div>
                <div class="product-info">
                    <div class="product-brand">Prestige Watch Co.</div>
                    <div class="product-name">Aurelius Chronograph</div>
                    <div class="product-price-row">
                        <div><span class="product-price">₹49,999</span></div>
                        <button class="wishlist-btn">♡</button>
                    </div>
                </div>
            </div>
            <div class="product-card">
                <div class="product-img-wrap">
                    <img src="/p3.png" alt="Sneaker">
                    <div class="product-overlay"><button>Quick Add</button></div>
                </div>
                <div class="product-info">
                    <div class="product-brand">LUXE Footwear</div>
                    <div class="product-name">Pure White Court</div>
                    <div class="product-price-row">
                        <div><span class="product-price">₹8,499</span><span class="product-old-price">₹11,999</span>
                        </div>
                        <button class="wishlist-btn">♡</button>
                    </div>
                </div>
            </div>
            <div class="product-card">
                <div class="product-img-wrap">
                    <img src="/p4.png" alt="Sunglasses">
                    <div class="product-badge" style="background:#E53935">Sale</div>
                    <div class="product-overlay"><button>Quick Add</button></div>
                </div>
                <div class="product-info">
                    <div class="product-brand">Vista Eyewear</div>
                    <div class="product-name">Goldframe Aviator</div>
                    <div class="product-price-row">
                        <div><span class="product-price">₹5,299</span><span class="product-old-price">₹7,999</span>
                        </div>
                        <button class="wishlist-btn">♡</button>
                    </div>
                </div>
            </div>
        </div>
        <div style="text-align:center; margin-top:56px;">
            <a href="#" class="view-all-btn">View All Products</a>
        </div>
    </section>

    <!-- PROMO BANNER -->
    <div class="promo-section">
        <div class="promo-inner">
            <div class="promo-left">
                <h2>Up to 40% Off On Premium Picks</h2>
                <p>Limited time, exclusively curated deals for our most loyal customers. Don't miss out.</p>
                <a href="#" class="btn-dark">Shop the Sale</a>
            </div>
            <div class="promo-right"></div>
        </div>
    </div>

    <!-- TESTIMONIALS -->
    <section class="testimonials">
        <div class="section-header">
            <div class="section-tag">Client Stories</div>
            <h2 class="section-title">What Our Clients Say</h2>
            <div class="section-line"></div>
        </div>
        <div class="testimonial-grid">
            <div class="testimonial-card">
                <div class="quote-icon">"</div>
                <div class="stars">★★★★★</div>
                <p class="testimonial-text">"The quality of the leather tote is simply unmatched. It's been three months
                    and it looks better every single day. Absolutely worth the investment."</p>
                <div class="testimonial-author">
                    <div class="author-avatar">P</div>
                    <div>
                        <div class="author-name">Priya Sharma</div>
                        <div class="author-tag">Verified Customer · Mumbai</div>
                    </div>
                </div>
            </div>
            <div class="testimonial-card">
                <div class="quote-icon">"</div>
                <div class="stars">★★★★★</div>
                <p class="testimonial-text">"I bought the Aurelius watch for a special occasion. The packaging was
                    exquisite and the watch itself is breathtaking. LUXE never disappoints."</p>
                <div class="testimonial-author">
                    <div class="author-avatar">R</div>
                    <div>
                        <div class="author-name">Rahul Mehta</div>
                        <div class="author-tag">Verified Customer · Delhi</div>
                    </div>
                </div>
            </div>
            <div class="testimonial-card">
                <div class="quote-icon">"</div>
                <div class="stars">★★★★★</div>
                <p class="testimonial-text">"Finally a brand that understands true luxury. The delivery was fast, the
                    product was authentic and every detail was just perfect. My go-to luxury store."</p>
                <div class="testimonial-author">
                    <div class="author-avatar">A</div>
                    <div>
                        <div class="author-name">Aisha Khan</div>
                        <div class="author-tag">Verified Customer · Hyderabad</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter">
        <div class="section-tag">Stay Connected</div>
        <h2>Join the LUXE Circle</h2>
        <p>Get early access to new arrivals, exclusive offers, and curated style inspiration.</p>
        <form class="email-form" onsubmit="return false;">
            <input type="email" placeholder="Your email address">
            <button type="submit">Subscribe</button>
        </form>
    </section>

    <!-- FOOTER -->
    <footer>
        <div class="footer-grid">
            <div class="footer-brand">
                <a href="#" class="logo">LU<span>X</span>E</a>
                <p>Curating the finest luxury goods from around the world. Experience unmatched quality, craftsmanship,
                    and elegance.</p>
                <div class="footer-socials">
                    <div class="social-icon">f</div>
                    <div class="social-icon">in</div>
                    <div class="social-icon">tw</div>
                    <div class="social-icon">ig</div>
                </div>
            </div>
            <div class="footer-col">
                <h4>Shop</h4>
                <ul>
                    <li><a href="#">New Arrivals</a></li>
                    <li><a href="#">Handbags</a></li>
                    <li><a href="#">Watches</a></li>
                    <li><a href="#">Footwear</a></li>
                    <li><a href="#">Eyewear</a></li>
                    <li><a href="#">Sale</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Help</h4>
                <ul>
                    <li><a href="#">My Account</a></li>
                    <li><a href="#">Track Order</a></li>
                    <li><a href="#">Returns</a></li>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Contact Us</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Company</h4>
                <ul>
                    <li><a href="#">About LUXE</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Sustainability</a></li>
                    <li><a href="#">Press</a></li>
                    <li><a href="#">Terms & Privacy</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <span>© 2025 LUXE Store. All rights reserved.</span>
            <span>Designed with ♥ for premium experiences</span>
        </div>
    </footer>

</body>

</html>