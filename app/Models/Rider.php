<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rider extends Model
{
    use HasFactory;

    // Table name
    protected $table = 'riders';

    // Primary key
    protected $primaryKey = 'id'; // Use the default auto-incrementing 'id' column

    // Foreign key for user
    protected $fillable = [
        'user_id',
        'car_number',
        'car_details',
        'availability', // 'Available' or 'Unavailable'
        'rider_id', // Add the 'rider_id' field to fillable
    ];

    // Relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id'); // Correct foreign key usage
    }

    // Automatically generate a unique rider_id before creating a new rider
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($rider) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("rider_id", $randomId)->exists()); // Ensure uniqueness

            // Assign rider_id to the rider instance
            $rider->rider_id = $randomId;
        });
    }
}
