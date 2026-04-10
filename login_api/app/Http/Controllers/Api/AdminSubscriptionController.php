<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use Illuminate\Http\Request;

class AdminSubscriptionController extends Controller
{
    // ── PLANS MANAGEMENT ──────────────────────────────────────────

    public function getPlans()
    {
        $plans = SubscriptionPlan::orderBy('price')->get();
        return response()->json(['success' => true, 'plans' => $plans]);
    }

    public function storePlan(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string',
            'price'      => 'required|numeric',
            'features'   => 'required|array',
            'is_popular' => 'boolean',
            'is_active'  => 'boolean',
        ]);

        $plan = SubscriptionPlan::create($validated);
        return response()->json(['success' => true, 'message' => 'Plan created', 'plan' => $plan], 201);
    }

    public function updatePlan(Request $request, $id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        $plan->update($request->all());
        return response()->json(['success' => true, 'message' => 'Plan updated', 'plan' => $plan]);
    }

    public function deletePlan($id)
    {
        SubscriptionPlan::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Plan deleted']);
    }

    // ── USER SUBSCRIPTIONS HISTORY ─────────────────────────────────

    public function getUserSubscriptions(Request $request)
    {
        $query = UserSubscription::orderBy('created_at', 'desc');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('user_name', 'like', "%$search%")
                  ->orWhere('user_email', 'like', "%$search%")
                  ->orWhere('plan_name', 'like', "%$search%")
                  ->orWhere('status', 'like', "%$search%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $subscriptions = $query->get();
        return response()->json(['success' => true, 'subscriptions' => $subscriptions]);
    }

    public function stats()
    {
        return response()->json([
            'success'        => true,
            'total'          => UserSubscription::count(),
            'active'         => UserSubscription::where('status', 'active')->count(),
            'revenue'        => UserSubscription::where('payment_status', 'paid')->sum('amount_paid'),
        ]);
    }
}
