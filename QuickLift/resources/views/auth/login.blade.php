@extends('layouts.app')

@section('title', 'Login')

@section('content')
<div class="form-container">
    <h2>Login to QuickLift</h2>
    <form action="{{ route('login.submit') }}" method="POST">
        @csrf
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Your email" required>
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Your password" required>
        </div>
        <div>
            <label for="role">Role</label>
            <select name="role" id="role" required>
                <option value="rider">Rider</option>
                <option value="user">User</option>
            </select>
        </div>
        <input type="submit" value="Login">
    </form>
    <p>Don't have an account? <a href="{{ route('register') }}">Register here</a></p>
</div>
@endsection
