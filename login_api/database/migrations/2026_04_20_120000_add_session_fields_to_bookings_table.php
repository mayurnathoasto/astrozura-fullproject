<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('session_room_id')->nullable()->unique()->after('booking_reference');
            $table->dateTime('session_started_at')->nullable()->after('completed_at');
            $table->dateTime('session_ended_at')->nullable()->after('session_started_at');
            $table->dateTime('session_warning_sent_at')->nullable()->after('session_ended_at');
            $table->dateTime('session_last_activity_at')->nullable()->after('session_warning_sent_at');
            $table->string('session_ended_by')->nullable()->after('session_last_activity_at');
            $table->string('session_end_reason')->nullable()->after('session_ended_by');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropUnique(['session_room_id']);
            $table->dropColumn([
                'session_room_id',
                'session_started_at',
                'session_ended_at',
                'session_warning_sent_at',
                'session_last_activity_at',
                'session_ended_by',
                'session_end_reason',
            ]);
        });
    }
};
