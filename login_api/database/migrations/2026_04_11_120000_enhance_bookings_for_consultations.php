<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('booking_reference')->nullable()->unique()->after('id');
            $table->dateTime('scheduled_at')->nullable()->after('booking_time');
            $table->dateTime('ends_at')->nullable()->after('scheduled_at');
            $table->string('timezone')->default('Asia/Kolkata')->after('ends_at');
            $table->string('payment_method')->default('mock_gateway')->after('payment_status');
            $table->timestamp('completed_at')->nullable()->after('payment_id');
            $table->index(['astrologer_id', 'status']);
            $table->index(['scheduled_at']);
        });

        $bookings = DB::table('bookings')->select('id', 'booking_date', 'booking_time', 'duration')->get();

        foreach ($bookings as $booking) {
            $scheduledAt = null;
            $endsAt = null;

            if (!empty($booking->booking_date) && !empty($booking->booking_time)) {
                try {
                    $scheduledAt = Carbon::createFromFormat(
                        'Y-m-d g:i A',
                        "{$booking->booking_date} {$booking->booking_time}",
                        'Asia/Kolkata'
                    );
                } catch (\Throwable $exception) {
                    try {
                        $scheduledAt = Carbon::parse("{$booking->booking_date} {$booking->booking_time}", 'Asia/Kolkata');
                    } catch (\Throwable $ignored) {
                        $scheduledAt = null;
                    }
                }

                if ($scheduledAt) {
                    $endsAt = $scheduledAt->copy()->addMinutes((int) ($booking->duration ?? 0));
                }
            }

            DB::table('bookings')
                ->where('id', $booking->id)
                ->update([
                    'booking_reference' => 'BK-' . str_pad((string) $booking->id, 6, '0', STR_PAD_LEFT),
                    'scheduled_at' => $scheduledAt,
                    'ends_at' => $endsAt,
                    'timezone' => 'Asia/Kolkata',
                    'payment_method' => 'mock_gateway',
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['astrologer_id', 'status']);
            $table->dropIndex(['scheduled_at']);
            $table->dropUnique(['booking_reference']);
            $table->dropColumn([
                'booking_reference',
                'scheduled_at',
                'ends_at',
                'timezone',
                'payment_method',
                'completed_at',
            ]);
        });
    }
};
