<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_reference',
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
        'notes',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'scheduled_at' => 'datetime',
        'ends_at' => 'datetime',
        'completed_at' => 'datetime',
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
