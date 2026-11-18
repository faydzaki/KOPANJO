<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['Laki-laki', 'Perempuan']);
        $firstName = $gender === 'Laki-laki' ? fake('id_ID')->firstNameMale() : fake('id_ID')->firstNameFemale();
        $lastName = fake('id_ID')->lastName();
        $nama = "{$firstName} {$lastName}";

        $educations = ['SMA/SMK', 'D3', 'S1', 'S2'];
        $education = fake()->randomElement($educations);

        $jabatans = [
            'Staff Administrasi',
            'HR Specialist',
            'Finance Officer',
            'Software Engineer',
            'Project Manager',
            'Marketing Executive',
            'Operations Lead',
            'General Affairs',
            'Legal Officer',
            'Data Analyst',
            'Quality Assurance',
            'Accountant',
        ];
        $jabatan = fake()->randomElement($jabatans);

        $cities = ['Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Medan', 'Makassar', 'Palembang', 'Denpasar', 'Malang', 'Solo', 'Bogor'];
        $tempatLahir = fake()->randomElement($cities);

        // Rentang usia 20-60 tahun
        $birthDate = fake()->dateTimeBetween('-60 years', '-20 years');
        $birthDateString = $birthDate->format('Y-m-d');

        // NIP format: Ymd + random digits
        $nip = $birthDate->format('Ymd') . fake()->unique()->numerify('######');

        $tanggalMasuk = fake()->dateTimeBetween('-8 years', '-1 month')->format('Y-m-d');

        $phonePrefixes = ['0812', '0813', '0821', '0822', '0852', '0853', '0857', '0858', '0877', '0878', '0896', '0897'];
        $noTelepon = fake()->randomElement($phonePrefixes) . fake()->numerify('########');

        return [
            'nip' => $nip,
            'nama' => $nama,
            'tempat_lahir' => $tempatLahir,
            'tanggal_lahir' => $birthDateString,
            'jenis_kelamin' => $gender,
            'alamat' => fake('id_ID')->address(),
            'no_telepon' => $noTelepon,
            'email' => fake()->unique()->safeEmail(),
            'pendidikan_terakhir' => $education,
            'jabatan' => $jabatan,
            'tanggal_masuk' => $tanggalMasuk,
        ];
    }
}
