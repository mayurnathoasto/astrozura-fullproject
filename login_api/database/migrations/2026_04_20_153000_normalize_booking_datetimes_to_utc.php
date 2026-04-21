<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $dateTimeColumns = [
        'scheduled_at',
        'ends_at',
        'completed_at',
        'session_started_at',
        'session_ended_at',
        'session_warning_sent_at',
        'session_last_activity_at',
    ];

    public function up(): void
    {
        $bookings = DB::table('bookings')
            ->select(array_merge(['id', 'timezone'], $this->dateTimeColumns))
            ->get();

        foreach ($bookings as $booking) {
            $timezone = $booking->timezone ?: 'Asia/Kolkata';
            $updates = [];

            foreach ($this->dateTimeColumns as $column) {
                if (empty($booking->{$column})) {
                    continue;
                }

                $updates[$column] = Carbon::parse($booking->{$column}, $timezone)
                    ->utc()
                    ->format('Y-m-d H:i:s');
            }

            if (!empty($updates)) {
                DB::table('bookings')
                    ->where('id', $booking->id)
                    ->update($updates);
            }
        }
    }

    public function down(): void
    {
        $bookings = DB::table('bookings')
            ->select(array_merge(['id', 'timezone'], $this->dateTimeColumns))
            ->get();

        foreach ($bookings as $booking) {
            $timezone = $booking->timezone ?: 'Asia/Kolkata';
            $updates = [];

            foreach ($this->dateTimeColumns as $column) {
                if (empty($booking->{$column})) {
                    continue;
                }

                $updates[$column] = Carbon::parse($booking->{$column}, 'UTC')
                    ->timezone($timezone)
                    ->format('Y-m-d H:i:s');
            }

            if (!empty($updates)) {
                DB::table('bookings')
                    ->where('id', $booking->id)
                    ->update($updates);
            }
        }
    }
};
