<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Services\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class AdminEventController extends Controller
{
    public function eventsSummary(Request $request)
    {
        $bookingsEnabled = Schema::hasTable('event_bookings');
        $query = Event::query()->select(['id', 'title', 'attendees_count']);
        if ($bookingsEnabled) {
            $query->withCount('bookings');
        }

        $events = $query->orderByDesc('created_at')->get();

        $items = $events->map(function (Event $event) use ($bookingsEnabled) {
            $registrationsCount = $bookingsEnabled
                ? ($event->bookings_count ?? 0)
                : ($event->attendees_count ?? 0);

            return [
                'id' => $event->id,
                'title' => $event->title,
                'registrations_count' => $registrationsCount,
                'bookings_count' => $bookingsEnabled ? ($event->bookings_count ?? 0) : 0,
                'attendees_count' => $event->attendees_count ?? 0,
            ];
        });

        return ApiResponse::success('Admin events summary', [
            'items' => $items,
        ]);
    }

    public function registrations(Event $event)
    {
        if (!Schema::hasTable('event_bookings')) {
            return ApiResponse::success('Event registrations', [
                'registrations' => [],
                'registrations_count' => 0,
            ]);
        }

        $event->load(['bookings.user']);
        $registrations = $event->bookings
            ->map(function ($booking) {
                if (!$booking->user) {
                    return null;
                }

                return [
                    'id' => $booking->id,
                    'user_id' => $booking->user_id,
                    'name' => $booking->user->name,
                    'phone_number' => $booking->user->phone_number,
                ];
            })
            ->filter()
            ->values();

        return ApiResponse::success('Event registrations', [
            'registrations' => $registrations,
            'registrations_count' => $registrations->count(),
        ]);
    }
}
