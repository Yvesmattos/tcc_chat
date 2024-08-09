<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Controllers\TicketController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AtendimentoController;

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
Route::post('/tickets/{id}/close', [TicketController::class, 'close'])->name('tickets.close');

Route::get('/atendimento', [AtendimentoController::class, 'index'])->name('atendimento');


