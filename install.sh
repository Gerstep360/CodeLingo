#!/usr/bin/env bash
# ==============================================================================
# CODELINGO - PANEL ORQUESTADOR PRINCIPAL (100% MODULAR & ASCII)
# ==============================================================================
# Asegurar ejecucion en bash (evita problemas si el usuario corre 'sh install.sh')
if [ -z "$BASH_VERSION" ]; then
    exec bash "$0" "$@"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/common.sh
source "$SCRIPT_DIR/scripts/common.sh"

# Dar permisos de ejecucion a todos los modulos
chmod +x "$SCRIPT_DIR"/scripts/deploy/*.sh 2>/dev/null || true

# ------------------------------------------------------------------------------
# CABECERA Y RESUMEN DE ESTADO
# ------------------------------------------------------------------------------
print_header() {
    clear
    detect_node_environment || true

    local node_status="[X] No detectado (Opcion 7 para instalar)"
    if [ "$NODE_VER" != "No detectado" ]; then
        node_status="[OK] ${NODE_VER} (npm ${NPM_VER})"
    fi

    local taji_status="[--] No verificado"
    if [ -d "/root/app/taji" ] || [ -d "$HOME/app/taji" ]; then
        taji_status="[OK] Angular (taji) intacto"
    fi

    local web_status="${G}[ACTIVO] Disponible en http://${SERVER_IP}/CodeLingo/${NC}"
    local st=0
    is_codelingo_active || st=$?
    if [ "$st" -eq 1 ]; then
        web_status="${R}[APAGADO] Modo Mantenimiento (Acceso bloqueado)${NC}"
    elif [ "$st" -eq 2 ]; then
        web_status="${Y}[PENDIENTE] Requiere primer despliegue (Opcion 1)${NC}"
    fi

    cat << "EOF"
        /\_/\
       ( o.o )  CODELINGO - PANEL DE GESTION Y DESPLIEGUE VPS
       (  -  )  Vargas Sprint | Backtracking & Simulador (React + Nginx)
       /  v  \  Arquitectura Multicontenedor / Convivencia con Angular
      ( |   | )
       (_)-(_)
EOF
    echo ""
    echo -e "${P}+--------------------------------------------------------------------------+${NC}"
    echo -e "${P}|${W}  [*] ESTADO GENERAL DEL SISTEMA VPS                                      ${P}|${NC}"
    echo -e "${P}+--------------------------------------------------------------------------+${NC}"
    printf "${P}|${NC}  ${W}Directorio App:${NC}      %-51s${P}|${NC}\n" "$SCRIPT_DIR"
    printf "${P}|${NC}  ${W}Coexistencia:${NC}        %-51s${P}|${NC}\n" "$taji_status"
    printf "${P}|${NC}  ${W}Estado Node.js:${NC}      %-51s${P}|${NC}\n" "$node_status"
    printf "${P}|${NC}  ${W}Estado CodeLingo:${NC}    %-60s${P}|${NC}\n" "$web_status"
    echo -e "${P}+--------------------------------------------------------------------------+${NC}"
    echo ""
}

print_menu() {
    echo -e "${B}+-- [MENU PRINCIPAL DE MODULOS] -------------------------------------------+${NC}"
    echo -e "${B}|${GRAY}  Cada opcion corresponde a un script modular e independiente:             ${B}|${NC}"
    echo -e "${B}+----+---------------------------------------------------------------------+${NC}"
    echo -e "${B}|${W}  1 ${B}|${NC}  [>]  ${G}Despliegue Completo${NC} (scripts/deploy/01_full_deploy.sh)        ${B}|${NC}"
    echo -e "${B}|${W}  2 ${B}|${NC}  [>]  ${CY}Actualizar desde Git${NC} (scripts/deploy/02_git_update.sh)       ${B}|${NC}"
    echo -e "${B}|${W}  3 ${B}|${NC}  [>]  ${B}Configurar Nginx${NC} (scripts/deploy/03_nginx_config.sh)         ${B}|${NC}"
    echo -e "${B}|${W}  4 ${B}|${NC}  [!]  ${R}APAGAR SERVIDOR / MANTENIMIENTO${NC} (scripts/deploy/04_turn_off.sh)  ${B}|${NC}"
    echo -e "${B}|${W}  5 ${B}|${NC}  [*]  ${G}ENCENDER SERVIDOR / ACTIVAR WEB${NC} (scripts/deploy/05_turn_on.sh)   ${B}|${NC}"
    echo -e "${B}|${W}  6 ${B}|${NC}  [?]  ${Y}Diagnostico Integral${NC} (scripts/deploy/06_diagnostics.sh)       ${B}|${NC}"
    echo -e "${B}|${W}  7 ${B}|${NC}  [+]  ${O}Instalar / Reparar Node.js${NC} (scripts/deploy/07_install_node.sh) ${B}|${NC}"
    echo -e "${B}|${W}  8 ${B}|${NC}  [X]  ${R}Limpiar Cache y Reset Total${NC} (scripts/deploy/08_clean_rebuild.sh)${B}|${NC}"
    echo -e "${B}|${W}  9 ${B}|${NC}  [#]  ${W}Ver Logs de Nginx en Vivo${NC} (scripts/deploy/09_nginx_logs.sh)    ${B}|${NC}"
    echo -e "${B}|${W}  0 ${B}|${NC}  [-]  ${GRAY}Salir del Administrador${NC}                                         ${B}|${NC}"
    echo -e "${B}+----+---------------------------------------------------------------------+${NC}"
    echo ""
}

# ------------------------------------------------------------------------------
# BUCLE PRINCIPAL
# ------------------------------------------------------------------------------
main() {
    # Soporte para despliegue no interactivo (--auto o --deploy)
    if [ "$1" == "--auto" ] || [ "$1" == "--deploy" ]; then
        bash "$SCRIPT_DIR/scripts/deploy/01_full_deploy.sh"
        exit 0
    fi

    while true; do
        print_header
        print_menu
        echo -ne "  ${P}-->${NC} ${W}Seleccione una opcion [0-9]:${NC} "
        read -r opt

        case "$opt" in
            1)
                bash "$SCRIPT_DIR/scripts/deploy/01_full_deploy.sh"
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            2)
                bash "$SCRIPT_DIR/scripts/deploy/02_git_update.sh"
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            3)
                bash "$SCRIPT_DIR/scripts/deploy/03_nginx_config.sh"
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            4)
                bash "$SCRIPT_DIR/scripts/deploy/04_turn_off.sh"
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            5)
                bash "$SCRIPT_DIR/scripts/deploy/05_turn_on.sh"
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            6)
                bash "$SCRIPT_DIR/scripts/deploy/06_diagnostics.sh"
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            7)
                bash "$SCRIPT_DIR/scripts/deploy/07_install_node.sh"
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            8)
                bash "$SCRIPT_DIR/scripts/deploy/08_clean_rebuild.sh"
                echo ""
                read -r -p "Presione Enter para continuar..." dummy
                ;;
            9)
                bash "$SCRIPT_DIR/scripts/deploy/09_nginx_logs.sh"
                ;;
            0)
                echo -e "\n${G}Sesion finalizada. CodeLingo listo para seguir practicando.${NC}\n"
                exit 0
                ;;
            *)
                echo -e "\n${R}Opcion no valida. Intente nuevamente.${NC}"
                sleep 1
                ;;
        esac
    done
}

main "$@"
