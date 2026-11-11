<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlaceholderController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn() => ['ok' => true, 'time' => (new DateTime())->format(DateTime::ATOM)]);

// Authentication (frontend utils/auth.mjs will call these)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

// Customer
Route::get('/dashboard', PlaceholderController::class)->defaults('page', 'dashboard');
Route::get('/vehicles', PlaceholderController::class)->defaults('page', 'vehicles');
Route::get('/appointments', PlaceholderController::class)->defaults('page', 'appointments');
Route::get('/services', PlaceholderController::class)->defaults('page', 'services');
Route::get('/profile', PlaceholderController::class)->defaults('page', 'profile');
Route::post('/booking', PlaceholderController::class)->defaults('page', 'booking');

// Admin
Route::prefix('admin')->group(function ()
{
    Route::get('/dashboard', PlaceholderController::class)->defaults('page', 'admin.dashboard');
    Route::get('/appointments', PlaceholderController::class)->defaults('page', 'admin.appointments');
    Route::get('/repairs', PlaceholderController::class)->defaults('page', 'admin.repairs');
    Route::get('/users', PlaceholderController::class)->defaults('page', 'admin.users');
    Route::get('/services', PlaceholderController::class)->defaults('page', 'admin.services');
});

// Worker
Route::prefix('worker')->group(function ()
{
    Route::get('/jobs', PlaceholderController::class)->defaults('page', 'worker.jobs');
    Route::get('/repairs', PlaceholderController::class)->defaults('page', 'worker.repairs');
});

?>