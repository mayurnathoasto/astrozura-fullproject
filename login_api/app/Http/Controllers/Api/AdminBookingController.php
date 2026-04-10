<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    // Get all bookings with optional filters
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'astrologer.astrologerDetail'])->orderByDesc('scheduled_at');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('user_name', 'like', "%$search%")
                  ->orWhere('user_email', 'like', "%$search%")
                  ->orWhere('astrologer_name', 'like', "%$search%")
                  ->orWhere('consultation_type', 'like', "%$search%")
                  ->orWhere('status', 'like', "%$search%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->type) {
            $query->where('consultation_type', $request->type);
        }

        $bookings = $query->get();

        return response()->json(['success' => true, 'bookings' => $bookings]);
    }

    // Update booking status (e.g. confirm, complete, cancel)
    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $payload = ['status' => $request->status];

        if ($request->status === 'completed') {
            $payload['completed_at'] = now('Asia/Kolkata');
        }

        $booking->update($payload);

        return response()->json(['success' => true, 'message' => 'Booking status updated', 'booking' => $booking]);
    }

    // Stats for dashboard
    public function stats()
    {
        return response()->json([
            'success' => true,
            'total'     => Booking::count(),
            'pending'   => Booking::whereIn('status', ['pending', 'confirmed', 'in_progress'])->count(),
            'completed' => Booking::where('status', 'completed')->count(),
            'revenue'   => Booking::where('payment_status', 'paid')->sum('amount'),
        ]);
    }
}
