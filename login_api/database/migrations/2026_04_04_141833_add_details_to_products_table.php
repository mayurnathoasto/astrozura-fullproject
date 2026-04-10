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
        Schema::table('products', function (Blueprint $table) {
            $table->text('benefits')->nullable();
            $table->string('bead_count')->nullable();
            $table->string('bead_size')->nullable();
            $table->string('seed_type')->nullable();
            $table->string('thread_type')->nullable();
            $table->string('origin')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['benefits', 'bead_count', 'bead_size', 'seed_type', 'thread_type', 'origin']);
        });
    }
};
