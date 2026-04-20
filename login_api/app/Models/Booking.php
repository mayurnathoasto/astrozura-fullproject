<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_reference',
        'session_room_id',
        'user_id',
        'astrologer_id',
        'user_name',
        'user_email',
        'astrologer_name',
        'consultation_type',
        'duration',
        'booking_date',
        'booking_time',
        'scheduled_at',
        'ends_at',
        'timezone',
        'amount',
        'status',
        'payment_status',
        'payment_method',
        'payment_id',
        'completed_at',
        'session_started_at',
        'session_ended_at',
        'session_warning_sent_at',
        'session_last_activity_at',
        'session_ended_by',
        'session_end_reason',
        'notes',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'scheduled_at' => 'datetime',
        'ends_at' => 'datetime',
        'completed_at' => 'datetime',
        'session_started_at' => 'datetime',
        'session_ended_at' => 'datetime',
        'session_warning_sent_at' => 'datetime',
        'session_last_activity_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function astrologer()
    {
        return $this->belongsTo(User::class, 'astrologer_id');
    }
}
