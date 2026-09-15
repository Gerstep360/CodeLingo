<?php
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
class AppServiceProvider extends ServiceProvider {
 public function register(): void {}
 public function boot(): void {
  RateLimiter::for('api-requests', fn ($request) => Limit::perMinute(120)->by('api:'.($request->user()?->id ?? $request->ip())));
  RateLimiter::for('account-access', fn ($request) => Limit::perMinute(6)->by('access:'.$request->ip().':'.mb_strtolower((string)$request->input('email'))));
  RateLimiter::for('registration', fn ($request) => Limit::perMinute(6)->by('register:'.$request->ip()));
 }
}
