<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $name = $request->input('name');
        $email = $request->input('email');
        $password = $request->input('password');
        $role = $request->input('role');
        $car_number = $request->input('car_number');
        $car_details = $request->input('car_details');

        $hashedPassword = Hash::make($password);

        $userId = DB::table('users')->insertGetId([
            'name' => $name,
            'email' => $email,
            'password' => $hashedPassword,
            'role' => $role
        ]);

        if ($role === 'rider') {
            DB::table('riders')->insert([
                'user_id' => $userId,
                'car_number' => $car_number,
                'car_details' => $car_details
            ]);
        }

        $payload = [
            'user_id' => $userId,
            'email' => $email,
            'exp' => time() + 3600 // 1 hour expiration
        ];

        $jwt = JWT::encode($payload, env('JWT_SECRET'), 'HS256');

        return response()->json([
            'message' => 'User registered successfully',
            'token' => $jwt
        ], 201);
    }
}