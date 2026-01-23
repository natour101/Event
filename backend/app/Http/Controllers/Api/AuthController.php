<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\ApiResponse;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, NotificationService $notification)
    {
        try {
            $user = User::create([
                'name' => $request->input('username'),
                'username' => $request->input('username'),
                'phone_number' => $request->input('phone_number'),
                'email' => $request->input('email'),
                'password' => $request->input('password'),
            ]);

            $token = $user->createToken('api')->plainTextToken;

            // Notifications can be sent after the device token is registered.

            return ApiResponse::success('Registered successfully', [
                'token' => $token,
                'user' => new UserResource($user),
            ], 201);
        } catch (\Throwable $error) {
            Log::error('Register error', ['error' => $error->getMessage()]);
            return ApiResponse::error('Registration failed', ['server' => $error->getMessage()], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->input('email'))->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return ApiResponse::error('Invalid credentials', ['email' => ['Invalid credentials']], 401);
        }

        $token = $user->createToken('api')->plainTextToken;

        return ApiResponse::success('Login successful', [
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    public function logout()
    {
        $user = request()->user();
        $user?->currentAccessToken()?->delete();

        return ApiResponse::success('Logged out');
    }

    public function me()
    {
        return ApiResponse::success('User profile', [
            'user' => new UserResource(request()->user()),
        ]);
    }
}
