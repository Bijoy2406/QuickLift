<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/login', function () {
    return file_get_contents(public_path('login.html'));
});

Route::get('/register', function () {
    return file_get_contents(public_path('register.html'));
});

Route::post('/login', [AuthController::class, 'processLogin']);
Route::post('/register', [AuthController::class, 'processRegister']);

Route::get('/home', function () {
    return file_get_contents(public_path('home.html'));
});

Route::get('/logout', function () {
    return redirect('/login'); 
});
