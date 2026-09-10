#!/usr/bin/env python3
"""
CODELINGO - DIAGNOSTICO Y REPARACION QUIRURGICA DE NGINX
Inspecciona la configuración activa de Nginx en memoria (nginx -T),
encuentra el vhost que atiende el puerto 80 (y taji),
asegura que el snippet de CodeLingo esté activo y que no haya redirecciones agresivas.
"""

import os
import re
import subprocess
import sys

def run_cmd(cmd):
    p = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return p.returncode, p.stdout, p.stderr

def main():
    print("\n\033[38;5;39m=== [Diagnóstico y Reparación Quirúrgica de Nginx para CodeLingo] ===\033[0m\n")

    # 1. Asegurar snippet
    script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    snippet_src = os.path.join(script_dir, "nginx-codelingo.conf")
    snippet_dst = "/etc/nginx/snippets/codelingo.conf"

    os.makedirs("/etc/nginx/snippets", exist_ok=True)
    if os.path.exists(snippet_src):
        with open(snippet_src, "r") as sf:
            content = sf.read()
        with open(snippet_dst, "w") as df:
            df.write(content)
        print(f"  \033[38;5;82m[OK]\033[0m Snippet actualizado en {snippet_dst}")

    # Asegurar directorio web
    web_dir = "/var/www/CodeLingo/dist"
    os.makedirs(web_dir, exist_ok=True)
    index_path = os.path.join(web_dir, "index.html")
    if not os.path.exists(index_path):
        with open(index_path, "w") as f:
            f.write("<!DOCTYPE html><html><head><title>CodeLingo</title></head><body><h1>CodeLingo listo</h1></body></html>")

    run_cmd(f"chown -R www-data:www-data /var/www/CodeLingo 2>/dev/null || true")
    run_cmd(f"chmod -R 755 /var/www/CodeLingo")

    # 2. Ejecutar nginx -T para ver qué vhosts están activos
    rc, stdout, stderr = run_cmd("sudo nginx -T")
    if rc != 0 and not stdout:
        print(f"  \033[38;5;196m[FALLO]\033[0m Error ejecutando nginx -T: {stderr}")
        sys.exit(1)

    # Analizar bloques de archivo
    file_chunks = stdout.split("# configuration file ")
    active_conf_files = []

    for chunk in file_chunks[1:]:
        first_line = chunk.split("\n", 1)[0].strip().rstrip(":")
        if os.path.exists(first_line):
            active_conf_files.append((first_line, chunk))

    print(f"  • Archivos de configuración activos encontrados: {len(active_conf_files)}")
    for f, _ in active_conf_files:
        print(f"    - {f}")

    # Buscar el archivo que contiene 'taji' o el server default
    target_file = None
    target_has_server = False

    for f, chunk in active_conf_files:
        if "taji" in chunk.lower() and "server" in chunk:
            target_file = f
            target_has_server = True
            print(f"\n  \033[38;5;82m[DETECTADO]\033[0m Vhost de taji encontrado en: \033[1;37m{f}\033[0m")
            break

    if not target_file:
        for f, chunk in active_conf_files:
            if ("sites-enabled" in f or "conf.d" in f) and "server" in chunk:
                target_file = f
                target_has_server = True
                print(f"\n  \033[38;5;220m[AVISO]\033[0m Usando vhost activo: \033[1;37m{f}\033[0m")
                break

    if not target_file:
        print("  \033[38;5;196m[ERROR]\033[0m No se encontró ningún bloque server activo en Nginx.")
        sys.exit(1)

    # 3. Leer y modificar el archivo target
    with open(target_file, "r") as f:
        file_lines = f.readlines()

    # Verificar si ya tiene el include
    full_text = "".join(file_lines)
    modified = False

    # Check 1: ¿Tiene return 301 /taji/ a nivel de server (fuera de location)?
    # Si hay un return 301 fuera de location, rompe todas las subrutas. Lo convertimos a location = / o location /
    new_lines = []
    in_server = False
    in_location = 0

    for line in file_lines:
        trimmed = line.strip()
        if re.search(r"server\s*\{", trimmed):
            in_server = True
            new_lines.append(line)
            # Inyectar include de codelingo al inicio del bloque server
            if "codelingo.conf" not in full_text:
                new_lines.append("    # Subruta CodeLingo - Coexistencia pacifica con Angular taji\n")
                new_lines.append("    include /etc/nginx/snippets/codelingo.conf;\n")
                modified = True
            continue

        if re.search(r"location\s+.*\{", trimmed):
            in_location += 1
            new_lines.append(line)
            continue

        if "}" in trimmed:
            if in_location > 0:
                in_location -= 1
            elif in_server:
                in_server = False
            new_lines.append(line)
            continue

        # Si encontramos return 301 /taji/ directamente en server (fuera de location)
        if in_server and in_location == 0 and re.search(r"return\s+301\s+.*taji", trimmed):
            print(f"  \033[38;5;208m[CORRECCIÓN]\033[0m Encontrado return 301 global que atrapaba /CodeLingo/. Restringiendo a raíz /...")
            new_lines.append("    location = / {\n")
            new_lines.append(f"        {trimmed}\n")
            new_lines.append("    }\n")
            modified = True
            continue

        new_lines.append(line)

    if "codelingo.conf" not in full_text and not modified:
        # Si no se insertó antes, insertar después del primer server {
        final_lines = []
        inserted = False
        for line in new_lines:
            final_lines.append(line)
            if not inserted and "server" in line and "{" in line:
                final_lines.append("    # Subruta CodeLingo - Coexistencia pacifica con Angular taji\n")
                final_lines.append("    include /etc/nginx/snippets/codelingo.conf;\n")
                inserted = True
                modified = True
        new_lines = final_lines

    # Limpiar cualquier archivo de respaldo previo en sites-enabled o conf.d
    run_cmd("sudo rm -f /etc/nginx/sites-enabled/*.bak* /etc/nginx/conf.d/*.bak* /etc/nginx/sites-available/*.bak*")

    # Resolver enlace simbólico a la ruta real
    real_target_file = os.path.realpath(target_file)
    backup_file = os.path.join("/tmp", os.path.basename(real_target_file) + ".bak_codelingo")

    if modified:
        with open(backup_file, "w") as bf:
            bf.write(full_text)
        with open(real_target_file, "w") as out_f:
            out_f.writelines(new_lines)
        print(f"  \033[38;5;82m[OK]\033[0m Archivo {real_target_file} modificado con éxito (Backup seguro en {backup_file})")
    else:
        print(f"  \033[38;5;82m[OK]\033[0m El archivo {real_target_file} ya contiene la configuración de CodeLingo.")

    # 4. Probar configuración
    rc, stdout, stderr = run_cmd("sudo nginx -t")
    if rc != 0:
        print(f"  \033[38;5;196m[FALLO]\033[0m Sintaxis Nginx inválida:\n{stderr}")
        if os.path.exists(backup_file):
            run_cmd(f"sudo cp {backup_file} {real_target_file}")
            print("  Cambios revertidos al respaldo.")
        sys.exit(1)

    print("  \033[38;5;82m[OK]\033[0m Sintaxis de Nginx verificada exitosamente.")

    # 5. REINICIAR (restart) Nginx completamente
    print("  • Reiniciando servicio Nginx...")
    run_cmd("sudo systemctl restart nginx || sudo service nginx restart")

    # 6. Test HTTP local
    rc, stdout, stderr = run_cmd("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/CodeLingo/")
    code = stdout.strip()
    if code == "200":
        print(f"\n\033[38;5;82m+--------------------------------------------------------------------------+\033[0m")
        print(f"\033[38;5;82m|  [EXITO ROTUNDO] HTTP 200 OK — CodeLingo RESPONDIENDO EN PRODUCCION      |\033[0m")
        print(f"\033[38;5;82m+--------------------------------------------------------------------------+\033[0m")
        print(f"  URL CodeLingo: http://167.86.106.105/CodeLingo/")
        print(f"  URL taji:      http://167.86.106.105/taji/\n")
    else:
        print(f"\n  Código HTTP resultante: {code}")

if __name__ == "__main__":
    main()
