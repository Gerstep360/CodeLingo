<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
class StorageInfo extends Command {
 protected $signature = 'codelingo:storage {--field=driver : driver o path}';
 protected $description = 'Muestra el motor o la ruta SQLite sin revelar credenciales';
 public function handle(): int {
  $driver=config('database.default');
  if ($this->option('field') === 'driver') { $this->line($driver); return self::SUCCESS; }
  if ($driver !== 'sqlite') return self::FAILURE;
  $path=config('database.connections.sqlite.database');
  if (!$path || $path === ':memory:') return self::FAILURE;
  $this->line(realpath($path) ?: $path); return self::SUCCESS;
 }
}
