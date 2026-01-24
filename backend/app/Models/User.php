<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'phone_number',
        'email',
        'password',
        'profile_image_path',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function deviceTokens()
    {
        return $this->hasMany(DeviceToken::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function eventLikes()
    {
        return $this->hasMany(EventLike::class);
    }

    public function eventBookings()
    {
        return $this->hasMany(EventBooking::class);
    }
}
