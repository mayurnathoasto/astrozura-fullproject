<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\AstrologerDetail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

$astrologersData = [
    [
        'name' => 'Acharya Rahul',
        'email' => 'rahul' . rand(100, 999) . '@test.com',
        'password' => Hash::make('password'),
        'role' => 'astrologer',
        'details' => [
            'experience_years' => 12,
            'specialities' => 'Vedic Astrology & Love Specialist',
            'chat_price' => 20,
            'call_price' => 25,
            'rating' => 4.8,
            'is_featured' => false,
            'profile_image' => '', // Will fallback to default in frontend component initially, we won't be able to provide the local imported image easily without uploading. Wait, the frontend relies on index matches if image is missing. Let me pass a dummy path or leave empty.
        ]
    ],
    [
        'name' => 'Pandit Meera',
        'email' => 'meera' . rand(100, 999) . '@test.com',
        'password' => Hash::make('password'),
        'role' => 'astrologer',
        'details' => [
            'experience_years' => 9,
            'specialities' => 'Career & Vedic Astrology Expert',
            'chat_price' => 35,
            'call_price' => 22,
            'rating' => 4.9,
            'is_featured' => false,
            'profile_image' => '',
        ]
    ],
    [
        'name' => 'Guru Devendra',
        'email' => 'devendra' . rand(100, 999) . '@test.com',
        'password' => Hash::make('password'),
        'role' => 'astrologer',
        'details' => [
            'experience_years' => 15,
            'specialities' => 'Marriage & Kundli Specialist',
            'chat_price' => 30,
            'call_price' => 40,
            'rating' => 4.7,
            'is_featured' => false,
            'profile_image' => '',
        ]
    ],
    [
        'name' => 'Dr. Aruna Sharma',
        'email' => 'aruna' . rand(100, 999) . '@test.com',
        'password' => Hash::make('password'),
        'role' => 'astrologer',
        'details' => [
            'experience_years' => 22,
            'specialities' => 'Vedic Astrology & Career Alignment Specialist',
            'about_bio' => 'Empowering individuals to align their career paths with celestial movements.',
            'chat_price' => 50,
            'call_price' => 60,
            'rating' => 4.9,
            'is_featured' => true,
            'profile_image' => '',
        ]
    ]
];

foreach ($astrologersData as $data) {
    $user = User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => $data['password'],
        'role' => $data['role'],
        'phone' => '98765' . rand(10000, 99999),
    ]);

    AstrologerDetail::create(array_merge(['user_id' => $user->id], $data['details']));
    echo "Inserted: " . $data['name'] . "\n";
}

echo "Done seeding.\n";
