<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'email' => 'admin@kopanjo.test',
        ]);

        $this->token = $this->user->createToken('test_token')->plainTextToken;
    }

    protected function authHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ];
    }

    public function test_get_statistics_with_data(): void
    {
        // 2 Males, 1 Female
        Employee::factory()->create([
            'jenis_kelamin' => 'Laki-laki',
            'pendidikan_terakhir' => 'S1',
        ]);
        Employee::factory()->create([
            'jenis_kelamin' => 'Laki-laki',
            'pendidikan_terakhir' => 'D3',
        ]);
        Employee::factory()->create([
            'jenis_kelamin' => 'Perempuan',
            'pendidikan_terakhir' => 'S1',
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/dashboard/statistics');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Data statistik pegawai berhasil diambil.',
                'data' => [
                    'total_pegawai' => 3,
                    'total_laki_laki' => 2,
                    'total_perempuan' => 1,
                    'pendidikan_terakhir' => [
                        'S1' => 2,
                        'D3' => 1,
                    ],
                ],
            ]);
    }

    public function test_get_gender_analytics(): void
    {
        // 3 Males, 1 Female = 75% and 25%
        Employee::factory()->count(3)->create(['jenis_kelamin' => 'Laki-laki']);
        Employee::factory()->count(1)->create(['jenis_kelamin' => 'Perempuan']);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/dashboard/gender');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Data analitik gender berhasil diambil.',
                'data' => [
                    'total' => 4,
                    'summary' => [
                        'Laki-laki' => 3,
                        'Perempuan' => 1,
                    ],
                ],
            ]);

        $breakdown = collect($response->json('data.breakdown'));
        $male = $breakdown->firstWhere('jenis_kelamin', 'Laki-laki');
        $female = $breakdown->firstWhere('jenis_kelamin', 'Perempuan');

        $this->assertEquals(75.0, $male['percentage']);
        $this->assertEquals(25.0, $female['percentage']);
    }

    public function test_get_education_analytics(): void
    {
        Employee::factory()->count(2)->create(['pendidikan_terakhir' => 'S1']);
        Employee::factory()->count(1)->create(['pendidikan_terakhir' => 'SMA/SMK']);
        Employee::factory()->count(1)->create(['pendidikan_terakhir' => 'S2']);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/dashboard/education');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Data analitik pendidikan berhasil diambil.',
                'data' => [
                    'total' => 4,
                    'summary' => [
                        'S1' => 2,
                        'SMA/SMK' => 1,
                        'S2' => 1,
                    ],
                ],
            ]);
    }

    public function test_get_age_analytics_with_all_age_brackets(): void
    {
        // Under 25 (22 yo)
        Employee::factory()->create([
            'tanggal_lahir' => Carbon::now()->subYears(22)->format('Y-m-d'),
        ]);

        // 25-35 (28 yo)
        Employee::factory()->create([
            'tanggal_lahir' => Carbon::now()->subYears(28)->format('Y-m-d'),
        ]);

        // 36-45 (40 yo)
        Employee::factory()->create([
            'tanggal_lahir' => Carbon::now()->subYears(40)->format('Y-m-d'),
        ]);

        // 46-55 (50 yo)
        Employee::factory()->create([
            'tanggal_lahir' => Carbon::now()->subYears(50)->format('Y-m-d'),
        ]);

        // Above 55 (58 yo)
        Employee::factory()->create([
            'tanggal_lahir' => Carbon::now()->subYears(58)->format('Y-m-d'),
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/dashboard/age');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Data analitik usia berhasil diambil.',
                'data' => [
                    'total' => 5,
                    'summary' => [
                        'under_25' => 1,
                        'age_25_35' => 1,
                        'age_36_45' => 1,
                        'age_46_55' => 1,
                        'above_55' => 1,
                    ],
                ],
            ]);

        $breakdown = collect($response->json('data.breakdown'));
        $this->assertEquals(20.0, $breakdown->firstWhere('key', 'under_25')['percentage']);
        $this->assertEquals(20.0, $breakdown->firstWhere('key', 'age_25_35')['percentage']);
        $this->assertEquals(20.0, $breakdown->firstWhere('key', 'age_36_45')['percentage']);
        $this->assertEquals(20.0, $breakdown->firstWhere('key', 'age_46_55')['percentage']);
        $this->assertEquals(20.0, $breakdown->firstWhere('key', 'above_55')['percentage']);
    }

    public function test_dashboard_handles_empty_database_gracefully(): void
    {
        // Ensure 0 employees
        $this->assertEquals(0, Employee::count());

        // 1. Statistics
        $resStats = $this->withHeaders($this->authHeaders())
            ->getJson('/api/dashboard/statistics');
        $resStats->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_pegawai' => 0,
                    'total_laki_laki' => 0,
                    'total_perempuan' => 0,
                    'pendidikan_terakhir' => [],
                ],
            ]);

        // 2. Gender
        $resGender = $this->withHeaders($this->authHeaders())
            ->getJson('/api/dashboard/gender');
        $resGender->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total' => 0,
                    'summary' => [
                        'Laki-laki' => 0,
                        'Perempuan' => 0,
                    ],
                ],
            ]);

        // 3. Education
        $resEdu = $this->withHeaders($this->authHeaders())
            ->getJson('/api/dashboard/education');
        $resEdu->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total' => 0,
                    'breakdown' => [],
                    'summary' => [],
                ],
            ]);

        // 4. Age
        $resAge = $this->withHeaders($this->authHeaders())
            ->getJson('/api/dashboard/age');
        $resAge->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total' => 0,
                    'summary' => [
                        'under_25' => 0,
                        'age_25_35' => 0,
                        'age_36_45' => 0,
                        'age_46_55' => 0,
                        'above_55' => 0,
                    ],
                ],
            ]);
    }

    public function test_unauthenticated_user_cannot_access_dashboard(): void
    {
        $this->getJson('/api/dashboard/statistics')->assertStatus(401);
        $this->getJson('/api/dashboard/gender')->assertStatus(401);
        $this->getJson('/api/dashboard/education')->assertStatus(401);
        $this->getJson('/api/dashboard/age')->assertStatus(401);
    }
}

