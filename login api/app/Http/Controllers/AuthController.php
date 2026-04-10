<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('welcome');
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
        ]);

        $identifier = $request->identifier;
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);

        $user = User::firstOrCreate(
            [$isEmail ? 'email' : 'phone' => $identifier],
            ['name' => 'User ' . Str::random(5)]
        );

        $otp = rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expires_at = now()->addMinutes(10);
        $user->save();

        return back()->with([
            'dev_otp' => $otp,
            'identifier' => $identifier,
            'success' => 'OTP generated successfully! Please enter it below.'
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'otp' => 'required|numeric',
        ]);

        $identifier = $request->identifier;
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);
        $field = $isEmail ? 'email' : 'phone';

        $user = User::where($field, $identifier)->first();

        if (!$user || $user->otp !== $request->otp || now()->greaterThan($user->otp_expires_at)) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP.']);
        }

        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        Auth::login($user);
        $token = $user->createToken('web-token')->plainTextToken;
        session(['sanctum_token' => $token]);

        return redirect()->route('home');
    }

    public function home()
    {
        return view('home', [
            'user' => Auth::user(),
            'token' => session('sanctum_token'),
        ]);
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->tokens()->delete();
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
