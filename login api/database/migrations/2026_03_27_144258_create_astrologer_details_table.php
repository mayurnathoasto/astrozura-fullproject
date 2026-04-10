<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('astrologer_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('experience_years')->default(0);
            $table->string('languages')->nullable(); // e.g., "English, Hindi"
            $table->string('specialities')->nullable(); // e.g., "Vedic Astrology, Tarot"
            $table->text('about_bio')->nullable();
            $table->decimal('chat_price', 8, 2)->default(0);
            $table->decimal('call_price', 8, 2)->default(0);
            $table->decimal('rating', 3, 2)->default(5.0);
            $table->integer('total_reviews')->default(0);
            $table->string('profile_image')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('astrologer_details');
    }
};
