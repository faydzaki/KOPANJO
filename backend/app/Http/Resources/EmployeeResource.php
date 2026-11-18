<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nip' => $this->nip,
            'nama' => $this->nama,
            'tempat_lahir' => $this->tempat_lahir,
            'tanggal_lahir' => is_string($this->tanggal_lahir) ? $this->tanggal_lahir : $this->tanggal_lahir?->format('Y-m-d'),
            'jenis_kelamin' => $this->jenis_kelamin,
            'alamat' => $this->alamat,
            'no_telepon' => $this->no_telepon,
            'email' => $this->email,
            'pendidikan_terakhir' => $this->pendidikan_terakhir,
            'jabatan' => $this->jabatan,
            'tanggal_masuk' => is_string($this->tanggal_masuk) ? $this->tanggal_masuk : $this->tanggal_masuk?->format('Y-m-d'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
