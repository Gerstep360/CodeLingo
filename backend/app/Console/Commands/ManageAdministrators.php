<?php
namespace App\Console\Commands;
use App\Models\User;
use Illuminate\Console\Command;
class ManageAdministrators extends Command {
    protected $signature = 'codelingo:admin {--email= : Correo de la cuenta a promover} {--list : Solo listar cuentas}';
    protected $description = 'Lista las cuentas y asigna el rol administrador sin Tinker';
    public function handle(): int {
        $users = User::orderBy('email')->get(['id','name','email','is_admin']);
        if ($users->isEmpty()) { $this->warn('Todavia no hay cuentas registradas.'); return self::SUCCESS; }
        $this->table(['ID','Nombre','Correo','Rol'], $users->map(fn ($u) => [$u->id,$u->name,$u->email,$u->is_admin?'Administrador':'Alumno'])->all());
        if ($this->option('list')) return self::SUCCESS;
        $email = $this->option('email');
        if (!$email && $this->input->isInteractive()) $email = $this->ask('Correo de la cuenta a promover (vacio para cancelar)');
        if (!$email) { $this->info('Sin cambios.'); return self::SUCCESS; }
        $user = $users->first(fn ($u) => mb_strtolower($u->email) === mb_strtolower(trim($email)));
        if (!$user) { $this->error('No se encontro ese correo. No se modifico ninguna cuenta.'); return self::FAILURE; }
        if ($user->is_admin) { $this->info($user->email.' ya es administrador.'); return self::SUCCESS; }
        $user->forceFill(['is_admin'=>true])->save();
        $this->info($user->email.' ahora es administrador.');
        return self::SUCCESS;
    }
}
