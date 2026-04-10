<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::updateOrCreate(
    ['email' => 'astrologer@example.com'],
    [
        'name' => 'Demo Astrologer',
        'password' => Hash::make('password123'),
        'role' => 'astrologer',
        'is_profile_complete' => true
    ]
);
echo "Astrologer account created successfully!\n";
