<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Socialite\Facades\Socialite;

class ApiAuthController extends Controller
{
    /**
     * Redirect to Google OAuth.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Google OAuth Callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = User::where('email', $googleUser->email)->first();
            
            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'role' => 'user',
                    'is_profile_complete' => false,
                ]);
            }

            $token = $user->createToken('api-token')->plainTextToken;

            // Redirect back to frontend
            $frontendUrl = 'http://localhost:5173';
            $isNew = !$user->is_profile_complete ? 'true' : 'false';
            
            return redirect($frontendUrl . '/oauth/callback?token=' . $token . '&is_new=' . $isNew);

        } catch (\Exception $e) {
            return redirect('http://localhost:5173/login?error=google_auth_failed');
        }
    }
    /**
     * Send OTP to the user (mobile/email).
     * Bypasses registration by creating the user if they don't exist.
     */
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'identifier' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $identifier = $request->identifier;
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);

        // Bypass registration: Create user if not exists
        $user = User::firstOrCreate(
            [$isEmail ? 'email' : 'phone' => $identifier],
            ['name' => 'User ' . Str::random(5)]
        );

        // Generate Dev OTP
        $otp = rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expires_at = now()->addMinutes(60);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'OTP generated successfully (Dev OTP)',
            'dev_otp' => $otp,
            'identifier' => $identifier
        ]);
    }

    /**
     * Log in the user using OTP and issue a Sanctum token.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'identifier' => 'required|string',
            'otp' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $identifier = $request->identifier;
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);
        $field = $isEmail ? 'email' : 'phone';

        $user = User::where($field, $identifier)->first();

        if (!$user || $user->otp != $request->otp || now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired OTP.'], 401);
        }

        // Clear OTP after success
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        // Create Sanctum Token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully',
            'token' => $token,
            'user' => $user,
            'is_new_user' => !$user->is_profile_complete
        ]);
    }

    /**
     * Register a new user with standard email/password.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $user = User::create([
            'name' => trim($request->firstName . ' ' . $request->lastName),
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'user',
            'is_profile_complete' => false,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registered successfully',
            'token' => $token,
            'user' => $user,
            'is_new_user' => true
        ]);
    }

    /**
     * Standard Email/Password login.
     */
    public function loginWithPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['success' => false, 'message' => 'Invalid email or password.'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully',
            'token' => $token,
            'user' => $user,
            'is_new_user' => !$user->is_profile_complete
        ]);
    }

    /**
     * Specialized Astrologer Login
     */
    public function astrologerLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['success' => false, 'message' => 'Invalid email or password.'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        
        // Strict role check
        if ($user->role !== 'astrologer') {
            Auth::logout();
            return response()->json(['success' => false, 'message' => 'Unauthorized Access. Astrologer account required.'], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in as Astrologer successfully',
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * Log out the user and revoke the current token.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get the authenticated user details.
     */
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()->load('astrologerDetail')
        ]);
    }

    /**
     * Get all registered users (for Admin Panel)
     */
    public function getAllUsers()
    {
        $users = User::where('role', 'user')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }

    /**
     * Get Admin Dashboard Stats
     */
    public function getAdminDashboardStats()
    {
        $totalUsers = User::where('role', 'user')->count();
        $totalAstrologers = User::where('role', 'astrologer')->count();

        // For Bookings and Revenue, we return hardcoded strings for now 
        // since there's no DB table for them yet.
        return response()->json([
            'success' => true,
            'stats' => [
                'total_users' => $totalUsers,
                'total_astrologers' => $totalAstrologers,
                'bookings' => 324,
                'revenue' => '₹2,45,000'
            ]
        ]);
    }

    /**
     * Create a new Astrologer (from Admin Panel)
     */
    public function createAstrologer(Request $request)
    {
        $request->merge([
            'is_featured' => filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'experience_years' => 'required|numeric',
            'languages' => 'nullable|string',
            'specialities' => 'nullable|string',
            'chat_price' => 'required|numeric',
            'call_price' => 'required|numeric',
            'about_bio' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_featured' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $user = User::create([
            'name' => trim($request->firstName . ' ' . $request->lastName),
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'astrologer',
            'is_profile_complete' => true,
        ]);

        $profileImagePath = null;
        if ($request->hasFile('profile_image')) {
            // This stores the avatar in storage/app/public/profiles directory
            $profileImagePath = $request->file('profile_image')->store('profiles', 'public');
            // To access this later, prepend /storage/
            $profileImagePath = '/storage/' . $profileImagePath;
        }

        $user->astrologerDetail()->create([
            'experience_years' => $request->experience_years,
            'languages' => $request->languages,
            'specialities' => $request->specialities,
            'chat_price' => $request->chat_price,
            'call_price' => $request->call_price,
            'about_bio' => $request->about_bio,
            'profile_image' => $profileImagePath,
            'is_featured' => $request->boolean('is_featured'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Astrologer created successfully',
            'user' => $user->load('astrologerDetail')
        ]);
    }

    /**
     * Get all astrologers and their details (for Admin Panel & Frontend)
     */
    public function getAstrologers()
    {
        $astrologers = User::with('astrologerDetail')
            ->where('role', 'astrologer')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'success' => true,
            'astrologers' => $astrologers
        ]);
    }

    /**
     * Get a single astrologer profile
     */
    public function getAstrologerProfile($id)
    {
        $astrologer = User::with('astrologerDetail')
            ->where('role', 'astrologer')
            ->where('id', $id)
            ->first();

        if (!$astrologer) {
            return response()->json(['success' => false, 'message' => 'Astrologer not found'], 404);
        }

        return response()->json([
            'success' => true,
            'astrologer' => $astrologer
        ]);
    }

    /**
     * Update Astrologer Profile (Protected)
     */
    public function updateAstrologerProfile(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'astrologer') {
            return response()->json(['success' => false, 'message' => 'Unauthorized Access. Astrologer account required.'], 403);
        }

        $request->merge([
            'is_featured' => filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'nullable|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'experience_years' => 'required|numeric',
            'languages' => 'nullable|string',
            'specialities' => 'nullable|string',
            'chat_price' => 'required|numeric',
            'call_price' => 'required|numeric',
            'about_bio' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_featured' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $user->name = trim($request->firstName . ' ' . $request->lastName);
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }

        $user->save();

        $profileImagePath = $user->astrologerDetail?->profile_image;
        if ($request->hasFile('profile_image')) {
            $profileImagePath = '/storage/' . $request->file('profile_image')->store('profiles', 'public');
        }

        // Update or create astrologer details
        $user->astrologerDetail()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'experience_years' => $request->experience_years,
                'languages' => $request->languages,
                'specialities' => $request->specialities,
                'chat_price' => $request->chat_price,
                'call_price' => $request->call_price,
                'about_bio' => $request->about_bio,
                'profile_image' => $profileImagePath,
                'is_featured' => $request->boolean('is_featured'),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user->fresh()->load('astrologerDetail')
        ]);
    }
}
