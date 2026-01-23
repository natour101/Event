<?php

namespace Database\Seeders;

use App\Models\Tournament;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TournamentSeeder extends Seeder
{
    public function run(): void
    {
        $tournaments = [
            [
                'title' => 'FIFA 24 Summer Cup',
                'subtitle' => 'Middle East Finals • Riyadh',
                'prize' => '5000 SAR',
                'teams' => '32 Teams',
                'status' => 'live',
                'is_trending' => true,
                'image_url' => 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
                'starts_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Rocket League League',
                'subtitle' => 'Arab Championship',
                'prize' => '3000 SAR',
                'teams' => '24 Teams',
                'status' => 'upcoming',
                'image_url' => 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
                'starts_at' => Carbon::now()->addDays(7),
            ],
        ];

        foreach ($tournaments as $tournament) {
            Tournament::create($tournament);
        }
    }
}
