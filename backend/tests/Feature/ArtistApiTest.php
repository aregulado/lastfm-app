<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Artist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ArtistApiTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    public function test_can_fetch_artists_list()
    {
        Artist::factory()->count(5)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/artists');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'listeners',
                    'url',
                    'image',
                ]
            ]
        ]);
        $response->assertJsonCount(5, 'data');
    }

    public function test_cannot_fetch_artists_without_authentication()
    {
        $response = $this->getJson('/api/artists');
        $response->assertStatus(401);
    }

    public function test_artists_are_ordered_by_listeners_desc()
    {
        Artist::factory()->create(['name' => 'Artist A', 'listeners' => 1000]);
        Artist::factory()->create(['name' => 'Artist B', 'listeners' => 5000]);
        Artist::factory()->create(['name' => 'Artist C', 'listeners' => 3000]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/artists');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertEquals('Artist B', $data[0]['name']);
        $this->assertEquals('Artist C', $data[1]['name']);
        $this->assertEquals('Artist A', $data[2]['name']);
    }
}
