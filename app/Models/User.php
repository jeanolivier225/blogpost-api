<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $guarded = [
        'id'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'verified' => 'boolean'
    ];

    public function pref_categories()
    {
        return $this->belongsToMany(
            Category::class,
            'user_pref_categories',
            'user_id',
            'category_id'
        );
    }

    public function pref_sources()
    {
        return $this->belongsToMany(
            Source::class,
            'user_pref_sources',
            'user_id',
            'source_id'
        );
    }

    public function pref_authors()
    {
        return $this->belongsToMany(
            Author::class,
            'user_pref_authors',
            'user_id',
            'author_id'
        );
    }

}
