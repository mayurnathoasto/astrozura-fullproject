<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // User creates a booking
    public function store(Request $request)
    {
        $validated = $request->validate([
            'astrologer_id'     => 'nullable|integer',
            'astrologer_name'   => 'required|string',
            'consultation_type' => 'required|in:chat,call',
            'duration'          => 'required|integer|min:10',
            'booking_date'      => 'required|date',
            'booking_time'      => 'required|string',
            'amount'            => 'required|numeric',
            'user_name'         => 'nullable|string',
            'user_email'        => 'nullable|email',
            'notes'             => 'nullable|string',
        ]);

        // Get user info from token if logged in
        if ($request->user()) {
            $validated['user_id']    = $request->user()->id;
            $validated['user_name']  = $validated['user_name']  ?? $request->user()->name;
            $validated['user_email'] = $validated['user_email'] ?? $request->user()->email;
        }

        $booking = Booking::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'booking' => $booking,
        ], 201);
    }

    // User's own bookings history
    public function myBookings(Request $request)
    {
        $bookings = Booking::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'bookings' => $bookings]);
    }
}
