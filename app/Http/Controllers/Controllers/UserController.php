<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        $email = $request->user()->email;

        $user = DB::table('users')->where('email', $email)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($user->role === 'rider') {
            $rider = DB::table('riders')->where('user_id', $user->id)->first();
            return response()->json(array_merge((array)$user, (array)$rider));
        }

        return response()->json($user);
    }
}