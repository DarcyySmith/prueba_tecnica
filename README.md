# Credit Request App

Aplicación fullstack para gestión de solicitudes de crédito, construida con Spring Boot (backend) y Angular + Ionic (frontend).

## Requisitos

- Docker y Docker Compose instalados
- Acceso a una base de datos MySQL (AWS RDS o local)

## Configuración

1. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

2. Edita `.env` con tus credenciales de base de datos y JWT:

```env
DB_HOST=tu-host-rds.amazonaws.com
DB_PORT=3306
DB_NAME=Examen
DB_USER=tu_usuario
DB_PASS=tu_password
JWT_SECRET=tu_secreto_de_64_caracteres_hex
JWT_EXPIRATION=86400000
```

## Levantar con Docker

```bash
docker compose up --build
```

La aplicación queda disponible en:

| Servicio   | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:4200         |
| Backend    | http://localhost:8080         |
| Swagger UI | http://localhost:8080/swagger-ui.html |

## Credenciales por defecto

| Usuario | Contraseña |
|---------|-----------|
| admin   | admin123  |

## Endpoints principales

| Método | Ruta                                  | Descripción                  |
|--------|---------------------------------------|------------------------------|
| POST   | /api/v1/auth/login                    | Autenticación JWT            |
| POST   | /api/v1/credit-requests               | Crear solicitud              |
| GET    | /api/v1/credit-requests               | Listar (filtro + paginación) |
| GET    | /api/v1/credit-requests/{id}          | Detalle por ID               |
| PATCH  | /api/v1/credit-requests/{id}/status   | Aprobar o rechazar           |

## Reglas de negocio

- Monto: entre $500 y $50,000
- Plazo: entre 6 y 60 meses
- Solo solicitudes en estado **PENDING** pueden cambiar de estado
- El comentario es **obligatorio** al rechazar

## Stack tecnológico

**Backend:** Java 17 · Spring Boot 3 · Spring Security · JWT (jjwt 0.12) · JPA/Hibernate · MySQL

**Frontend:** Angular 17 · Ionic 8 · TypeScript · SCSS

**Infraestructura:** Docker multi-stage · Nginx · AWS RDS MySQL
