<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Panel de administración — solo accesible para usuarios con is_admin = true.
 * Cada acción llama a requireAdmin() para rechazar a usuarios normales con 403.
 */
class AdminController extends Controller
{
    private function requireAdmin(Request $request): void
    {
        abort_unless($request->user()?->is_admin, 403, 'Solo administradores.');
    }

    // -------------------------------------------------------------------------
    // Lista de usuarios
    // -------------------------------------------------------------------------
    public function users(Request $request)
    {
        $this->requireAdmin($request);
        $users = User::select('id', 'name', 'email', 'is_admin', 'created_at')
            ->orderBy('created_at')
            ->get()
            ->map(function ($u) {
                $progress = DB::table('user_progress')->where('user_id', $u->id)->first();
                $values   = $progress ? json_decode($progress->payload, true) : [];
                $nodes    = isset($values['vargas_duo_completed'])
                    ? count(json_decode($values['vargas_duo_completed'], true) ?? [])
                    : 0;
                return [
                    'id'         => $u->id,
                    'name'       => $u->name,
                    'email'      => $u->email,
                    'is_admin'   => $u->is_admin,
                    'created_at' => $u->created_at,
                    'nodes_done' => $nodes,
                    'revision'   => $progress->revision ?? 0,
                ];
            });

        return response()->json($users);
    }

    // -------------------------------------------------------------------------
    // Progreso de un usuario
    // -------------------------------------------------------------------------
    public function userProgress(Request $request, int $id)
    {
        $this->requireAdmin($request);
        abort_unless(User::where('id', $id)->exists(), 404);
        $row = DB::table('user_progress')->where('user_id', $id)->first();
        return response()->json([
            'revision'  => $row->revision ?? 0,
            'values'    => $row ? json_decode($row->payload) : (object) [],
            'updatedAt' => $row->updated_at ?? null,
        ])->header('Cache-Control', 'no-store');
    }

    // -------------------------------------------------------------------------
    // Sobreescribir el progreso de un usuario (sin verificación de revisión)
    // -------------------------------------------------------------------------
    public function setUserProgress(Request $request, int $id)
    {
        $this->requireAdmin($request);
        abort_unless(User::where('id', $id)->exists(), 404);

        $data    = $request->validate(['values' => ['present', 'array', 'max:500']]);
        $encoded = json_encode((object) $data['values'], JSON_THROW_ON_ERROR);

        DB::transaction(function () use ($id, $encoded) {
            DB::table('users')->where('id', $id)->lockForUpdate()->first();
            $row      = DB::table('user_progress')->where('user_id', $id)->first();
            $revision = ($row->revision ?? 0) + 1;
            DB::table('user_progress')->updateOrInsert(
                ['user_id' => $id],
                ['payload' => $encoded, 'revision' => $revision, 'updated_at' => now()]
            );
        });

        return response()->json(['message' => 'Progreso actualizado.']);
    }

    // -------------------------------------------------------------------------
    // Resetear el progreso de un usuario
    // -------------------------------------------------------------------------
    public function resetUserProgress(Request $request, int $id)
    {
        $this->requireAdmin($request);
        abort_unless(User::where('id', $id)->exists(), 404);
        DB::table('user_progress')->where('user_id', $id)->delete();
        return response()->json(['message' => 'Progreso eliminado.']);
    }

    // -------------------------------------------------------------------------
    // Actualizar nombre / rol admin de un usuario
    // -------------------------------------------------------------------------
    public function updateUser(Request $request, int $id)
    {
        $this->requireAdmin($request);
        $user = User::findOrFail($id);
        // Un admin no puede quitarse su propio rol de admin.
        $data = $request->validate([
            'name'     => ['sometimes', 'string', 'max:80'],
            'is_admin' => ['sometimes', 'boolean'],
        ]);
        if (isset($data['is_admin']) && !$data['is_admin'] && $user->id === $request->user()->id) {
            abort(422, 'No puedes quitarte el rol de admin a ti mismo.');
        }
        $user->update($data);
        return response()->json($user->only('id', 'name', 'email', 'is_admin'));
    }
}
