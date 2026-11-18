<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Get overall employee statistics.
     */
    public function statistics(): JsonResponse
    {
        $data = $this->dashboardService->getStatistics();

        return response()->json([
            'success' => true,
            'message' => 'Data statistik pegawai berhasil diambil.',
            'data' => $data,
        ], 200);
    }

    /**
     * Get gender analytics.
     */
    public function gender(): JsonResponse
    {
        $data = $this->dashboardService->getGenderAnalytics();

        return response()->json([
            'success' => true,
            'message' => 'Data analitik gender berhasil diambil.',
            'data' => $data,
        ], 200);
    }

    /**
     * Get education analytics.
     */
    public function education(): JsonResponse
    {
        $data = $this->dashboardService->getEducationAnalytics();

        return response()->json([
            'success' => true,
            'message' => 'Data analitik pendidikan berhasil diambil.',
            'data' => $data,
        ], 200);
    }

    /**
     * Get age demographics analytics.
     */
    public function age(): JsonResponse
    {
        $data = $this->dashboardService->getAgeAnalytics();

        return response()->json([
            'success' => true,
            'message' => 'Data analitik usia berhasil diambil.',
            'data' => $data,
        ], 200);
    }
}

