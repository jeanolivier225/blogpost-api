<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'John Doe', 'email' => 'user@local.dev', 'password' => bcrypt('123456'), 'verified' => true, 'verified_at' => now()],
        ];

        foreach ($users as $user) {

            User::updateOrCreate(
                [
                    'email' => $user['email']
                ]
                , \Arr::except($user, ['email']));

        }
    }
}
