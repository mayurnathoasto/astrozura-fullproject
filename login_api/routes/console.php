<?php

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('bookings:sync-sessions', function () {
    $timezone = 'Asia/Kolkata';
    $now = Carbon::now($timezone);
    $warningThreshold = (int) config('zego.session.low_time_warning_seconds', 120);

    $expired = Booking::query()
        ->whereIn('status', ['confirmed', 'in_progress'])
        ->whereNotNull('ends_at')
        ->where('ends_at', '<=', $now)
        ->get();

    foreach ($expired as $booking) {
        $booking->update([
            'status' => 'completed',
            'completed_at' => $booking->completed_at ?: $now,
            'session_ended_at' => $booking->session_ended_at ?: $now,
            'session_end_reason' => $booking->session_end_reason ?: 'time_limit_reached',
            'session_ended_by' => $booking->session_ended_by ?: 'system',
            'session_last_activity_at' => $now,
        ]);
    }

    $warned = Booking::query()
        ->where('status', 'in_progress')
        ->whereNull('session_warning_sent_at')
        ->whereNotNull('ends_at')
        ->get()
        ->filter(function (Booking $booking) use ($now, $warningThreshold) {
            $remainingSeconds = $now->diffInSeconds($booking->ends_at, false);
            return $remainingSeconds > 0 && $remainingSeconds <= $warningThreshold;
        });

    foreach ($warned as $booking) {
        $booking->update([
            'session_warning_sent_at' => $now,
            'session_last_activity_at' => $now,
        ]);
    }

    $this->info(sprintf(
        'Synced %d expired bookings and marked %d live sessions for low-time warning.',
        $expired->count(),
        $warned->count()
    ));
})->purpose('Sync consultation sessions with booked slot timing');

Schedule::command('bookings:sync-sessions')->everyMinute();
