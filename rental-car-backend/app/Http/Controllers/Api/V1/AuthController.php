<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $customerRole = Role::where('role_name', 'customer')->first();

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role_id'  => $customerRole->id,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil',
            'data'    => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer'
        ], 201);
    }

    public function login(Request $request)
{
    $request->validate([
        'email' => 'nullable|email',
        'username' => 'nullable|string',
        'password' => 'required|string',
    ]);

    // Cari user berdasarkan input email atau username yang dikirim frontend
    $identifier = $request->email ?? $request->username;
    $user = \App\Models\User::where('email', $identifier)
                ->orWhere('name', $identifier)
                ->first();

    if (!$user || !\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return response()->json([
            'status' => 'error',
            'message' => 'Username atau password salah!'
        ], 401);
    }

    // Buat token sanctum
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'status' => 'success',
        'message' => 'Login berhasil',
        'data' => [
            'user' => $user,
            'token' => $token,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]
    ], 200);
}
    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout, token dicabut'
        ], 200);
    }
}