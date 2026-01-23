<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'prize',
        'teams',
        'status',
        'is_trending',
        'image_url',
        'starts_at',
    ];

    protected $casts = [
        'is_trending' => 'boolean',
        'starts_at' => 'datetime',
    ];
}
