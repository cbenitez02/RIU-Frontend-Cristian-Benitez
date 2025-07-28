# Docker Setup para RIU Frontend

Este proyecto incluye configuración completa de Docker para desarrollo y producción.

## 📋 Requisitos

- Docker Desktop instalado
- Docker Compose (incluido en Docker Desktop)

## 🚀 Uso Rápido

### Producción (Recomendado)

```bash
# Construir y ejecutar con Docker Compose
docker-compose up -d

# Acceder a la aplicación
# http://localhost:4200
```

### Desarrollo

```bash
# Ejecutar en modo desarrollo con hot reload
docker-compose --profile dev up -d

# Acceder a la aplicación
# http://localhost:4201
```

## 📁 Archivos de Docker

- `Dockerfile` - Imagen optimizada para producción (multi-stage build)
- `Dockerfile.dev` - Imagen para desarrollo con hot reload
- `docker-compose.yml` - Orquestación de servicios
- `nginx.conf` - Configuración de Nginx para SPA
- `.dockerignore` - Archivos excluidos del contexto de build
- `docker-utils.sh` - Script de utilidades (opcional)

## 🔧 Comandos Disponibles

### Docker Compose (Recomendado)

```bash
# Producción
docker-compose up -d          # Iniciar servicios
docker-compose down           # Parar servicios
docker-compose logs -f        # Ver logs en tiempo real

# Desarrollo
docker-compose --profile dev up -d    # Iniciar en modo desarrollo
docker-compose --profile dev down     # Parar servicios de desarrollo
```

### Docker Manual

```bash
# Construir imagen de producción
docker build -t riu-frontend:latest .

# Ejecutar contenedor de producción
docker run -d -p 4200:80 --name riu-frontend riu-frontend:latest

# Construir imagen de desarrollo
docker build -f Dockerfile.dev -t riu-frontend:dev .

# Ejecutar contenedor de desarrollo
docker run -d -p 4201:4200 -v "$(pwd):/app" -v /app/node_modules --name riu-frontend-dev riu-frontend:dev
```

### Script de Utilidades (Opcional)

```bash
# Hacer ejecutable el script
chmod +x docker-utils.sh

# Usar el script
./docker-utils.sh build-prod     # Construir producción
./docker-utils.sh run-prod       # Ejecutar producción
./docker-utils.sh build-dev      # Construir desarrollo
./docker-utils.sh run-dev        # Ejecutar desarrollo
./docker-utils.sh cleanup        # Limpiar contenedores
./docker-utils.sh logs           # Ver logs
./docker-utils.sh help           # Ver ayuda
```

## 🌐 Acceso a la Aplicación

- **Producción**: http://localhost:4200
- **Desarrollo**: http://localhost:4201

## 📊 Características

### Producción

- ✅ Multi-stage build para optimizar tamaño
- ✅ Nginx como servidor web
- ✅ Configuración SPA optimizada
- ✅ Compresión gzip habilitada
- ✅ Headers de seguridad configurados
- ✅ Cache optimizado para assets

### Desarrollo

- ✅ Hot reload activado
- ✅ Volúmenes para desarrollo en tiempo real
- ✅ Puerto separado para evitar conflictos
- ✅ Polling activado para sistemas de archivos lentos

## 🔍 Troubleshooting

### La aplicación no carga

```bash
# Verificar que el contenedor esté ejecutándose
docker ps

# Ver logs del contenedor
docker logs riu-frontend-app
```

### Cambios no se reflejan en desarrollo

```bash
# Verificar que los volúmenes estén montados correctamente
docker inspect riu-frontend-dev

# Reiniciar el contenedor
docker-compose --profile dev restart
```

### Limpiar todo y empezar de nuevo

```bash
# Parar y limpiar contenedores
docker-compose --profile dev down
docker system prune -f

# Reconstruir
docker-compose up -d --build
```

## 📝 Notas

- La configuración de Nginx está optimizada para aplicaciones SPA de Angular
- Los archivos estáticos tienen cache de 1 año para mejor rendimiento
- El modo desarrollo incluye polling para mejor compatibilidad con sistemas de archivos
- Los puertos por defecto son 4200 (prod) y 4201 (dev), pero se pueden cambiar en `docker-compose.yml`

## 🚀 Despliegue

Para desplegar en producción, simplemente:

1. Construir la imagen: `docker build -t riu-frontend:latest .`
2. Ejecutar el contenedor: `docker run -d -p 80:80 riu-frontend:latest`

O usar Docker Compose en el servidor:

```bash
docker-compose up -d
```
