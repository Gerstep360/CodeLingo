<?php
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ProgressController;
use Illuminate\Support\Facades\Route;

// JSON-only endpoints with Laravel's session and CSRF middleware.
Route::prefix('api')->middleware('throttle:api-requests')->group(function () {
    Route::get('session', [AccountController::class, 'session']);
    Route::post('register', [AccountController::class, 'register'])->middleware('throttle:registration');
    Route::post('login', [AccountController::class, 'login'])->middleware('throttle:account-access');
    Route::middleware('auth')->group(function () {
        Route::post('logout', [AccountController::class, 'logout']);
        Route::get('progress', [ProgressController::class, 'show']);
        Route::put('progress', [ProgressController::class, 'update']);
    });
});
