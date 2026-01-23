<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        $categories = Category::all()->keyBy('slug');

        $events = [
            [
                'title' => 'Riyadh Music Festival',
                'subtitle' => '12 Oct • Riyadh Boulevard',
                'tag' => 'Music',
                'category_id' => $categories['music']?->id,
                'description' => 'A vibrant night with top regional artists.',
                'location' => 'Riyadh Boulevard',
                'start_at' => Carbon::now()->addDays(5),
                'price' => 120,
                'image_url' => 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'distance_km' => 2.5,
                'rating' => 4.8,
                'attendees_count' => 120,
            ],
            [
                'title' => 'Evening Book Club',
                'subtitle' => 'King Fahd Library',
                'tag' => 'Arts',
                'category_id' => $categories['arts']?->id,
                'description' => 'Discuss the latest releases with local authors.',
                'location' => 'King Fahd Library',
                'start_at' => Carbon::now()->addDays(2),
                'price' => 0,
                'image_url' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
                'distance_km' => 3.1,
                'rating' => 4.5,
                'attendees_count' => 85,
            ],
            [
                'title' => 'Coffee Workshop',
                'subtitle' => 'Olaya District, Riyadh',
                'tag' => 'Food',
                'category_id' => $categories['food']?->id,
                'description' => 'Learn specialty coffee brewing tips.',
                'location' => 'Olaya District',
                'start_at' => Carbon::now()->addDays(3),
                'price' => 60,
                'image_url' => 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1200&q=80',
                'distance_km' => 5.0,
                'rating' => 4.2,
                'attendees_count' => 45,
            ],
            [
                'title' => 'Tech Summit 2024',
                'subtitle' => 'Discover the future of innovation',
                'tag' => 'Tech',
                'category_id' => $categories['tech']?->id,
                'description' => 'Join the biggest tech leaders in the region.',
                'location' => 'Riyadh Front',
                'start_at' => Carbon::now()->addDays(20),
                'price' => 220,
                'image_url' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'rating' => 4.9,
                'attendees_count' => 200,
            ],
            [
                'title' => 'Modern Art Gallery',
                'subtitle' => 'Jax District, Diriyah',
                'tag' => 'Arts',
                'category_id' => $categories['arts']?->id,
                'description' => 'Explore curated works by local artists.',
                'location' => 'Jax District',
                'start_at' => Carbon::now()->addDays(12),
                'price' => 30,
                'image_url' => 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
                'rating' => 4.3,
                'attendees_count' => 70,
            ],
        ];

        foreach ($events as $event) {
            Event::create(array_merge($event, [
                'user_id' => $user?->id,
            ]));
        }
    }
}
