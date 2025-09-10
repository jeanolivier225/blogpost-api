<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_pref_authors', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('author_id');
            $table->unique([
                'user_id',
                'author_id',
            ], 'user_pref_authors_user_author_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_pref_authors');
    }
};
