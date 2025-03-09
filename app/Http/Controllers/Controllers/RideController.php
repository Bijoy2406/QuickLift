<?php

namespace App\Http\Controllers;

use App\Models\RideRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Import the Log facade

class RideController extends Controller
{
    public function createRideRequest(Request $request)
    {
        try {
            $validated = $request->validate([
                'pickup_location' => 'required|string',
                'dropoff_location' => 'required|string',
                'fare' => 'required|numeric',
                'payment_method' => 'required|string' // Add payment_method validation
            ]);

            $rideRequest = RideRequest::create([
                'user_id' => $request->user()->user_id,
                'pickup_location' => $validated['pickup_location'],
                'dropoff_location' => $validated['dropoff_location'],
                'fare' => $validated['fare'],
                'payment_method' => $validated['payment_method'] // Store payment method
            ]);

            return response()->json([
                'requestId' => $rideRequest->id,
                'status' => 'Pending',
                'fare' => $rideRequest->fare,
                'payment_method' => $rideRequest->payment_method // Include in response
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getActiveRide($userId)
    {
        try {
            Log::info("getActiveRide called with userId: " . $userId); // Log the userId

            $activeRide = RideRequest::where('user_id', $userId)
                ->whereNotIn('status', ['Finished', 'Cancelled'])
                ->latest()
                ->first();

            if (!$activeRide) {
                return response()->json(['activeRide' => null]);
            }

            return response()->json([
                'activeRide' => [
                    'status' => $activeRide->status,
                    'pickup' => $activeRide->pickup_location,
                    'dropoff' => $activeRide->dropoff_location,
                    'fare' => $activeRide->fare,          // Include fare
                    'payment_method' => $activeRide->payment_method // Include payment method
                ]
            ]);
        } catch (\Exception $e) {
            Log::error("Error in getActiveRide: " . $e->getMessage()); // Log the error
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
