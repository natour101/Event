<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'subtitle',
        'tag',
        'category',
        'description',
        'location',
        'start_at',
        'end_at',
        'price',
        'image_url',
        'views',
        'attendees_count',
        'rating',
        'is_featured',
        'distance_km',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'rating' => 'decimal:1',
        'distance_km' => 'decimal:2',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function likes()
    {
        return $this->hasMany(EventLike::class);
    }

    public function bookings()
    {
        return $this->hasMany(EventBooking::class);
    }

    public function categoryRelation()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
