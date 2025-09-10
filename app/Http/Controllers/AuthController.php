<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $data = \Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6'
        ])->validate();

        $user = User::where('email', '=', $data['email'])->first();

        if(!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User account not found',
            ], 404);
        }

        if(!$user->verified) {
            return response()->json([
                'success' => false,
                'message' => 'User account not verified',
            ], 423);
        }

        if(!\Hash::check($data['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password incorrect'
            ], 423);
        }

        $token = $user->createToken('authToken');

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'name' => $user->name,
                'email' => $user->email,
                'access_token' => $token->plainTextToken
            ]
        ]);
    }

    public function register(Request $request)
    {
        $data = \Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ])->validate();

        $user = (User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['email']),
            'verified' => true,
            'verified_at' => now(),
        ]))->fresh([]);

        $token = $user->createToken('authToken');

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data' => [
                'name' => $user->name,
                'email' => $user->email,
                'access_token' => $token->plainTextToken
            ]
        ]);
    }

    public function updateUserAccount(Request $request)
    {

        $user = $request->user();

        $data = \Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'required|string|min:6',
            'new_password' => 'nullable|string|min:6|confirmed',
            'authors' => 'array',
            'authors.*' => 'integer',
            'sources' => 'array',
            'sources.*' => 'integer',
            'categories' => 'array',
            'categories.*' => 'integer',
        ])->validate();

        if(!\Hash::check($data['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password incorrect'
            ], 423);
        }

        $updateData = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        if($data['new_password']) {
            $updateData['password'] = \Hash::make($data['password']);
        }

        $user->update($updateData);
        $user->pref_authors()->sync($data['authors']);
        $user->pref_sources()->sync($data['sources']);
        $user->pref_categories()->sync($data['categories']);

        return $this->getUserAccount($request);

    }

    public function getUserAccount(Request $request)
    {
        $user = $request->user()->load([
            'pref_authors',
            'pref_sources',
            'pref_categories',
        ]);

        return new UserResource($user);
    }
}
