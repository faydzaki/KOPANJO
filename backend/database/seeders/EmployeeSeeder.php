<?php

namespace Database\Seeders;

use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Curated base employees to guarantee diversity across all categories
        $curatedEmployees = [
            // Under 25 years old (< 25)
            [
                'nip' => '200205122024011001',
                'nama' => 'Rian Pratama',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => Carbon::now()->subYears(22)->subMonths(3)->format('Y-m-d'),
                'jenis_kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Dago No. 45, Bandung',
                'no_telepon' => '081234567801',
                'email' => 'rian.pratama@kopanjo.test',
                'pendidikan_terakhir' => 'SMA/SMK',
                'jabatan' => 'Staff Administrasi',
                'tanggal_masuk' => '2024-01-15',
            ],
            [
                'nip' => '200108202023022002',
                'nama' => 'Siti Nurhaliza',
                'tempat_lahir' => 'Bogor',
                'tanggal_lahir' => Carbon::now()->subYears(23)->subMonths(6)->format('Y-m-d'),
                'jenis_kelamin' => 'Perempuan',
                'alamat' => 'Jl. Pajajaran No. 12, Bogor',
                'no_telepon' => '085712345602',
                'email' => 'siti.nurhaliza@kopanjo.test',
                'pendidikan_terakhir' => 'D3',
                'jabatan' => 'Staff Administrasi',
                'tanggal_masuk' => '2023-03-01',
            ],
            [
                'nip' => '200003152024011003',
                'nama' => 'Aditya Wijaya',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => Carbon::now()->subYears(24)->subMonths(1)->format('Y-m-d'),
                'jenis_kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Tebet Raya No. 88, Jakarta Selatan',
                'no_telepon' => '081398765403',
                'email' => 'aditya.wijaya@kopanjo.test',
                'pendidikan_terakhir' => 'S1',
                'jabatan' => 'Software Engineer',
                'tanggal_masuk' => '2024-02-10',
            ],

            // 25 - 35 years old
            [
                'nip' => '199607142021031004',
                'nama' => 'Budi Santoso',
                'tempat_lahir' => 'Surabaya',
                'tanggal_lahir' => Carbon::now()->subYears(28)->subMonths(4)->format('Y-m-d'),
                'jenis_kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Raya Darmo No. 102, Surabaya',
                'no_telepon' => '081298761204',
                'email' => 'budi.santoso@kopanjo.test',
                'pendidikan_terakhir' => 'S1',
                'jabatan' => 'Software Engineer',
                'tanggal_masuk' => '2021-04-01',
            ],
            [
                'nip' => '199409252019012005',
                'nama' => 'Dewi Anggraini',
                'tempat_lahir' => 'Semarang',
                'tanggal_lahir' => Carbon::now()->subYears(30)->subMonths(2)->format('Y-m-d'),
                'jenis_kelamin' => 'Perempuan',
                'alamat' => 'Jl. Pandanaran No. 56, Semarang',
                'no_telepon' => '087789012305',
                'email' => 'dewi.anggraini@kopanjo.test',
                'pendidikan_terakhir' => 'S2',
                'jabatan' => 'HR Specialist',
                'tanggal_masuk' => '2019-06-15',
            ],
            [
                'nip' => '199201102018081006',
                'nama' => 'Eko Prasetyo',
                'tempat_lahir' => 'Yogyakarta',
                'tanggal_lahir' => Carbon::now()->subYears(32)->subMonths(8)->format('Y-m-d'),
                'jenis_kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Malioboro No. 23, Yogyakarta',
                'no_telepon' => '085234567806',
                'email' => 'eko.prasetyo@kopanjo.test',
                'pendidikan_terakhir' => 'D3',
                'jabatan' => 'Finance Officer',
                'tanggal_masuk' => '2018-09-01',
            ],
            [
                'nip' => '199104052017052007',
                'nama' => 'Fitri Handayani',
                'tempat_lahir' => 'Solo',
                'tanggal_lahir' => Carbon::now()->subYears(33)->subMonths(5)->format('Y-m-d'),
                'jenis_kelamin' => 'Perempuan',
                'alamat' => 'Jl. Slamet Riyadi No. 77, Solo',
                'no_telepon' => '089612348907',
                'email' => 'fitri.handayani@kopanjo.test',
                'pendidikan_terakhir' => 'S1',
                'jabatan' => 'Marketing Executive',
                'tanggal_masuk' => '2017-07-20',
            ],

            // 36 - 45 years old
            [
                'nip' => '198506182015031008',
                'nama' => 'Gilang Ramadhan',
                'tempat_lahir' => 'Malang',
                'tanggal_lahir' => Carbon::now()->subYears(39)->subMonths(3)->format('Y-m-d'),
                'jenis_kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Ijen No. 14, Malang',
                'no_telepon' => '081387654308',
                'email' => 'gilang.ramadhan@kopanjo.test',
                'pendidikan_terakhir' => 'S2',
                'jabatan' => 'Project Manager',
                'tanggal_masuk' => '2015-05-10',
            ],
            [
                'nip' => '198311122014022009',
                'nama' => 'Hestina Wulandari',
                'tempat_lahir' => 'Medan',
                'tanggal_lahir' => Carbon::now()->subYears(41)->subMonths(9)->format('Y-m-d'),
                'jenis_kelamin' => 'Perempuan',
                'alamat' => 'Jl. Gatot Subroto No. 34, Medan',
                'no_telepon' => '082156781209',
                'email' => 'hestina.wulandari@kopanjo.test',
                'pendidikan_terakhir' => 'S1',
                'jabatan' => 'Operations Lead',
                'tanggal_masuk' => '2014-03-01',
            ],
            [
                'nip' => '198108222013011010',
                'nama' => 'Indra Gunawan',
                'tempat_lahir' => 'Palembang',
                'tanggal_lahir' => Carbon::now()->subYears(43)->subMonths(1)->format('Y-m-d'),
                'jenis_kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Sudirman No. 89, Palembang',
                'no_telepon' => '081278903410',
                'email' => 'indra.gunawan@kopanjo.test',
                'pendidikan_terakhir' => 'SMA/SMK',
                'jabatan' => 'General Affairs',
                'tanggal_masuk' => '2013-02-15',
            ],

            // 46 - 55 years old
            [
                'nip' => '197603152010041011',
                'nama' => 'Joko Susilo',
                'tempat_lahir' => 'Cirebon',
                'tanggal_lahir' => Carbon::now()->subYears(48)->subMonths(7)->format('Y-m-d'),
                'jenis_kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Siliwangi No. 19, Cirebon',
                'no_telepon' => '085812349011',
                'email' => 'joko.susilo@kopanjo.test',
                'pendidikan_terakhir' => 'S1',
                'jabatan' => 'Operations Lead',
                'tanggal_masuk' => '2010-06-01',
            ],
            [
                'nip' => '197309192008062012',
                'nama' => 'Kartika Sari',
                'tempat_lahir' => 'Denpasar',
                'tanggal_lahir' => Carbon::now()->subYears(51)->subMonths(2)->format('Y-m-d'),
                'jenis_kelamin' => 'Perempuan',
                'alamat' => 'Jl. Teuku Umar No. 65, Denpasar',
                'no_telepon' => '087823456712',
                'email' => 'kartika.sari@kopanjo.test',
                'pendidikan_terakhir' => 'S2',
                'jabatan' => 'Legal Officer',
                'tanggal_masuk' => '2008-08-10',
            ],
            [
                'nip' => '197012012005011013',
                'nama' => 'Lukman Hakim',
                'tempat_lahir' => 'Makassar',
                'tanggal_lahir' => Carbon::now()->subYears(54)->subMonths(10)->format('Y-m-d'),
                'jenis_kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Pettarani No. 44, Makassar',
                'no_telepon' => '081289012313',
                'email' => 'lukman.hakim@kopanjo.test',
                'pendidikan_terakhir' => 'D3',
                'jabatan' => 'General Affairs',
                'tanggal_masuk' => '2005-03-01',
            ],

            // Over 55 years old (> 55)
            [
                'nip' => '196705102000011014',
                'nama' => 'Muhamad Mansyur',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => Carbon::now()->subYears(57)->subMonths(4)->format('Y-m-d'),
                'jenis_kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Menteng Raya No. 10, Jakarta Pusat',
                'no_telepon' => '081198765414',
                'email' => 'muhamad.mansyur@kopanjo.test',
                'pendidikan_terakhir' => 'S2',
                'jabatan' => 'Project Manager',
                'tanggal_masuk' => '2000-02-01',
            ],
            [
                'nip' => '196502181998052015',
                'nama' => 'Nurul Hidayati',
                'tempat_lahir' => 'Surabaya',
                'tanggal_lahir' => Carbon::now()->subYears(59)->subMonths(8)->format('Y-m-d'),
                'jenis_kelamin' => 'Perempuan',
                'alamat' => 'Jl. Basuki Rahmat No. 50, Surabaya',
                'no_telepon' => '081512345615',
                'email' => 'nurul.hidayati@kopanjo.test',
                'pendidikan_terakhir' => 'S1',
                'jabatan' => 'Finance Officer',
                'tanggal_masuk' => '1998-07-15',
            ],
        ];

        foreach ($curatedEmployees as $data) {
            Employee::updateOrCreate(['nip' => $data['nip']], $data);
        }

        // Generate 20 additional dynamic employees using Factory to total 35 employees
        Employee::factory()->count(20)->create();
    }
}

