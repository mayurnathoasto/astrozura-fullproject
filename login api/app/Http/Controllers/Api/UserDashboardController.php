<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserDashboardController extends Controller
{
    /**
     * Get the authenticated user's profile.
     */
    public function getProfile(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20|unique:users,phone,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        $user->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }

    /**
     * Get the authenticated user's orders.
     */
    public function getOrders(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * Get the authenticated user's wishlist.
     */
    public function getWishlist(Request $request)
    {
        $wishlist = Wishlist::with('product')
            ->where('user_id', $request->user()->id)
            ->get()
            ->pluck('product');

        return response()->json([
            'status' => 'success',
            'data' => $wishlist
        ]);
    }

    /**
     * Toggle a product in the user's wishlist.
     */
    public function toggleWishlist(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        $user = $request->user();
        $productId = $request->product_id;

        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($exists) {
            $exists->delete();
            $message = 'Removed from wishlist';
            $inWishlist = false;
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId
            ]);
            $message = 'Added to wishlist';
            $inWishlist = true;
        }

        return response.json([
            'status' => 'success',
            'message' => $message,
            'in_wishlist' => $inWishlist
        ]);
    }

    /**
     * Store a new order from checkout.
     */
    public function storeOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'shipping_address' => 'required|string',
            'phone' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        $user = $request->user();
        
        // Use database transaction
        return \DB::transaction(function () use ($request, $user) {
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'total_amount' => $request->total_amount,
                'status' => 'pending',
                'payment_status' => $request->payment_method === 'cod' ? 'unpaid' : 'paid',
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
                'notes' => $request->notes,
            ]);

            foreach ($request->items as $item) {
                $order->items()->create([
                    'product_id' => $item['id'],
                    'quantity' => $item['qty'],
                    'price' => $item['price'],
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Order placed successfully',
                'order' => $order->load('items')
            ]);
        });
    }
}
