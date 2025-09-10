<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_pref_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('category_id');
            $table->unique([
                'user_id',
                'category_id',
            ], 'user_pref_categories_user_category_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_pref_categories');
    }
};
