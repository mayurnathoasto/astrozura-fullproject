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
    $nowUtc = Carbon::now('UTC');
    $now = $nowUtc->copy()->timezone($timezone);
    $warningThreshold = (int) config('zego.session.low_time_warning_seconds', 120);

    $expired = Booking::query()
        ->whereIn('status', ['confirmed', 'in_progress'])
        ->whereNotNull('ends_at')
        ->where('ends_at', '<=', $nowUtc)
        ->get();

    foreach ($expired as $booking) {
        $booking->update([
            'status' => 'completed',
            'completed_at' => $booking->completed_at ?: $nowUtc,
            'session_ended_at' => $booking->session_ended_at ?: $nowUtc,
            'session_end_reason' => $booking->session_end_reason ?: 'time_limit_reached',
            'session_ended_by' => $booking->session_ended_by ?: 'system',
            'session_last_activity_at' => $nowUtc,
        ]);
    }

    $warned = Booking::query()
        ->where('status', 'in_progress')
        ->whereNull('session_warning_sent_at')
        ->whereNotNull('ends_at')
        ->get()
        ->filter(function (Booking $booking) use ($nowUtc, $warningThreshold) {
            $remainingSeconds = $nowUtc->diffInSeconds($booking->ends_at?->copy()->utc(), false);
            return $remainingSeconds > 0 && $remainingSeconds <= $warningThreshold;
        });

    foreach ($warned as $booking) {
        $booking->update([
            'session_warning_sent_at' => $nowUtc,
            'session_last_activity_at' => $nowUtc,
        ]);
    }

    $this->info(sprintf(
        'Synced %d expired bookings and marked %d live sessions for low-time warning.',
        $expired->count(),
        $warned->count()
    ));
})->purpose('Sync consultation sessions with booked slot timing');

Artisan::command('bookings:repair-future-statuses', function () {
    $nowUtc = Carbon::now('UTC');

    $reopened = Booking::query()
        ->where('status', 'completed')
        ->where('session_end_reason', 'time_limit_reached')
        ->whereNotNull('ends_at')
        ->where('ends_at', '>', $nowUtc)
        ->get();

    foreach ($reopened as $booking) {
        $shouldBeLive = $booking->session_started_at !== null
            && $booking->session_started_at->copy()->utc()->lessThanOrEqualTo($nowUtc);

        $booking->update([
            'status' => $shouldBeLive ? 'in_progress' : 'confirmed',
            'completed_at' => null,
            'session_ended_at' => null,
            'session_warning_sent_at' => null,
            'session_end_reason' => null,
            'session_ended_by' => null,
            'session_last_activity_at' => $nowUtc,
        ]);
    }

    $this->info(sprintf(
        'Repaired %d bookings that were incorrectly auto-closed before their real end time.',
        $reopened->count()
    ));
})->purpose('Reopen bookings that were closed early due to timezone mismatch');

Schedule::command('bookings:sync-sessions')->everyMinute();
