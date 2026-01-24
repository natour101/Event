<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AvatarUploadRequest;
use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Resources\UserResource;
use App\Services\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return ApiResponse::success('Profile data', [
            'user' => (new UserResource($request->user()))->resolve(),
        ]);
    }

    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();
        $payload = $request->validated();

        if (array_key_exists('profile_image_url', $payload)) {
            $payload['profile_image_path'] = $payload['profile_image_url'];
            unset($payload['profile_image_url']);
        }

        $user->update($payload);

        return ApiResponse::success('Profile updated', [
            'user' => (new UserResource($user))->resolve(),
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = $request->user();

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return ApiResponse::error('Invalid current password', [
                'current_password' => ['Current password is incorrect.'],
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->input('password')),
        ]);

        return ApiResponse::success('Password updated');
    }

    public function uploadAvatar(AvatarUploadRequest $request)
    {
        $user = $request->user();

        if ($user->profile_image_path) {
            Storage::disk('public')->delete($user->profile_image_path);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update([
            'profile_image_path' => $path,
        ]);

        return ApiResponse::success('Avatar uploaded', [
            'user' => (new UserResource($user))->resolve(),
        ]);
    }
}
