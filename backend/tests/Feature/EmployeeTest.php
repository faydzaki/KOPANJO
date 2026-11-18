<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeTest extends TestCase
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

    public function test_can_list_employees_with_pagination(): void
    {
        Employee::factory()->count(15)->create();

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/employees?page=1&per_page=10');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Daftar pegawai berhasil diambil.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'nip',
                        'nama',
                        'tempat_lahir',
                        'tanggal_lahir',
                        'jenis_kelamin',
                        'alamat',
                        'no_telepon',
                        'email',
                        'pendidikan_terakhir',
                        'jabatan',
                        'tanggal_masuk',
                    ],
                ],
                'pagination' => [
                    'current_page',
                    'per_page',
                    'total',
                    'last_page',
                    'from',
                    'to',
                ],
            ]);

        $this->assertCount(10, $response->json('data'));
        $this->assertEquals(15, $response->json('pagination.total'));
    }

    public function test_search_employees_by_nama_or_nip(): void
    {
        Employee::factory()->create([
            'nama' => 'Andi Pratama',
            'nip' => '199501012020011001',
        ]);

        Employee::factory()->create([
            'nama' => 'Budi Santoso',
            'nip' => '199602022020021002',
        ]);

        // Search by nama
        $resNama = $this->withHeaders($this->authHeaders())
            ->getJson('/api/employees?search=Andi');

        $resNama->assertStatus(200);
        $this->assertCount(1, $resNama->json('data'));
        $this->assertEquals('Andi Pratama', $resNama->json('data.0.nama'));

        // Search by NIP
        $resNip = $this->withHeaders($this->authHeaders())
            ->getJson('/api/employees?search=2020021002');

        $resNip->assertStatus(200);
        $this->assertCount(1, $resNip->json('data'));
        $this->assertEquals('Budi Santoso', $resNip->json('data.0.nama'));
    }

    public function test_filter_employees_by_gender_education_and_position(): void
    {
        Employee::factory()->create([
            'nama' => 'Pegawai Satu',
            'jenis_kelamin' => 'Laki-laki',
            'pendidikan_terakhir' => 'S1',
            'jabatan' => 'Software Engineer',
        ]);

        Employee::factory()->create([
            'nama' => 'Pegawai Dua',
            'jenis_kelamin' => 'Perempuan',
            'pendidikan_terakhir' => 'S2',
            'jabatan' => 'HR Specialist',
        ]);

        // Filter gender
        $resGender = $this->withHeaders($this->authHeaders())
            ->getJson('/api/employees?jenis_kelamin=Perempuan');
        $this->assertCount(1, $resGender->json('data'));
        $this->assertEquals('Perempuan', $resGender->json('data.0.jenis_kelamin'));

        // Filter pendidikan
        $resEdu = $this->withHeaders($this->authHeaders())
            ->getJson('/api/employees?pendidikan_terakhir=S1');
        $this->assertCount(1, $resEdu->json('data'));
        $this->assertEquals('S1', $resEdu->json('data.0.pendidikan_terakhir'));

        // Filter jabatan
        $resJabatan = $this->withHeaders($this->authHeaders())
            ->getJson('/api/employees?jabatan=Software Engineer');
        $this->assertCount(1, $resJabatan->json('data'));
        $this->assertEquals('Software Engineer', $resJabatan->json('data.0.jabatan'));
    }

    public function test_can_create_new_employee(): void
    {
        $payload = [
            'nip' => '199508172023011005',
            'nama' => 'Raden Wijaya',
            'tempat_lahir' => 'Surabaya',
            'tanggal_lahir' => '1995-08-17',
            'jenis_kelamin' => 'Laki-laki',
            'alamat' => 'Jl. Pahlawan No. 45, Surabaya',
            'no_telepon' => '081234567890',
            'email' => 'raden.wijaya@kopanjo.test',
            'pendidikan_terakhir' => 'S1',
            'jabatan' => 'Software Engineer',
            'tanggal_masuk' => '2023-01-10',
        ];

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/employees', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Pegawai berhasil ditambahkan.',
                'data' => [
                    'nip' => '199508172023011005',
                    'nama' => 'Raden Wijaya',
                    'email' => 'raden.wijaya@kopanjo.test',
                ],
            ]);

        $this->assertDatabaseHas('employees', [
            'nip' => '199508172023011005',
            'email' => 'raden.wijaya@kopanjo.test',
        ]);
    }

    public function test_cannot_create_employee_with_duplicate_nip(): void
    {
        Employee::factory()->create([
            'nip' => '199508172023011005',
            'email' => 'existing@kopanjo.test',
        ]);

        $payload = [
            'nip' => '199508172023011005', // Duplicate
            'nama' => 'Pegawai Baru',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1996-01-01',
            'jenis_kelamin' => 'Laki-laki',
            'alamat' => 'Jl. Merdeka No. 1',
            'no_telepon' => '081299998888',
            'email' => 'new.unique@kopanjo.test',
            'pendidikan_terakhir' => 'S1',
            'jabatan' => 'Staff Administrasi',
            'tanggal_masuk' => '2024-01-01',
        ];

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/employees', $payload);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonStructure([
                'errors' => ['nip'],
            ]);
    }

    public function test_cannot_create_employee_with_duplicate_email(): void
    {
        Employee::factory()->create([
            'nip' => '199001012020011001',
            'email' => 'existing@kopanjo.test',
        ]);

        $payload = [
            'nip' => '199002022020021002',
            'nama' => 'Pegawai Baru',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1996-01-01',
            'jenis_kelamin' => 'Laki-laki',
            'alamat' => 'Jl. Merdeka No. 1',
            'no_telepon' => '081299998888',
            'email' => 'existing@kopanjo.test', // Duplicate
            'pendidikan_terakhir' => 'S1',
            'jabatan' => 'Staff Administrasi',
            'tanggal_masuk' => '2024-01-01',
        ];

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/employees', $payload);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonStructure([
                'errors' => ['email'],
            ]);
    }

    public function test_can_view_employee_detail(): void
    {
        $employee = Employee::factory()->create([
            'nama' => 'Dina Mariana',
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/employees/' . $employee->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Detail pegawai berhasil diambil.',
                'data' => [
                    'id' => $employee->id,
                    'nama' => 'Dina Mariana',
                    'nip' => $employee->nip,
                ],
            ]);
    }

    public function test_view_nonexistent_employee_returns_404(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/employees/999999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_can_update_employee(): void
    {
        $employee = Employee::factory()->create([
            'nip' => '199303032020031003',
            'nama' => 'Nama Lama',
            'email' => 'lama@kopanjo.test',
            'jabatan' => 'Junior Developer',
        ]);

        $payload = [
            'nip' => '199303032020031003', // Keep same NIP
            'nama' => 'Nama Baru',
            'tempat_lahir' => $employee->tempat_lahir,
            'tanggal_lahir' => $employee->tanggal_lahir->format('Y-m-d'),
            'jenis_kelamin' => $employee->jenis_kelamin,
            'alamat' => 'Alamat baru yang sudah pindah',
            'no_telepon' => '081299887766',
            'email' => 'lama@kopanjo.test', // Keep same Email
            'pendidikan_terakhir' => 'S2',
            'jabatan' => 'Senior Developer',
            'tanggal_masuk' => $employee->tanggal_masuk->format('Y-m-d'),
        ];

        $response = $this->withHeaders($this->authHeaders())
            ->putJson('/api/employees/' . $employee->id, $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Data pegawai berhasil diperbarui.',
                'data' => [
                    'nama' => 'Nama Baru',
                    'jabatan' => 'Senior Developer',
                    'pendidikan_terakhir' => 'S2',
                ],
            ]);

        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'nama' => 'Nama Baru',
            'jabatan' => 'Senior Developer',
        ]);
    }

    public function test_cannot_update_employee_with_another_employees_nip(): void
    {
        $employee1 = Employee::factory()->create(['nip' => '111111111111111111']);
        $employee2 = Employee::factory()->create(['nip' => '222222222222222222']);

        $payload = [
            'nip' => '111111111111111111', // Trying to take employee1's NIP
            'nama' => 'Updated Name',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1995-01-01',
            'jenis_kelamin' => 'Laki-laki',
            'alamat' => 'Alamat',
            'no_telepon' => '081234567890',
            'email' => 'unique.email@kopanjo.test',
            'pendidikan_terakhir' => 'S1',
            'jabatan' => 'Staff',
            'tanggal_masuk' => '2023-01-01',
        ];

        $response = $this->withHeaders($this->authHeaders())
            ->putJson('/api/employees/' . $employee2->id, $payload);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonStructure([
                'errors' => ['nip'],
            ]);
    }

    public function test_can_delete_employee(): void
    {
        $employee = Employee::factory()->create();

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson('/api/employees/' . $employee->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Data pegawai berhasil dihapus.',
            ]);

        $this->assertDatabaseMissing('employees', [
            'id' => $employee->id,
        ]);
    }
}
