# RIU Frontend

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) versión 19.0.2.

## 📋 Tabla de Contenidos

- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Desarrollo](#desarrollo)
- [Configuración de Docker](#configuración-de-docker)
- [Construcción](#construcción)
- [Pruebas](#pruebas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Recursos Adicionales](#recursos-adicionales)

## 🔧 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)
- **Angular CLI**: `npm install -g @angular/cli`
- **Docker Desktop** (opcional, para desarrollo en contenedores)

## 📥 Instalación

1. Clona el repositorio:

```bash
git clone <repository-url>
cd riu-frontend-test
```

2. Instala las dependencias:

```bash
npm install
```

## 🚀 Desarrollo

### Servidor de Desarrollo Local

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté ejecutándose, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques alguno de los archivos fuente.

### Scripts Disponibles

```bash
npm start          # Iniciar servidor de desarrollo
npm run build      # Construir para producción
npm test           # Ejecutar pruebas unitarias
npm run lint       # Analizar código con linter
npm run format     # Formatear código con Prettier
```

## 🐳 Configuración de Docker

Este proyecto incluye configuración completa de Docker para entornos de desarrollo y producción.

### Inicio Rápido con Docker

#### Producción (Recomendado)

```bash
# Usando Docker Compose
docker-compose up -d

# Acceder a la aplicación en http://localhost:4200
```

#### Desarrollo con Hot Reload

```bash
# Usando Docker Compose con perfil de desarrollo
docker-compose --profile dev up -d

# Acceder a la aplicación en http://localhost:4201
```

### Comandos de Docker

#### Comandos Manuales de Docker

```bash
# Construir imagen de producción
docker build -t riu-frontend:latest .

# Ejecutar contenedor de producción
docker run -d -p 4200:80 --name riu-frontend riu-frontend:latest

# Construir imagen de desarrollo
docker build -f Dockerfile.dev -t riu-frontend:dev .

# Ejecutar contenedor de desarrollo con hot reload
docker run -d -p 4201:4200 -v "$(pwd):/app" -v /app/node_modules --name riu-frontend-dev riu-frontend:dev
```

#### Usando Script de Utilidades

```bash
# Hacer el script ejecutable (Linux/Mac)
chmod +x docker-utils.sh

# Comandos disponibles
./docker-utils.sh build-prod     # Construir imagen de producción
./docker-utils.sh run-prod       # Ejecutar contenedor de producción
./docker-utils.sh build-dev      # Construir imagen de desarrollo
./docker-utils.sh run-dev        # Ejecutar contenedor de desarrollo
./docker-utils.sh cleanup        # Limpiar contenedores
./docker-utils.sh up-prod        # Docker Compose producción
./docker-utils.sh up-dev         # Docker Compose desarrollo
./docker-utils.sh down           # Detener servicios de Docker Compose
./docker-utils.sh logs [nombre]  # Ver logs del contenedor
./docker-utils.sh help           # Mostrar ayuda
```

### Características de Docker

- ✅ **Construcción multi-etapa** para imágenes optimizadas de producción
- ✅ **Hot reload** en modo desarrollo
- ✅ **Optimización de Nginx** para Angular SPA
- ✅ **Compresión gzip** habilitada
- ✅ **Headers de seguridad** configurados
- ✅ **Cache optimizado** para assets estáticos

Para documentación detallada de Docker, consulta [DOCKER.md](./DOCKER.md).

## 🔨 Generación de Código

Angular CLI incluye herramientas poderosas de generación de código. Para generar un nuevo componente, ejecuta:

```bash
ng generate component nombre-del-componente
```

Para una lista completa de esquemas disponibles (como `components`, `directives`, o `pipes`), ejecuta:

```bash
ng generate --help
```

## 🏗️ Construcción

Para construir el proyecto ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de construcción en el directorio `dist/`. Por defecto, la construcción de producción optimiza tu aplicación para rendimiento y velocidad.

## 🧪 Pruebas

### Ejecutar Pruebas Unitarias

Para ejecutar pruebas unitarias con el test runner [Karma](https://karma-runner.github.io), usa el siguiente comando:

```bash
ng test
```

### Pruebas con Docker

```bash
# Ejecutar pruebas en contenedor Docker
docker run --rm -v "$(pwd):/app" -w /app node:20-alpine npm test

# O usando el contenedor de desarrollo
docker-compose --profile dev exec riu-frontend-dev npm test
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Funcionalidad principal
│   │   ├── interceptors/        # Interceptores HTTP
│   │   ├── models/              # Modelos de datos
│   │   └── services/            # Servicios principales
│   ├── features/                # Módulos de características
│   │   └── heroes/              # Característica Heroes
│   │       ├── components/      # Componentes de la característica
│   │       ├── pages/           # Páginas de la característica
│   │       └── heroes.routes.ts # Enrutamiento de la característica
│   ├── shared/                  # Componentes y utilidades compartidas
│   │   ├── components/          # Componentes reutilizables
│   │   └── directives/          # Directivas personalizadas
│   ├── app.component.*          # Componente raíz
│   ├── app.config.ts            # Configuración de la aplicación
│   └── app.routes.ts            # Enrutamiento principal
├── index.html                   # Archivo HTML principal
├── main.ts                      # Punto de entrada de la aplicación
└── styles.css                   # Estilos globales
```

## 🔧 Características Principales

- **Angular 19** con componentes standalone
- **Angular Material** para componentes de UI
- **Programación reactiva basada en Signals**
- **Arquitectura modular** con módulos de características
- **Directivas personalizadas** (ej. directiva uppercase)
- **Interceptores HTTP** para estados de carga
- **Diseño responsivo** con Angular Material
- **Soporte para Docker** en desarrollo y producción

## 🌟 Tecnologías Utilizadas

- **Frontend**: Angular 19, TypeScript, Angular Material
- **Estilos**: CSS3, Angular Material Design
- **Gestión de Estado**: Angular Signals
- **Cliente HTTP**: Angular HTTP Client con RxJS
- **Pruebas**: Jasmine, Karma
- **Calidad de Código**: ESLint, Prettier
- **Contenedorización**: Docker, Docker Compose
- **Servidor Web**: Nginx (producción)
