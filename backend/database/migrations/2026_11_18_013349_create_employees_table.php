<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('nip', 30)->unique();
            $table->string('nama', 150);
            $table->string('tempat_lahir', 100);
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->text('alamat');
            $table->string('no_telepon', 20);
            $table->string('email', 150)->unique();
            $table->string('pendidikan_terakhir', 100);
            $table->string('jabatan', 100);
            $table->date('tanggal_masuk');
            $table->timestamps();

            // Indexing for search, filtering, and sorting performance
            $table->index('nama');
            $table->index('jenis_kelamin');
            $table->index('pendidikan_terakhir');
            $table->index('jabatan');
            $table->index('tanggal_masuk');
            $table->index('tanggal_lahir');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
