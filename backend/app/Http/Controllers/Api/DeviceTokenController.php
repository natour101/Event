<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DeviceTokenRequest;
use App\Services\ApiResponse;
use App\Services\DeviceTokenService;

class DeviceTokenController extends Controller
{
    public function store(DeviceTokenRequest $request, DeviceTokenService $service)
    {
        $token = $service->upsert($request->user(), $request->input('token'), $request->input('platform'));

        return ApiResponse::success('Token saved', [
            'token' => $token->token,
        ]);
    }
}
