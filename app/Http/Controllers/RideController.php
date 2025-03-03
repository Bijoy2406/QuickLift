<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RideController extends Controller
{
    public function createRideRequest(Request $request)
    {
        $user_id = $request->user()->user_id;
        $pickup_location = $request->input('pickup_location');
        $dropoff_location = $request->input('dropoff_location');

        $requestId = DB::table('ride_requests')->insertGetId([
            'user_id' => $user_id,
            'pickup_location' => $pickup_location,
            'dropoff_location' => $dropoff_location
        ]);

        return response()->json([
            'message' => 'Ride request created successfully',
            'requestId' => $requestId
        ], 201);
    }

    public function assignRide(Request $request)
    {
        $request_id = $request->input('request_id');
        $rider_id = $request->input('rider_id');

        $rideRequest = DB::table('ride_requests')->where('id', $request_id)->first();

        if (!$rideRequest) {
            return response()->json(['error' => 'Ride request not found'], 404);
        }

        $rider = DB::table('riders')->where('id', $rider_id)->first();

        if (!$rider || $rider->availability === 'Unavailable') {
            return response()->json(['error' => 'Rider is unavailable'], 400);
        }

        DB::table('ride_assignments')->insert([
            'request_id' => $request_id,
            'rider_id' => $rider_id
        ]);

        return response()->json(['message' => 'Rider assigned successfully']);
    }
}