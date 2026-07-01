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
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('foto_mobil')->nullable()->after('status');
            $table->string('kapasitas')->nullable()->after('foto_mobil');
            $table->string('transmisi')->nullable()->after('kapasitas');
            $table->string('bahan_bakar')->nullable()->after('transmisi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['bahan_bakar', 'transmisi', 'kapasitas', 'foto_mobil']);
        });
    }
};