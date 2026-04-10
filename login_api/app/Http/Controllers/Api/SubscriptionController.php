<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    // Public: Get all active plans
    public function getPlans()
    {
        $plans = SubscriptionPlan::where('is_active', true)->orderBy('price')->get();
        return response()->json(['success' => true, 'plans' => $plans]);
    }

    // User subscribes to a plan
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'plan_id'    => 'required|exists:subscription_plans,id',
            'user_name'  => 'nullable|string',
            'user_email' => 'nullable|email',
        ]);

        $plan = SubscriptionPlan::findOrFail($validated['plan_id']);

        $userId = null;
        if ($request->user()) {
            $userId                  = $request->user()->id;
            $validated['user_name']  = $validated['user_name']  ?? $request->user()->name;
            $validated['user_email'] = $validated['user_email'] ?? $request->user()->email;
        }

        $subscription = UserSubscription::create([
            'user_id'        => $userId,
            'plan_id'        => $plan->id,
            'user_name'      => $validated['user_name'] ?? null,
            'user_email'     => $validated['user_email'] ?? null,
            'plan_name'      => $plan->name,
            'amount_paid'    => $plan->price,
            'status'         => 'active',
            'payment_status' => 'pending', // Will be updated once payment gateway is integrated
            'starts_at'      => now(),
            'ends_at'        => now()->addMonth(),
        ]);

        return response()->json([
            'success'      => true,
            'message'      => 'Subscribed to ' . $plan->name . ' plan successfully!',
            'subscription' => $subscription,
        ], 201);
    }

    // User's own subscription history
    public function mySubscriptions(Request $request)
    {
        $subscriptions = UserSubscription::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'subscriptions' => $subscriptions]);
    }
}
