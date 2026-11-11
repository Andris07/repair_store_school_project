<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        return response()->json([
            'placeholder' => true,
            'token' => 'placeholder-token',
            'user' => ['name' => 'Kiss Péter', 'email' => $credentials['email'], 'role' => 'customer'],
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        return response()->json([
            'placeholder' => true,
            'user' => ['name' => $data['name'], 'email' => $data['email'], 'role' => 'customer'],
        ], 201);
    }

    public function logout(): JsonResponse
    {
        return response()->json(['placeholder' => true, 'message' => 'Kijelentkezve.']);
    }
}

?>