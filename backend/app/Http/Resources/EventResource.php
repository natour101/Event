<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
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
            'image' => $this->image_url,
            'views' => $this->views,
            'attendees' => $this->attendees_count,
            'rating' => $this->rating,
            'is_featured' => $this->is_featured,
            'distance_km' => $this->distance_km,
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
