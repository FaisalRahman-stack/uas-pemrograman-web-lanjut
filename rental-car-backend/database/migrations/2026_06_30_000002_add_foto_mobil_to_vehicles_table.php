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
            $table->string('foto_mobil')->nullable();
            $table->string('kapasitas')->nullable();
            $table->string('transmisi')->nullable();
            $table->string('bahan_bakar')->nullable();
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