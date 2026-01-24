<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query()
            ->with(['categoryRelation']);
        $withCounts = [];
        if (Schema::hasTable('event_likes')) {
            $withCounts[] = 'likes';
        }
        if (Schema::hasTable('event_bookings')) {
            $withCounts[] = 'bookings';
        }
        if ($withCounts) {
            $query->withCount($withCounts);
        }

        if ($search = $request->get('search')) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('subtitle', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->get('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($featured = $request->get('featured')) {
            $query->where('is_featured', filter_var($featured, FILTER_VALIDATE_BOOLEAN));
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');

        $events = $query->orderBy($sortBy, $sortDir)
            ->paginate($request->integer('per_page', 10));

        return ApiResponse::success('Events fetched', [
            'items' => EventResource::collection($events)->resolve(),
            'pagination' => [
                'total' => $events->total(),
                'per_page' => $events->perPage(),
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
            ],
        ]);
    }

    public function show(Event $event)
    {
        $relations = ['organizer', 'categoryRelation'];
        if (Schema::hasTable('event_bookings')) {
            $relations[] = 'bookings.user';
        }
        $event->load($relations);
        $withCounts = [];
        if (Schema::hasTable('event_likes')) {
            $withCounts[] = 'likes';
        }
        if (Schema::hasTable('event_bookings')) {
            $withCounts[] = 'bookings';
        }
        if ($withCounts) {
            $event->loadCount($withCounts);
        }
        $event->increment('views');

        return ApiResponse::success('Event details', [
            'event' => (new EventResource($event))->resolve(),
        ]);
    }

    public function store(StoreEventRequest $request)
    {
        $payload = $request->validated();
        if ($request->hasFile('image')) {
            $payload['image_url'] = $request->file('image')->store('events', 'public');
        }

        $event = Event::create(array_merge($payload, ['user_id' => $request->user()?->id]));

        $event->load(['categoryRelation']);
        $withCounts = [];
        if (Schema::hasTable('event_likes')) {
            $withCounts[] = 'likes';
        }
        if (Schema::hasTable('event_bookings')) {
            $withCounts[] = 'bookings';
        }
        if ($withCounts) {
            $event->loadCount($withCounts);
        }

        return ApiResponse::success('Event created', [
            'event' => (new EventResource($event))->resolve(),
        ], 201);
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $payload = $request->validated();
        if ($request->hasFile('image')) {
            if ($event->image_url && !Str::startsWith($event->image_url, ['http://', 'https://'])) {
                Storage::disk('public')->delete($event->image_url);
            }
            $payload['image_url'] = $request->file('image')->store('events', 'public');
        }

        $event->update($payload);
        $event->load(['categoryRelation']);
        $withCounts = [];
        if (Schema::hasTable('event_likes')) {
            $withCounts[] = 'likes';
        }
        if (Schema::hasTable('event_bookings')) {
            $withCounts[] = 'bookings';
        }
        if ($withCounts) {
            $event->loadCount($withCounts);
        }

        return ApiResponse::success('Event updated', [
            'event' => (new EventResource($event))->resolve(),
        ]);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return ApiResponse::success('Event deleted');
    }

    public function like(Request $request, Event $event)
    {
        $user = $request->user();
        $event->likes()->firstOrCreate([
            'user_id' => $user->id,
        ]);

        if (Schema::hasTable('event_bookings')) {
            $event->load(['bookings.user']);
        }
        $withCounts = [];
        if (Schema::hasTable('event_likes')) {
            $withCounts[] = 'likes';
        }
        if (Schema::hasTable('event_bookings')) {
            $withCounts[] = 'bookings';
        }
        if ($withCounts) {
            $event->loadCount($withCounts);
        }

        return ApiResponse::success('Event liked', [
            'event' => (new EventResource($event))->resolve(),
        ]);
    }

    public function unlike(Request $request, Event $event)
    {
        $user = $request->user();
        $event->likes()->where('user_id', $user->id)->delete();

        if (Schema::hasTable('event_bookings')) {
            $event->load(['bookings.user']);
        }
        $withCounts = [];
        if (Schema::hasTable('event_likes')) {
            $withCounts[] = 'likes';
        }
        if (Schema::hasTable('event_bookings')) {
            $withCounts[] = 'bookings';
        }
        if ($withCounts) {
            $event->loadCount($withCounts);
        }

        return ApiResponse::success('Event unliked', [
            'event' => (new EventResource($event))->resolve(),
        ]);
    }

    public function book(Request $request, Event $event)
    {
        if (!Schema::hasTable('event_bookings')) {
            $event->increment('attendees_count');
            $event->refresh();

            return ApiResponse::success('Event booked', [
                'event' => (new EventResource($event))->resolve(),
            ]);
        }
        $user = $request->user();
        $event->bookings()->firstOrCreate([
            'user_id' => $user->id,
        ]);

        $event->attendees_count = $event->bookings()->count();
        $event->save();
        $event->load(['bookings.user']);
        $withCounts = [];
        if (Schema::hasTable('event_likes')) {
            $withCounts[] = 'likes';
        }
        if (Schema::hasTable('event_bookings')) {
            $withCounts[] = 'bookings';
        }
        if ($withCounts) {
            $event->loadCount($withCounts);
        }

        return ApiResponse::success('Event booked', [
            'event' => (new EventResource($event))->resolve(),
        ]);
    }
}
