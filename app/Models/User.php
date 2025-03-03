<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class User extends Model
{
    use HasFactory, HasApiTokens;

    // Table name
    protected $table = 'users';

    // Primary key
    protected $primaryKey = "user_id";

    // Disable auto-incrementing for the primary key
    public $incrementing = false;

    // Primary key type
    protected $keyType = "bigInteger";

    // Fields that can be mass-assigned
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'password',
        'role', // 'user' or 'rider'
    ];

    // Fields to hide in responses
    protected $hidden = [
        'password',
    ];

    // Relationship with the Rider model (if the user is a rider)
    public function rider()
    {
        return $this->hasOne(Rider::class, 'user_id', 'user_id');
    }

    // Relationship with the RideRequest model (if the user is a passenger)
    public function rideRequests()
    {
        return $this->hasMany(RideRequest::class, 'user_id', 'user_id');
    }

    // Automatically generate a unique user_id before creating a new user
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            do {
                $randomId = mt_rand(1000000000, 9999999999); // Generate 10-digit random ID
            } while (self::where("user_id", $randomId)->exists()); // Ensure uniqueness

            $user->user_id = $randomId; // Assign random ID
        });
    }
}