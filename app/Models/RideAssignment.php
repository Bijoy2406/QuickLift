<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RideAssignment extends Model
{
    use HasFactory;

    protected $table = 'ride_assignments';

    protected $fillable = [
        'request_id',
        'rider_id'
    ];

    public function rideRequest()
    {
        return $this->belongsTo(RideRequest::class, 'request_id');
    }

    public function rider()
    {
        return $this->belongsTo(Rider::class, 'rider_id');
    }
}
