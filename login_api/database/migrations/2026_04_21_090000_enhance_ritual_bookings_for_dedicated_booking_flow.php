<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ritual_bookings', function (Blueprint $table) {
            $table->string('venue_type')->default('temple')->after('timezone');
            $table->string('location_city')->nullable()->after('location_address');
            $table->string('location_state')->nullable()->after('location_city');
            $table->string('location_pincode', 20)->nullable()->after('location_state');
            $table->boolean('expense_acknowledged')->default(false)->after('location_pincode');
            $table->date('confirmed_date')->nullable()->after('preferred_time');
            $table->string('confirmed_time')->nullable()->after('confirmed_date');
            $table->text('admin_response')->nullable()->after('notes');
            $table->timestamp('admin_response_at')->nullable()->after('admin_response');

            $table->index(['status', 'preferred_date'], 'ritual_bookings_status_preferred_date_idx');
        });
    }

    public function down(): void
    {
        Schema::table('ritual_bookings', function (Blueprint $table) {
            $table->dropIndex('ritual_bookings_status_preferred_date_idx');
            $table->dropColumn([
                'venue_type',
                'location_city',
                'location_state',
                'location_pincode',
                'expense_acknowledged',
                'confirmed_date',
                'confirmed_time',
                'admin_response',
                'admin_response_at',
            ]);
        });
    }
};
