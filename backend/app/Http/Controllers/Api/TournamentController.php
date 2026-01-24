<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTournamentRequest;
use App\Http\Requests\UpdateTournamentRequest;
use App\Http\Resources\TournamentResource;
use App\Models\Tournament;
use App\Services\ApiResponse;
use Illuminate\Http\Request;

class TournamentController extends Controller
{
    public function index(Request $request)
    {
        $query = Tournament::query();

        if ($search = $request->get('search')) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('subtitle', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($request->boolean('trending')) {
            $query->where('is_trending', true);
        }

        $sortBy = $request->get('sort_by', 'starts_at');
        $sortDir = $request->get('sort_dir', 'asc');

        $tournaments = $query->orderBy($sortBy, $sortDir)
            ->paginate($request->integer('per_page', 10));

        return ApiResponse::success('Tournaments fetched', [
            'items' => TournamentResource::collection($tournaments)->resolve(),
            'pagination' => [
                'total' => $tournaments->total(),
                'per_page' => $tournaments->perPage(),
                'current_page' => $tournaments->currentPage(),
                'last_page' => $tournaments->lastPage(),
            ],
        ]);
    }

    public function show(Tournament $tournament)
    {
        return ApiResponse::success('Tournament details', [
            'tournament' => (new TournamentResource($tournament))->resolve(),
        ]);
    }

    public function store(StoreTournamentRequest $request)
    {
        $tournament = Tournament::create($request->validated());

        return ApiResponse::success('Tournament created', [
            'tournament' => (new TournamentResource($tournament))->resolve(),
        ], 201);
    }

    public function update(UpdateTournamentRequest $request, Tournament $tournament)
    {
        $tournament->update($request->validated());

        return ApiResponse::success('Tournament updated', [
            'tournament' => (new TournamentResource($tournament))->resolve(),
        ]);
    }

    public function destroy(Tournament $tournament)
    {
        $tournament->delete();

        return ApiResponse::success('Tournament deleted');
    }
}
