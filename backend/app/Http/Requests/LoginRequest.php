<?php

namespace App\Http\Requests;

class LoginRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required_without:username', 'email'],
            'username' => ['required_without:email', 'string'],
            'password' => ['required', 'string'],
        ];
    }
}
