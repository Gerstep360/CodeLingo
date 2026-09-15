<?php

namespace App\Http\Controllers;



use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

use Illuminate\Validation\ValidationException;



class ProgressController extends Controller

{

    private function payload($row): array {

        return ['revision' => $row?->revision ?? 0, 'values' => $row ? json_decode($row->payload) : (object) [], 'updatedAt' => $row?->updated_at];

    }

    public function show(Request $request) {
        abort_unless((string) $request->header('X-Account-ID') === (string) $request->user()->id, 403, 'La cuenta de esta pestaña cambió.');

        return response()->json($this->payload(DB::table('user_progress')->where('user_id', $request->user()->id)->first()))->header('Cache-Control', 'no-store');

    }

    public function update(Request $request) {

        abort_unless((string) $request->header('X-Account-ID') === (string) $request->user()->id, 403, 'La cuenta de esta pestaña cambió. Inicia sesión otra vez.');

        abort_if(strlen($request->getContent()) > 1100000, 413);

        $data = $request->validate(['revision' => ['required', 'integer', 'min:0'], 'values' => ['present', 'array', 'max:500']]);

        foreach ($data['values'] as $key => $value) {

            if (!preg_match('/^vargas_(duo_(completed|streak|xp|daily_xp|last_date|custom_snippets)|learning_v2|active_lesson|session_[a-zA-Z0-9_:\-]+|code_draft_[a-zA-Z0-9_:\-]+|editor_draft_[a-zA-Z0-9_:\-]+)$/D', $key) || !is_string($value) || strlen($key) > 240 || strlen($value) > 500000) {

                throw ValidationException::withMessages(['values' => 'Formato de progreso no vÃ¡lido.']);

            }

        }

        $encoded = json_encode((object) $data['values'], JSON_THROW_ON_ERROR);

        abort_if(strlen($encoded) > 1000000, 413);

        return DB::transaction(function () use ($request, $data, $encoded) {

            $userId = $request->user()->id;

            // Lock a row that always exists, including the first save.

            DB::table('users')->where('id', $userId)->lockForUpdate()->first();

            $row = DB::table('user_progress')->where('user_id', $userId)->first();

            if (($row?->revision ?? 0) !== $data['revision']) {

                return response()->json(['message' => 'Hay cambios guardados desde otro dispositivo.', ...$this->payload($row)], 409);

            }

            $revision = $data['revision'] + 1;

            DB::table('user_progress')->updateOrInsert(['user_id' => $userId], ['payload' => $encoded, 'revision' => $revision, 'updated_at' => now()]);

            return response()->json(['revision' => $revision, 'updatedAt' => now()->toISOString()]);

        });

    }

}

