<?php

namespace App\Http\Requests;

class UpdateEventRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'tag' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'category' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'image_url' => ['nullable', 'url'],
            'views' => ['nullable', 'integer', 'min:0'],
            'attendees_count' => ['nullable', 'integer', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'is_featured' => ['nullable', 'boolean'],
            'distance_km' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
