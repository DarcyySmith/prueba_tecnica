# Guion de presentación - Credit Request App

## 1. Elevator pitch (30 segundos)

> "Es una aplicación full-stack de gestión de solicitudes de crédito. El backend es una API REST segura construida con Spring Boot, JWT y Spring Security. El frontend es una SPA con Angular 17 standalone e Ionic. Permite autenticar administradores, crear solicitudes y aprobar o rechazar con comentarios."

---

## 2. Stack tecnológico (40 segundos)

### Backend
- Java 17
- Spring Boot 3
- Spring Security + JWT
- JPA / Hibernate
- MySQL (AWS RDS) / H2 para tests

### Frontend
- Angular 17 standalone components
- Ionic standalone components
- Reactive forms + RxJS
- Tailwind CSS configurado, estilos semánticos en SCSS

### Infraestructura
- Docker multi-stage para backend y frontend
- Nginx como proxy reverso
- Docker Compose

---

## 3. Arquitectura (40 segundos)

### Backend
```
controller/  → expone endpoints REST
service/     → lógica de negocio
repository/  → acceso a datos JPA
dto/         → modelos de entrada/salida
security/    → JWT, filtros, autenticación
exception/   → manejo global de errores
```

### Frontend
```
app/
├── core/          → servicios, guards, interceptors
├── features/      → login, list, form, detail
└── shared/        → componentes reutilizables
    ├── status-badge
    ├── loading-spinner
    ├── empty-state
    ├── error-alert
    ├── detail-grid
    └── request-actions
```

---

## 4. Flujo de negocio (40 segundos)

1. El administrador inicia sesión con credenciales por defecto.
2. Ve un listado paginado de solicitudes con filtro por estado.
3. Crea una solicitud con monto, plazo e identificación del solicitante.
4. Abre el detalle y aprueba o rechaza la solicitud.
5. El rechazo exige un comentario.
6. Estados: `PENDING`, `APPROVED`, `REJECTED`.

---

## 5. Demo paso a paso (2 minutos)

### Paso 1: Login
> "Me autentico con el usuario admin por defecto."

- Ingresar `admin` / `admin123`.
- El backend devuelve un JWT.
- El frontend lo almacena y usa un interceptor para adjuntarlo en cada request.

### Paso 2: Crear solicitud
> "Creo una solicitud de crédito con un monto dentro del rango permitido."

- Clic en **Nueva solicitud**.
- Monto: `$5000`, plazo: `12 meses`, applicant ID: `ABC12345`.
- Validaciones en frontend y backend.
- La solicitud aparece en estado **PENDIENTE**.

### Paso 3: Aprobar
> "Abro la solicitud recién creada y la apruebo."

- Clic en la tarjeta.
- Se muestra el detalle con el componente `app-detail-grid`.
- Clic en **Aprobar**.
- El estado cambia a **APROBADO** usando el componente `app-request-actions`.

---

## 6. Decisiones técnicas clave (1 minuto)

- **Angular standalone components**: reduce módulos, mejora tree-shaking.
- **Ionic standalone**: sin `IonicModule`, importando solo lo necesario.
- **Componentes compartidos**: evitan duplicación de UI y estilos.
- **DTOs + validaciones**: separan la API de la entidad de base de datos.
- **JWT stateless**: el backend no mantiene sesiones.
- **Nginx proxy**: unifica frontend y backend bajo un solo origen, evitando CORS.
- **API URL relativa**: `/api/v1` funciona en desarrollo y en Docker sin cambios.

---

## 7. Problemas resueltos (1 minuto)

### Problema 1: Tests fallaban tras agregar JWT
> "Cuando implementé Spring Security con JWT, los tests de `CreditRequestController` fallaban porque `@WebMvcTest` no cargaba la configuración de seguridad. Usé `@SpringBootTest` con `@AutoConfigureMockMvc` y `@WithMockUser`, ejecutando la seguridad real sobre H2 en memoria."

### Problema 2: Docker healthcheck fallaba
> "El contenedor del backend se marcaba como `unhealthy` porque el healthcheck usaba `curl` contra `/actuator/health`, pero `curl` no estaba en la imagen JRE y `/actuator/health` estaba protegido. Lo cambié a `wget` contra `/swagger-ui.html`, que es un endpoint público."

---

## 8. Preguntas esperadas y respuestas

### "¿Por qué Angular standalone y no módulos?"
Reduce el bundle, simplifica imports y mejora el tree-shaking. Es la recomendación oficial para Angular 17+.

### "¿Cómo manejás el estado de autenticación?"
Con un `AuthService` que guarda el token, un `HttpInterceptor` que lo adjunta, y un `AuthGuard` que protege rutas.

### "¿Cómo manejás CORS?"
En producción no hay CORS porque nginx hace proxy reverso. En desarrollo el backend permite `*`.

### "¿Qué validaciones tiene el negocio?"
Monto entre $500 y $50,000, plazo entre 6 y 60 meses, rechazo requiere comentario.

### "¿Cómo escalrías la app?"
- Backend: agregar caching, paginación con índices, separar lecturas/escrituras si crece.
- Frontend: extraer más componentes compartidos, usar Signals o NgRx para estado global.

---

## 9. Cierre (20 segundos)

> "El código está en GitHub con commits atómicos, README con instrucciones de ejecución local y con Docker, y todos los tests pasan. Si querés, puedo mostrar una demo en vivo."

---

## URLs de acceso

- Frontend: http://localhost:4200
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Credenciales: `admin` / `admin123`

## Comandos útiles

```bash
# Local
mvn spring-boot:run -pl backend
npm start --prefix frontend

# Docker
docker compose up -d
docker compose logs -f
docker compose down
```
