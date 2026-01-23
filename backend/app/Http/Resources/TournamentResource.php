<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TournamentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'prize' => $this->prize,
            'teams' => $this->teams,
            'status' => $this->status,
            'is_trending' => $this->is_trending,
            'image' => $this->image_url,
            'starts_at' => $this->starts_at?->toISOString(),
            'date_label' => $this->starts_at?->format('d M Y'),
        ];
    }
}
