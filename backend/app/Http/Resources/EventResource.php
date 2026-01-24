<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imageUrl = $this->image_url;
        if ($imageUrl && !Str::startsWith($imageUrl, ['http://', 'https://'])) {
            $imageUrl = Storage::disk('public')->url($imageUrl);
        }
        $likesEnabled = Schema::hasTable('event_likes');
        $bookingsEnabled = Schema::hasTable('event_bookings');

        return [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'tag' => $this->tag ?? $this->categoryRelation?->name ?? $this->category,
            'category' => $this->categoryRelation?->name ?? $this->category,
            'category_id' => $this->category_id,
            'description' => $this->description,
            'location' => $this->location,
            'start_at' => $this->start_at?->toISOString(),
            'end_at' => $this->end_at?->toISOString(),
            'date_label' => $this->start_at?->format('d M Y • H:i') ?? $this->created_at?->format('d M Y'),
            'price' => $this->price,
            'image' => $imageUrl,
            'views' => $this->views,
            'attendees' => $bookingsEnabled ? ($this->bookings_count ?? 0) : $this->attendees_count,
            'rating' => $this->rating,
            'is_featured' => $this->is_featured,
            'distance_km' => $this->distance_km,
            'likes_count' => $likesEnabled ? ($this->likes_count ?? 0) : 0,
            'bookings_count' => $bookingsEnabled ? ($this->bookings_count ?? 0) : 0,
            'liked_by_me' => $likesEnabled && $request->user()
                ? $this->likes()->where('user_id', $request->user()->id)->exists()
                : false,
            'booked_by_me' => $bookingsEnabled && $request->user()
                ? $this->bookings()->where('user_id', $request->user()->id)->exists()
                : false,
            'booked_users' => $bookingsEnabled
                ? $this->whenLoaded('bookings', function () {
                    return $this->bookings
                        ->map(fn ($booking) => $booking->user?->name)
                        ->filter()
                        ->values();
                })
                : [],
            'organizer' => $this->whenLoaded('organizer', function () {
                return [
                    'id' => $this->organizer?->id,
                    'name' => $this->organizer?->name,
                    'username' => $this->organizer?->username,
                ];
            }),
        ];
    }
}
