<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('plan_id');
            $table->string('user_name')->nullable();
            $table->string('user_email')->nullable();
            $table->string('plan_name')->nullable();
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->string('status')->default('active'); // active, expired, cancelled
            $table->string('payment_status')->default('pending'); // pending, paid
            $table->string('payment_id')->nullable(); // razorpay/stripe for later
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_subscriptions');
    }
};
