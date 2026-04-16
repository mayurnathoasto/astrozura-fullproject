<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'profile_image')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('profile_image')->nullable()->after('password');
            });
        }

        $adminExists = DB::table('users')->where('email', 'admin@astrozura.com')->exists();

        if (!$adminExists) {
            DB::table('users')->insert([
                'name' => 'Astro Zura Admin',
                'email' => 'admin@astrozura.com',
                'password' => Hash::make('123456'),
                'role' => 'admin',
                'is_profile_complete' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('users')->where('email', 'admin@astrozura.com')->where('role', 'admin')->delete();

        if (Schema::hasColumn('users', 'profile_image')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('profile_image');
            });
        }
    }
};
