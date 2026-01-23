<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'name' => ['nullable', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255', Rule::unique('users', 'username')->ignore($userId)],
            'phone_number' => ['nullable', 'string', 'max:30', Rule::unique('users', 'phone_number')->ignore($userId)],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'profile_image_url' => ['nullable', 'url'],
        ];
    }
}
