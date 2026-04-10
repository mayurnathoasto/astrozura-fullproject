<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;
use App\Models\Product;

echo "Adding demo categories...\n";

$cat1 = Category::firstOrCreate(['name' => 'Ethical Crystals'], ['status' => 1]);
$cat2 = Category::firstOrCreate(['name' => 'Sacred Books'], ['status' => 1]);
$cat3 = Category::firstOrCreate(['name' => 'Authentic Rudraksha'], ['status' => 1]);
$cat4 = Category::firstOrCreate(['name' => 'Ritual Kits'], ['status' => 1]);

echo "Adding demo products...\n";

Product::firstOrCreate(['name' => 'Citrine Energy Point'], [
    'category_id' => $cat1->id,
    'description' => 'A wonderful healing crystal for positive energy.',
    'price' => 48.00,
    'is_trending' => 1,
    'status' => 1
]);

Product::firstOrCreate(['name' => 'Moon Phase Ritual Kit'], [
    'category_id' => $cat4->id,
    'description' => 'A complete ritual kit for the moon phases.',
    'price' => 65.00,
    'is_trending' => 1,
    'status' => 1
]);

Product::firstOrCreate(['name' => 'Vedic Wisdom Journal'], [
    'category_id' => $cat2->id,
    'description' => 'Stationery to write down your deepest thoughts.',
    'price' => 32.00,
    'is_trending' => 1,
    'status' => 1
]);

Product::firstOrCreate(['name' => '5-Mukhi Mala Beads'], [
    'category_id' => $cat3->id,
    'description' => 'Authentic rudraksha beads from Nepal.',
    'price' => 89.00,
    'is_trending' => 1,
    'status' => 1
]);

echo "Done! Demo data is successfully added.\n";
