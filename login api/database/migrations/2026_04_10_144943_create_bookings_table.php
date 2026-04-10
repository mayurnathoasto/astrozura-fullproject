<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('astrologer_id')->nullable();
            $table->string('user_name')->nullable();
            $table->string('user_email')->nullable();
            $table->string('astrologer_name')->nullable();
            $table->string('consultation_type'); // chat, call
            $table->integer('duration'); // in minutes
            $table->date('booking_date');
            $table->string('booking_time');
            $table->decimal('amount', 10, 2)->default(0);
            $table->string('status')->default('pending'); // pending, confirmed, completed, cancelled
            $table->string('payment_status')->default('pending'); // pending, paid
            $table->string('payment_id')->nullable(); // razorpay/stripe id for later
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
