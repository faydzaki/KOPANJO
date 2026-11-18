<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed demo admin user
        User::create([
            'name' => 'Admin KOPANJO',
            'email' => 'admin@kopanjo.test',
            'password' => Hash::make('admin123'),
        ]);
    }

    public function test_login_success_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@kopanjo.test',
            'password' => 'admin123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Login berhasil.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'token',
                    'token_type',
                    'user' => [
                        'id',
                        'name',
                        'email',
                    ],
                ],
            ]);

        // Ensure password is not returned
        $response->assertJsonMissing(['password']);
    }

    public function test_login_failed_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@kopanjo.test',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Email atau password yang Anda masukkan salah.',
            ]);
    }

    public function test_login_validation_errors(): void
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['email', 'password'],
            ]);
    }

    public function test_get_admin_profile_with_valid_token(): void
    {
        $user = User::where('email', 'admin@kopanjo.test')->first();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Data profil berhasil diambil.',
                'data' => [
                    'id' => $user->id,
                    'name' => 'Admin KOPANJO',
                    'email' => 'admin@kopanjo.test',
                ],
            ])
            ->assertJsonMissing(['password']);
    }

    public function test_cannot_access_profile_without_token(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_logout_revokes_current_token(): void
    {
        $user = User::where('email', 'admin@kopanjo.test')->first();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logout berhasil.',
            ]);

        // Verify token revoked
        $this->assertCount(0, $user->fresh()->tokens);

        // Reset auth guard cache in test runner
        $this->app['auth']->forgetGuards();

        // Accessing /api/me with old token should now fail
        $secondResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/me');

        $secondResponse->assertStatus(401);
    }
}
