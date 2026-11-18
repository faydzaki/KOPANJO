<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EmployeeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - KOPANJO
|--------------------------------------------------------------------------
*/

// Authentication (Public)
Route::post('/login', [AuthController::class, 'login']);

// Authenticated Routes (Sanctum Protected)
Route::middleware('auth:sanctum')->group(function () {
    // Auth Profile & Logout
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Employee Management (CRUD)
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::get('/employees/{id}', [EmployeeController::class, 'show']);
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);

    // Dashboard Analytics
    Route::prefix('dashboard')->group(function () {
        Route::get('/statistics', [DashboardController::class, 'statistics']);
        Route::get('/gender', [DashboardController::class, 'gender']);
        Route::get('/education', [DashboardController::class, 'education']);
        Route::get('/age', [DashboardController::class, 'age']);
    });
});
