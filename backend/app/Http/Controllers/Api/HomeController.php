<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Models\Tournament;
use App\Models\User;
use App\Services\ApiResponse;
use Illuminate\Support\Facades\Schema;

class HomeController extends Controller
{
    public function index()
    {
        $withCounts = [];
        if (Schema::hasTable('event_likes')) {
            $withCounts[] = 'likes';
        }
        if (Schema::hasTable('event_bookings')) {
            $withCounts[] = 'bookings';
        }

        $featured = Event::query()
            ->with(['categoryRelation'])
            ->when($withCounts, fn ($query) => $query->withCount($withCounts))
            ->where('is_featured', true)
            ->latest()
            ->take(3)
            ->get();

        $nearby = Event::query()
            ->with(['categoryRelation'])
            ->when($withCounts, fn ($query) => $query->withCount($withCounts))
            ->whereNotNull('distance_km')
            ->orderBy('distance_km')
            ->take(5)
            ->get();

        $newest = Event::query()
            ->with(['categoryRelation'])
            ->when($withCounts, fn ($query) => $query->withCount($withCounts))
            ->latest()
            ->take(6)
            ->get();

        $stats = [
            'events' => Event::count(),
            'tournaments' => Tournament::count(),
            'users' => User::count(),
        ];

        return ApiResponse::success('Home data', [
            'featured' => EventResource::collection($featured),
            'nearby' => EventResource::collection($nearby),
            'newest' => EventResource::collection($newest),
            'stats' => $stats,
        ]);
    }
}
