<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            $table->string('subtitle')->nullable()->after('title');
            $table->string('tag')->nullable()->after('subtitle');
            $table->unsignedInteger('views')->default(0)->after('price');
            $table->unsignedInteger('attendees_count')->default(0)->after('views');
            $table->decimal('rating', 3, 1)->default(0)->after('attendees_count');
            $table->boolean('is_featured')->default(false)->after('rating');
            $table->decimal('distance_km', 6, 2)->nullable()->after('is_featured');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn([
                'category_id',
                'subtitle',
                'tag',
                'views',
                'attendees_count',
                'rating',
                'is_featured',
                'distance_km',
            ]);
        });
    }
};
