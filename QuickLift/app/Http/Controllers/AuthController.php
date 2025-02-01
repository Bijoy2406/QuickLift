<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // Display the Login Page
    public function showLogin()
    {
        return view('auth.login');
    }

    // Display the Register Page
    public function showRegister()
    {
        return view('auth.register');
    }

    // Handle the Login Submission (Example)
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            return redirect()->route($user->role === 'rider' ? 'rider.dashboard' : 'user.dashboard');
        }
        return back()->withErrors(['email' => 'Invalid credentials']);
    }

    // Handle the Registration Submission with additional fields based on role
    public function register(Request $request)
    {
        // Common validation rules
        $rules = [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|min:6|confirmed',
            'role'                  => 'required|in:rider,user',
        ];

        // Additional rules for riders
        if ($request->role === 'rider') {
            $rules['vehicle_type']   = 'required|string|max:50';
            $rules['vehicle_model']  = 'required|string|max:50';
            $rules['vehicle_number'] = 'required|string|max:20';
        }

        // Additional rules for users
        if ($request->role === 'user') {
            $rules['pickup_location'] = 'required|string|max:255';
        }

        $validatedData = $request->validate($rules);

        $data = [
            'name'     => $validatedData['name'],
            'email'    => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
            'role'     => $validatedData['role'],
        ];

        if ($validatedData['role'] === 'rider') {
            $data['vehicle_type']   = $validatedData['vehicle_type'];
            $data['vehicle_model']  = $validatedData['vehicle_model'];
            $data['vehicle_number'] = $validatedData['vehicle_number'];
        } elseif ($validatedData['role'] === 'user') {
            $data['pickup_location'] = $validatedData['pickup_location'];
        }

        $user = User::create($data);
        Auth::login($user);
        return redirect()->route($user->role === 'rider' ? 'rider.dashboard' : 'user.dashboard');
    }
}
