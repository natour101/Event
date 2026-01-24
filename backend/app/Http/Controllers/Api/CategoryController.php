<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\ApiResponse;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()->orderBy('name')->get();

        return ApiResponse::success('Categories fetched', [
            'items' => CategoryResource::collection($categories)->resolve(),
        ]);
    }
}
