<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RideController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/profile', [ProfileController::class, 'show'])->middleware('auth:sanctum');
Route::put('/profile/update', [ProfileController::class, 'update'])->middleware('auth:sanctum'); // Profile update route

// Ride routes
Route::post('/rides/request', [RideController::class, 'createRideRequest'])->middleware('auth:sanctum');
Route::put('/rides/{requestId}', [RideController::class, 'updateRideStatus'])->middleware('auth:sanctum');
Route::get('/rides/active/{userId}', [RideController::class, 'getActiveRide'])->middleware('auth:sanctum');
Route::get('/rides/pending', [RideController::class, 'getPendingRides'])->middleware('auth:sanctum');
Route::put('/rides/{requestId}/complete', [RideController::class, 'completeRide'])->middleware('auth:sanctum');
Route::get('/rides/active/rider/{riderId}', [RideController::class, 'getActiveRiderRides'])->middleware('auth:sanctum');

// Role-specific routes
Route::get('/rides/accepted/{riderId}', [RideController::class, 'getAcceptedRides'])->middleware(['auth:sanctum', 'role:rider']);
Route::get('/profile', [ProfileController::class, 'show'])->middleware(['auth:sanctum', 'role:rider']);
