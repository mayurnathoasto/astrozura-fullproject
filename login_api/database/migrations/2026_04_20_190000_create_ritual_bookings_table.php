<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ritual_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference')->unique();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('ritual_service_id');
            $table->unsignedBigInteger('astrologer_id')->nullable();
            $table->string('devotee_name');
            $table->string('devotee_email')->nullable();
            $table->string('devotee_phone')->nullable();
            $table->date('preferred_date');
            $table->string('preferred_time');
            $table->string('timezone')->default('Asia/Kolkata');
            $table->text('location_address')->nullable();
            $table->text('notes')->nullable();
            $table->json('birth_details')->nullable();
            $table->decimal('amount', 10, 2)->default(0);
            $table->string('status')->default('pending');
            $table->string('payment_status')->default('bypassed');
            $table->timestamps();

            $table->index(['ritual_service_id', 'status']);
            $table->index(['astrologer_id', 'preferred_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ritual_bookings');
    }
};
