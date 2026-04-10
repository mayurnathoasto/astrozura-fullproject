<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'astrologer_id',
        'user_name',
        'user_email',
        'astrologer_name',
        'consultation_type',
        'duration',
        'booking_date',
        'booking_time',
        'amount',
        'status',
        'payment_status',
        'payment_id',
        'notes',
    ];
}
