<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('rider_lat', 10, 8)->nullable()->after('delivery_time');
            $table->decimal('rider_lng', 11, 8)->nullable()->after('rider_lat');
            $table->timestamp('estimated_delivery_at')->nullable()->after('rider_lng');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['rider_lat', 'rider_lng', 'estimated_delivery_at']);
        });
    }
};
