#!/bin/bash

# Script de utilidades para Docker

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funciones de utilidad
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para construir la imagen de producción
build_prod() {
    log_info "Construyendo imagen de producción..."
    docker build -t riu-frontend:latest .
    log_info "Imagen de producción construida exitosamente"
}

# Función para construir la imagen de desarrollo
build_dev() {
    log_info "Construyendo imagen de desarrollo..."
    docker build -f Dockerfile.dev -t riu-frontend:dev .
    log_info "Imagen de desarrollo construida exitosamente"
}

# Función para ejecutar contenedor de producción
run_prod() {
    log_info "Ejecutando contenedor de producción..."
    docker run -d \
        --name riu-frontend-prod \
        -p 4200:80 \
        riu-frontend:latest
    log_info "Contenedor ejecutándose en http://localhost:4200"
}

# Función para ejecutar contenedor de desarrollo
run_dev() {
    log_info "Ejecutando contenedor de desarrollo..."
    docker run -d \
        --name riu-frontend-dev \
        -p 4201:4200 \
        -v "$(pwd):/app" \
        -v /app/node_modules \
        riu-frontend:dev
    log_info "Contenedor de desarrollo ejecutándose en http://localhost:4201"
}

# Función para parar y limpiar contenedores
cleanup() {
    log_info "Limpiando contenedores..."
    docker stop riu-frontend-prod riu-frontend-dev 2>/dev/null || true
    docker rm riu-frontend-prod riu-frontend-dev 2>/dev/null || true
    log_info "Limpieza completada"
}

# Función para mostrar logs
logs() {
    local container=${1:-riu-frontend-prod}
    log_info "Mostrando logs de $container..."
    docker logs -f "$container"
}

# Función para mostrar ayuda
show_help() {
    echo "Script de utilidades Docker para RIU Frontend"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  build-prod    Construir imagen de producción"
    echo "  build-dev     Construir imagen de desarrollo"
    echo "  run-prod      Ejecutar contenedor de producción"
    echo "  run-dev       Ejecutar contenedor de desarrollo"
    echo "  cleanup       Parar y limpiar contenedores"
    echo "  logs [name]   Mostrar logs de contenedor (default: riu-frontend-prod)"
    echo "  help          Mostrar esta ayuda"
    echo ""
    echo "Docker Compose:"
    echo "  up-prod       Ejecutar con docker-compose (producción)"
    echo "  up-dev        Ejecutar con docker-compose (desarrollo)"
    echo "  down          Parar servicios de docker-compose"
}

# Funciones para Docker Compose
compose_up_prod() {
    log_info "Iniciando servicios de producción con Docker Compose..."
    docker-compose up -d
    log_info "Servicios iniciados. Aplicación disponible en http://localhost:4200"
}

compose_up_dev() {
    log_info "Iniciando servicios de desarrollo con Docker Compose..."
    docker-compose --profile dev up -d
    log_info "Servicios iniciados. Aplicación disponible en http://localhost:4201"
}

compose_down() {
    log_info "Parando servicios de Docker Compose..."
    docker-compose --profile dev down
    log_info "Servicios parados"
}

# Main script
case "$1" in
    "build-prod")
        build_prod
        ;;
    "build-dev")
        build_dev
        ;;
    "run-prod")
        run_prod
        ;;
    "run-dev")
        run_dev
        ;;
    "cleanup")
        cleanup
        ;;
    "logs")
        logs "$2"
        ;;
    "up-prod")
        compose_up_prod
        ;;
    "up-dev")
        compose_up_dev
        ;;
    "down")
        compose_down
        ;;
    "help"|"")
        show_help
        ;;
    *)
        log_error "Comando desconocido: $1"
        show_help
        exit 1
        ;;
esac
