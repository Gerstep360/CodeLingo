<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    public function session(Request $request) {
        $user = $request->user()?->only('id', 'name', 'email', 'is_admin');
        return response()->json(['user' => $user, 'csrf' => csrf_token()])->header('Cache-Control', 'no-store');
    }

    public function register(Request $request) {
        $request->merge(['email' => mb_strtolower(trim((string) $request->input('email')))]);
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:80'],
            'email'    => ['required', 'email', 'max:254', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'max:128', Password::min(10)],
        ]);
        // El primer usuario registrado se convierte en admin automáticamente.
        $data['is_admin'] = User::count() === 0;
        $user = User::create($data);
        Auth::login($user);
        $request->session()->regenerate();
        return $this->session($request);
    }

    public function login(Request $request) {
        $data = $request->validate(['email' => ['required', 'email', 'max:254'], 'password' => ['required', 'string', 'max:128']]);
        $data['email'] = mb_strtolower(trim($data['email']));
        if (!Auth::attempt($data)) {
            throw ValidationException::withMessages(['email' => ['El correo o la contraseña no son correctos.']]);
        }
        $request->session()->regenerate();
        return $this->session($request);
    }

    public function logout(Request $request) {
        abort_unless((string) $request->header('X-Account-ID') === (string) $request->user()->id, 403, 'La cuenta de esta pestaña cambió.');
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Sesión cerrada.']);
    }
}
