<?php

namespace App\Http\Requests;

class LoginRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $identifier = $this->input('identifier')
            ?? $this->input('email')
            ?? $this->input('username');

        if ($identifier) {
            $this->merge(['identifier' => $identifier]);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string'],
            'email' => ['nullable', 'email'],
            'password' => ['required', 'string'],
        ];
    }
}
