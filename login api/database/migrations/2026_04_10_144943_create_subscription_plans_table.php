<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Scholar, Mystic, Sage
            $table->decimal('price', 10, 2);
            $table->json('features'); // stored as JSON array
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert default plans
        DB::table('subscription_plans')->insert([
            [
                'name' => 'Scholar',
                'price' => 19.00,
                'features' => json_encode(['Daily Horoscopes', 'Basic Birth Chart', 'Weekly Transit Alerts', 'Email Support']),
                'is_popular' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mystic',
                'price' => 49.00,
                'features' => json_encode(['Everything in Scholar', 'Detailed Reports', 'Monthly Predictions', 'Priority Email Support', 'Exclusive Content Access']),
                'is_popular' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sage',
                'price' => 149.00,
                'features' => json_encode(['Everything in Mystic', '1-on-1 Consultation', 'Astrologer Guidance', 'Annual Forecast Reports', 'VIP Early Access']),
                'is_popular' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
