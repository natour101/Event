<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $profileImageUrl = null;
        if ($this->profile_image_path) {
            $profileImageUrl = str_starts_with($this->profile_image_path, 'http')
                ? $this->profile_image_path
                : Storage::url($this->profile_image_path);
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'phone_number' => $this->phone_number,
            'email' => $this->email,
            'profile_image_url' => $profileImageUrl,
            'created_at' => $this->created_at,
        ];
    }
}
