<?php

namespace App\Http\Requests;

class StoreTournamentRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'prize' => ['nullable', 'string', 'max:100'],
            'teams' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'in:live,upcoming,ended'],
            'is_trending' => ['nullable', 'boolean'],
            'image_url' => ['nullable', 'url'],
            'starts_at' => ['nullable', 'date'],
        ];
    }
}
