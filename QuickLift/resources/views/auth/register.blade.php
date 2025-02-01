@extends('layouts.app')

@section('title', 'Register')

@section('content')
<div class="form-container">
    <h2>Create an Account on QuickLift</h2>
    <form action="{{ route('register.submit') }}" method="POST">
        @csrf
        <div>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your full name" required>
        </div>
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Your email" required>
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Choose a password" required>
        </div>
        <div>
            <label for="password_confirmation">Confirm Password</label>
            <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Confirm your password" required>
        </div>
        <div>
            <label for="role">Register As</label>
            <select name="role" id="role" required>
                <option value="">-- Select Role --</option>
                <option value="rider">Rider</option>
                <option value="user">User</option>
            </select>
        </div>

        <!-- Additional Fields for Rider -->
        <div id="rider-fields" style="display: none;">
            <div>
                <label for="vehicle_type">Vehicle Type</label>
                <input type="text" id="vehicle_type" name="vehicle_type" placeholder="e.g., Sedan, SUV">
            </div>
            <div>
                <label for="vehicle_model">Vehicle Model</label>
                <input type="text" id="vehicle_model" name="vehicle_model" placeholder="e.g., Toyota Camry">
            </div>
            <div>
                <label for="vehicle_number">Vehicle Number</label>
                <input type="text" id="vehicle_number" name="vehicle_number" placeholder="e.g., ABC-1234">
            </div>
        </div>

        <!-- Additional Fields for User -->
        <div id="user-fields" style="display: none;">
            <div>
                <label for="pickup_location">Preferred Pickup Location</label>
                <input type="text" id="pickup_location" name="pickup_location" placeholder="Your frequent pickup location">
            </div>
        </div>

        <input type="submit" value="Register">
    </form>
    <p>Already have an account? <a href="{{ route('login') }}">Login here</a></p>
</div>

<!-- Include jQuery from CDN -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$(document).ready(function(){
    $('#role').change(function(){
        var role = $(this).val();
        if(role === 'rider'){
            $('#rider-fields').slideDown('slow');
            $('#user-fields').slideUp('slow');
        } else if(role === 'user'){
            $('#user-fields').slideDown('slow');
            $('#rider-fields').slideUp('slow');
        } else {
            $('#rider-fields, #user-fields').slideUp('slow');
        }
    });
});
</script>
@endsection
