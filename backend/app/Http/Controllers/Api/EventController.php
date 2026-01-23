<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\ApiResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query()->with(['categoryRelation']);

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
            'items' => EventResource::collection($events),
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
        $event->load(['organizer', 'categoryRelation']);
        $event->increment('views');

        return ApiResponse::success('Event details', [
            'event' => new EventResource($event),
        ]);
    }

    public function store(StoreEventRequest $request)
    {
        $event = Event::create(array_merge(
            $request->validated(),
            ['user_id' => $request->user()?->id]
        ));

        $event->load(['categoryRelation']);

        return ApiResponse::success('Event created', [
            'event' => new EventResource($event),
        ], 201);
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $event->update($request->validated());
        $event->load(['categoryRelation']);

        return ApiResponse::success('Event updated', [
            'event' => new EventResource($event),
        ]);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return ApiResponse::success('Event deleted');
    }
}
