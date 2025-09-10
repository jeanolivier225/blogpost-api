<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Source extends Model
{
    protected $guarded = [
        'id',
    ];
    protected $table = 'sources';

    public function articles()
    {
        return $this->hasMany(Article::class, 'source_id');
    }
}
