<?php

namespace App\Http\Requests;

class DeviceTokenRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string'],
            'platform' => ['required', 'string', 'in:android,ios'],
        ];
    }
}
