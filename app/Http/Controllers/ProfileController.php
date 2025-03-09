<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rider;

class ProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum'); // Ensure this middleware is applied
    }

    public function show(Request $request)
    {
        try {
            $user = $request->user(); // Get the authenticated user
            
            if ($user->role === 'rider') {
                $rider = Rider::where('user_id', $user->id)->first();
                return response()->json([
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'car_number' => $rider->car_number,
                    'car_details' => $rider->car_details
                ]);
            }

            return response()->json([
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}