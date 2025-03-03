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
    protected $primaryKey = "rider_id";

    // Disable auto-incrementing for the primary key
    public $incrementing = false;

    // Primary key type
    protected $keyType = "bigInteger";

    // Fields that can be mass-assigned
    protected $fillable = [
        'rider_id',
        'user_id',
        'car_number',
        'car_details',
        'availability', // 'Available' or 'Unavailable'
    ];

    // Relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Relationship with the RideAssignment model
    public function rideAssignments()
    {
        return $this->hasMany(RideAssignment::class, 'rider_id', 'rider_id');
    }

    // Automatically generate a unique rider_id before creating a new rider
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($rider) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("rider_id", $randomId)->exists()); // Ensure uniqueness

            $rider->rider_id = $randomId; // Assign random ID
        });
    }
}