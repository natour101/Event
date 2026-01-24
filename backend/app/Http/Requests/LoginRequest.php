<?php

namespace App\Http\Requests;

class LoginRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $identifier = $this->input('identifier')
            ?? $this->input('email')
            ?? $this->input('username');

        $identifier = is_string($identifier) ? trim($identifier) : $identifier;
        $email = $this->input('email');
        $username = $this->input('username');

        if (is_string($email)) {
            $email = strtolower(trim($email));
        }
        if (is_string($username)) {
            $username = trim($username);
        }

        if (is_string($identifier) && filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            $identifier = strtolower($identifier);
        }

        $this->merge(array_filter([
            'identifier' => $identifier,
            'email' => $email,
            'username' => $username,
        ], static fn ($value) => $value !== null));
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6'],
        ];
    }
}
