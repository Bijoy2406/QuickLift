<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Rider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Passport\PersonalAccessTokenResult;

class AuthController extends Controller
{
    // Register method with token generation
    public function register(Request $request)
    {
        try {
            // Validate user data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6|confirmed', // ✅ Password confirmation check
                'password_confirmation' => 'required', // Make sure this is required
                'role' => ['required', Rule::in(['user', 'rider'])],
            ], [
                'password.confirmed' => 'The password confirmation does not match.', // Custom error message
                'password_confirmation.required' => 'Please confirm your password.', // Custom error message for missing confirmation
            ]);

            // Create user (independent from Rider)
            $user = User::create([
                'user_id' => $this->generateUniqueUserId(),
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => $validatedData['role'],
            ]);

            // If registering as a rider, create a separate rider entry
            if ($validatedData['role'] === 'rider') {
                $validatedRiderData = $request->validate([
                    'car_number' => 'required|string|max:50',
                    'car_details' => 'required|string|max:255',
                ]);

                Rider::create([
                    'user_id' => $user->user_id, // Associate with the user_id
                    'car_number' => $validatedRiderData['car_number'],
                    'car_details' => $validatedRiderData['car_details'],
                    'availability' => 'Available', // Default availability
                    'rider_id' => $this->generateUniqueRiderId(),
                ]);
            }

            // Generate a token for the user after successful registration
            $token = $user->createToken('QuickLiftApp')->accessToken;

            return response()->json([
                'message' => 'Registration successful',
                'user' => $user,
                'token' => $token, // Return the token after registration
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Something went wrong', 'error' => $e->getMessage()], 500);
        }
    }

    // Login method with token generation
    public function login(Request $request)
    {
        try {
            // Validate login data
            $validatedData = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            // Find user by email
            $user = User::where('email', $validatedData['email'])->first();

            if (!$user || !Hash::check($validatedData['password'], $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Create token for the authenticated user
            $token = $user->createToken('QuickLiftApp')->accessToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token, // Return the token after login
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Something went wrong', 'error' => $e->getMessage()], 500);
        }
    }

    // Logout method
    public function logout(Request $request)
    {
        try {
            // Revoke the token that the user is currently using
            $request->user()->token()->revoke();

            return response()->json(['message' => 'Logout successful'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Something went wrong', 'error' => $e->getMessage()], 500);
        }
    }

    // Generate a unique user_id
    private function generateUniqueUserId()
    {
        do {
            $randomId = mt_rand(1000000000, 9999999999); // 10-digit ID
        } while (User::where("user_id", $randomId)->exists());

        return $randomId;
    }

    // Generate a unique rider_id
    private function generateUniqueRiderId()
    {
        do {
            $randomId = mt_rand(1000000000, 9999999999); // 10-digit ID
        } while (Rider::where("rider_id", $randomId)->exists());

        return $randomId;
    }
}
