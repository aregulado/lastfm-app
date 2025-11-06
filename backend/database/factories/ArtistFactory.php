<?php

namespace Database\Factories;

use App\Models\Artist;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArtistFactory extends Factory
{
    protected $model = Artist::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'listeners' => $this->faker->numberBetween(1000, 10000000),
            'url' => $this->faker->url(),
            'image' => $this->faker->imageUrl(640, 480, 'music', true),
        ];
    }
}
