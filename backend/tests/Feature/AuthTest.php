<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_login_page()
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
        $response->assertViewIs('login');
    }

    public function test_user_can_login_with_correct_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        $response = $this->withoutMiddleware()
            ->from('/login')
            ->post('/login', [
                'email' => 'test@example.com',
                'password' => 'password',
            ]);

        $response->assertStatus(302);
        $response->assertRedirect('/home');
        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_incorrect_credentials()
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        $response = $this->withoutMiddleware()
            ->from('/login')
            ->post('/login', [
                'email' => 'test@example.com',
                'password' => 'wrong-password',
            ]);

        $response->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_authenticated_user_can_view_home_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/home');
        $response->assertStatus(200);
        $response->assertViewIs('home');
    }

    public function test_guest_cannot_view_home_page()
    {
        $response = $this->get('/home');
        $response->assertRedirect('/login');
    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withoutMiddleware()
            ->post('/logout');

        $response->assertRedirect('/login');
        $this->assertGuest();
    }
}
