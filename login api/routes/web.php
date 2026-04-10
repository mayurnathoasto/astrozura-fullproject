<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', [AuthController::class, 'showLogin'])->name('login');
Route::post('/send-otp', [AuthController::class, 'sendOtp'])->name('send.otp');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/home', [AuthController::class, 'home'])->name('home');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
