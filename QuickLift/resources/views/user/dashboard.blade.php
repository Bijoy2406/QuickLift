@extends('layouts.app')

@section('title', 'User Dashboard')

@section('content')
<div class="dashboard-container">
    <h2>Welcome, {{ Auth::user()->name }}!</h2>
    <p>This is your User Dashboard. Here you can search for rides and view your booking history.</p>
    <!-- Add more user-specific functionality here -->
</div>
@endsection
