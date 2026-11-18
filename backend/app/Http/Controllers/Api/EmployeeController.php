<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees with search, filter, sorting, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Employee::query();

        // Search by nama or nip
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        // Filter by jenis_kelamin
        if ($request->filled('jenis_kelamin')) {
            $query->where('jenis_kelamin', $request->input('jenis_kelamin'));
        }

        // Filter by pendidikan_terakhir
        if ($request->filled('pendidikan_terakhir')) {
            $query->where('pendidikan_terakhir', $request->input('pendidikan_terakhir'));
        }

        // Filter by jabatan
        if ($request->filled('jabatan')) {
            $query->where('jabatan', $request->input('jabatan'));
        }

        // Sorting
        $allowedSorts = ['nama', 'tanggal_masuk', 'tanggal_lahir', 'nip', 'created_at', 'id'];
        $sortBy = in_array($request->input('sort_by'), $allowedSorts, true)
            ? $request->input('sort_by')
            : 'id';

        $sortOrder = strtolower($request->input('sort_order', 'desc')) === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = (int) $request->input('per_page', 10);
        $perPage = ($perPage > 0 && $perPage <= 100) ? $perPage : 10;

        $employees = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Daftar pegawai berhasil diambil.',
            'data' => EmployeeResource::collection($employees),
            'pagination' => [
                'current_page' => $employees->currentPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
                'last_page' => $employees->lastPage(),
                'from' => $employees->firstItem(),
                'to' => $employees->lastItem(),
            ],
        ], 200);
    }

    /**
     * Store a newly created employee.
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $employee = Employee::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pegawai berhasil ditambahkan.',
            'data' => new EmployeeResource($employee),
        ], 201);
    }

    /**
     * Display the specified employee.
     */
    public function show(string|int $id): JsonResponse
    {
        $employee = Employee::find($id);

        if (! $employee) {
            return response()->json([
                'success' => false,
                'message' => 'Data pegawai tidak ditemukan.',
                'errors' => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail pegawai berhasil diambil.',
            'data' => new EmployeeResource($employee),
        ], 200);
    }

    /**
     * Update the specified employee in storage.
     */
    public function update(UpdateEmployeeRequest $request, string|int $id): JsonResponse
    {
        $employee = Employee::find($id);

        if (! $employee) {
            return response()->json([
                'success' => false,
                'message' => 'Data pegawai tidak ditemukan.',
                'errors' => null,
            ], 404);
        }

        $employee->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil diperbarui.',
            'data' => new EmployeeResource($employee->fresh()),
        ], 200);
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(string|int $id): JsonResponse
    {
        $employee = Employee::find($id);

        if (! $employee) {
            return response()->json([
                'success' => false,
                'message' => 'Data pegawai tidak ditemukan.',
                'errors' => null,
            ], 404);
        }

        $employee->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil dihapus.',
            'data' => null,
        ], 200);
    }
}
