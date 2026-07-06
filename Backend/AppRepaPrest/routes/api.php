<?php

use App\Http\Controllers\login\UserApiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post("/example_route", [UserApiController::class, "example_route"]);
});

Route::post("/login", [UserApiController::class, "login"]);
Route::post("/register", [UserApiController::class, "register"]);