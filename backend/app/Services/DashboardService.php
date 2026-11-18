<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Get overall employee statistics.
     */
    public function getStatistics(): array
    {
        $stats = DB::table('employees')
            ->selectRaw("
                COUNT(*) as total_pegawai,
                COUNT(CASE WHEN jenis_kelamin = 'Laki-laki' THEN 1 END) as total_laki_laki,
                COUNT(CASE WHEN jenis_kelamin = 'Perempuan' THEN 1 END) as total_perempuan
            ")
            ->first();

        $educationStats = DB::table('employees')
            ->select('pendidikan_terakhir', DB::raw('COUNT(*) as total'))
            ->groupBy('pendidikan_terakhir')
            ->orderBy('total', 'desc')
            ->pluck('total', 'pendidikan_terakhir')
            ->toArray();

        return [
            'total_pegawai' => (int) ($stats->total_pegawai ?? 0),
            'total_laki_laki' => (int) ($stats->total_laki_laki ?? 0),
            'total_perempuan' => (int) ($stats->total_perempuan ?? 0),
            'pendidikan_terakhir' => $educationStats,
        ];
    }

    /**
     * Get gender analytics with counts and percentages.
     */
    public function getGenderAnalytics(): array
    {
        $total = Employee::count();

        $rows = DB::table('employees')
            ->select('jenis_kelamin', DB::raw('COUNT(*) as total'))
            ->groupBy('jenis_kelamin')
            ->get();

        $summary = [
            'Laki-laki' => 0,
            'Perempuan' => 0,
        ];

        $breakdown = [];

        foreach ($rows as $row) {
            $summary[$row->jenis_kelamin] = (int) $row->total;
        }

        foreach (['Laki-laki', 'Perempuan'] as $gender) {
            $count = $summary[$gender] ?? 0;
            $percentage = $total > 0 ? round(($count / $total) * 100, 2) : 0;
            $breakdown[] = [
                'jenis_kelamin' => $gender,
                'total' => $count,
                'percentage' => $percentage,
            ];
        }

        return [
            'total' => $total,
            'breakdown' => $breakdown,
            'summary' => $summary,
        ];
    }

    /**
     * Get education analytics with counts and percentages.
     */
    public function getEducationAnalytics(): array
    {
        $total = Employee::count();

        $rows = DB::table('employees')
            ->select('pendidikan_terakhir', DB::raw('COUNT(*) as total'))
            ->groupBy('pendidikan_terakhir')
            ->orderBy('total', 'desc')
            ->get();

        $breakdown = [];
        $summary = [];

        foreach ($rows as $row) {
            $count = (int) $row->total;
            $percentage = $total > 0 ? round(($count / $total) * 100, 2) : 0;

            $breakdown[] = [
                'pendidikan' => $row->pendidikan_terakhir,
                'total' => $count,
                'percentage' => $percentage,
            ];

            $summary[$row->pendidikan_terakhir] = $count;
        }

        return [
            'total' => $total,
            'breakdown' => $breakdown,
            'summary' => $summary,
        ];
    }

    /**
     * Get age demographics grouped by age brackets.
     * Groups:
     * - Di bawah 25 tahun (< 25)
     * - 25–35 tahun (25 to 35)
     * - 36–45 tahun (36 to 45)
     * - 46–55 tahun (46 to 55)
     * - Di atas 55 tahun (> 55)
     */
    public function getAgeAnalytics(): array
    {
        $ageData = DB::table('employees')
            ->selectRaw("
                COUNT(*) as total,
                COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) < 25 THEN 1 END) as under_25,
                COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 25 AND 35 THEN 1 END) as age_25_35,
                COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 36 AND 45 THEN 1 END) as age_36_45,
                COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 46 AND 55 THEN 1 END) as age_46_55,
                COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) > 55 THEN 1 END) as above_55
            ")
            ->first();

        $total = (int) ($ageData->total ?? 0);
        $under25 = (int) ($ageData->under_25 ?? 0);
        $age25To35 = (int) ($ageData->age_25_35 ?? 0);
        $age36To45 = (int) ($ageData->age_36_45 ?? 0);
        $age46To55 = (int) ($ageData->age_46_55 ?? 0);
        $above55 = (int) ($ageData->above_55 ?? 0);

        $groups = [
            [
                'group' => 'Di bawah 25 tahun',
                'key' => 'under_25',
                'total' => $under25,
                'percentage' => $total > 0 ? round(($under25 / $total) * 100, 2) : 0,
            ],
            [
                'group' => '25–35 tahun',
                'key' => 'age_25_35',
                'total' => $age25To35,
                'percentage' => $total > 0 ? round(($age25To35 / $total) * 100, 2) : 0,
            ],
            [
                'group' => '36–45 tahun',
                'key' => 'age_36_45',
                'total' => $age36To45,
                'percentage' => $total > 0 ? round(($age36To45 / $total) * 100, 2) : 0,
            ],
            [
                'group' => '46–55 tahun',
                'key' => 'age_46_55',
                'total' => $age46To55,
                'percentage' => $total > 0 ? round(($age46To55 / $total) * 100, 2) : 0,
            ],
            [
                'group' => 'Di atas 55 tahun',
                'key' => 'above_55',
                'total' => $above55,
                'percentage' => $total > 0 ? round(($above55 / $total) * 100, 2) : 0,
            ],
        ];

        return [
            'total' => $total,
            'breakdown' => $groups,
            'summary' => [
                'under_25' => $under25,
                'age_25_35' => $age25To35,
                'age_36_45' => $age36To45,
                'age_46_55' => $age46To55,
                'above_55' => $above55,
            ],
        ];
    }
}
