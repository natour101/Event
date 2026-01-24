<?php

namespace App\Http\Requests;

class RegisterRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $email = $this->input('email');
        $username = $this->input('username');
        $phoneNumber = $this->input('phone_number') ?? $this->input('phone');

        if (is_string($email)) {
            $email = strtolower(trim($email));
        }
        if (is_string($username)) {
            $username = trim($username);
        }
        if (is_string($phoneNumber)) {
            $phoneNumber = trim($phoneNumber);
        }

        $this->merge(array_filter([
            'email' => $email,
            'username' => $username,
            'phone_number' => $phoneNumber,
        ], static fn ($value) => $value !== null));
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'max:50', 'unique:users,username'],
            'phone_number' => ['required', 'string', 'max:20', 'unique:users,phone_number'],
            'email' => ['required', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ];
    }
}
