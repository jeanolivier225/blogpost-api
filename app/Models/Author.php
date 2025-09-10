<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    protected $table = 'authors';

    protected $guarded = [
        'id'
    ];

    public function articles()
    {
        return $this->hasMany(Article::class, 'author_id');
    }
}
