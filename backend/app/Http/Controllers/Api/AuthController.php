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
            $username = trim((string) $request->input('username'));
            $email = strtolower(trim((string) $request->input('email')));
            $phoneNumber = trim((string) $request->input('phone_number'));

            $user = User::create([
                'name' => $username,
                'username' => $username,
                'phone_number' => $phoneNumber,
                'email' => $email,
                'password' => Hash::make($request->input('password')),
            ]);


            $token = $user->createToken('api')->plainTextToken;


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
    $identifier = trim((string) $request->input('identifier', ''));
    $password   = (string) $request->input('password', '');

    $identifierNormalized = Str::contains($identifier, '@')
        ? strtolower($identifier)
        : $identifier;

    $user = User::query()
        ->whereRaw('LOWER(email) = ?', [strtolower($identifierNormalized)])
        ->orWhere('username', $identifierNormalized)
        ->first();

    if (!$user || !Hash::check($password, $user->password)) {
        return ApiResponse::error(
            'Invalid credentials',
            ['identifier' => ['Invalid credentials']],
            401
        );
    }

   

    $token = $user->createToken('api')->plainTextToken;

    return ApiResponse::success('Login successful', [
        'token' => $token,
        'user'  => new UserResource($user),
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
