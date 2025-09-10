<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('auth', [\App\Http\Controllers\AuthController::class, 'login']);
Route::post('auth/register', [\App\Http\Controllers\AuthController::class, 'register']);

Route::get('sources', [\App\Http\Controllers\SourceController::class, 'index']);
Route::get('categories', [\App\Http\Controllers\CategoryController::class, 'index']);
Route::get('authors', [\App\Http\Controllers\AuthorController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('account', [\App\Http\Controllers\AuthController::class, 'getUserAccount']);
    Route::post('account', [\App\Http\Controllers\AuthController::class, 'updateUserAccount']);

    Route::get('articles/all', [\App\Http\Controllers\ArticleController::class, 'index']);
    Route::get('articles/feed', [\App\Http\Controllers\ArticleController::class, 'feed']);
    Route::get('article/{id}', [\App\Http\Controllers\ArticleController::class, 'show']);

});
