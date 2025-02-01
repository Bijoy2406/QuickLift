@extends('layouts.app')

@section('title', 'Rider Dashboard')

@section('content')
<div class="dashboard-container">
    <h2>Welcome, {{ Auth::user()->name }}!</h2>
    <p>This is your Rider Dashboard. Here you can manage your rides and view booking details.</p>
    <!-- Add more rider-specific functionality here -->
</div>
@endsection
