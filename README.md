# EVQL — Plataforma de Evaluación de Consultas SQL

Sistema backend para la gestión académica de cursos, evaluaciones y calificación automática de consultas SQL enviadas por estudiantes. Desarrollado con NestJS siguiendo los principios de Clean Architecture.

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Tecnologías](#tecnologías)
4. [Modelo de Datos](#modelo-de-datos)
5. [Módulos y Endpoints](#módulos-y-endpoints)
6. [Flujo de Evaluación](#flujo-de-evaluación)
7. [Autenticación y Roles](#autenticación-y-roles)
8. [Instalación y Ejecución](#instalación-y-ejecución)

---

## Descripción General

EVQL permite a profesores crear cursos, diseñar challenges SQL y agruparlos en evaluaciones con fecha, duración y límite de intentos. Los estudiantes envían sus consultas, que son ejecutadas en contenedores Docker aislados contra un esquema real de PostgreSQL. El resultado se compara con la solución esperada y se genera feedback automático mediante IA (GPT-4o-mini).

---

## Arquitectura

El proyecto sigue **Clean Architecture** con tres capas bien diferenciadas:

```
src/
├── domain/                  # Entidades y contratos (sin dependencias externas)
│   ├── entities/            # User, Course, Challenge, Submission, Evaluation...
│   └── repositories/        # Interfaces: ICourseRepository, ISubmissionRepository...
│
├── application/             # Casos de uso y DTOs (lógica de negocio pura)
│   ├── use-cases/
│   └── dtos/
│
└── infrastructure/          # Implementaciones concretas
    ├── controllers/          # Controladores HTTP (NestJS)
    ├── persistence/          # PrismaORM + repositorios concretos
    ├── auth/                 # JWT Strategy, Guards, Decorators
    ├── mappers/              # Domain ↔ Prisma model
    ├── modules/              # Módulos NestJS
    └── workers/              # Worker de evaluación asíncrona (BullMQ)
```

La capa de dominio no importa nada de NestJS ni Prisma. Los casos de uso dependen solo de interfaces (`ICourseRepository`, etc.), que son inyectadas por el módulo correspondiente.

---

## Tecnologías

| Tecnología | Rol |
|---|---|
| **NestJS** | Framework HTTP y sistema de módulos/DI |
| **Prisma ORM** | Acceso a base de datos y migraciones |
| **PostgreSQL** | Base de datos principal |
| **BullMQ + Redis** | Cola de trabajos para evaluación asíncrona |
| **Docker (Dockerode)** | Ejecución aislada de consultas SQL por submission |
| **OpenAI GPT-4o-mini** | Generación de feedback y análisis de consultas |
| **JWT + Passport** | Autenticación stateless |
| **Swagger** | Documentación automática de la API |

---

## Modelo de Datos

```
UserModel
  ├── taughtCourses  →  CourseModel[]         (profesor)
  └── enrolledCourses → CourseEnrollmentModel[] (estudiante)

CourseModel
  ├── professor     →  UserModel
  ├── students      →  CourseEnrollmentModel[]
  └── evaluations   →  EvaluationModel[]

EvaluationModel
  ├── course        →  CourseModel
  └── challenges    →  ChallengeModel[]

ChallengeModel
  └── schema        →  ChallengeSchemaModel   (DDL + seed + resultado esperado)

SubmissionModel
  (studentId, challengeId, query, status, score, executionTimeMs, feedback)
```

### Estados de una Submission

| Estado | Descripción |
|---|---|
| `QUEUED` | En cola, pendiente de procesamiento |
| `RUNNING` | El worker está ejecutando la consulta |
| `ACCEPTED` | Resultado correcto |
| `WRONG_ANSWER` | El resultado no coincide con el esperado |
| `SYNTAX_ERROR` | Error de sintaxis SQL |
| `RUNTIME_ERROR` | Error en tiempo de ejecución |
| `TIME_LIMIT_EXCEEDED` | La consulta superó el tiempo límite |
| `OPTIMIZATION_REQUIRED` | Consulta correcta pero ineficiente |

---

## Módulos y Endpoints

### Auth — `/auth`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/register` | Público | Registrar nuevo usuario |
| POST | `/auth/login` | Público | Iniciar sesión, retorna JWT |

### Courses — `/courses`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/courses` | Profesor, Admin | Crear curso |
| GET | `/courses` | Profesor, Admin | Listar todos los cursos |
| GET | `/courses/student/me` | Estudiante | Mis cursos matriculados |
| GET | `/courses/professor/me` | Profesor | Mis cursos como docente |
| GET | `/courses/:id` | Todos | Obtener curso por ID |
| GET | `/courses/:id/students` | Profesor, Admin | Estudiantes de un curso |
| PATCH | `/courses/:id` | Profesor, Admin | Actualizar curso |
| DELETE | `/courses/:id` | Admin | Eliminar curso |
| POST | `/courses/:id/students` | Profesor, Admin | Matricular estudiante |
| DELETE | `/courses/:id/students/:studentId` | Profesor, Admin | Desmatricular estudiante |

### Challenges — `/challenges`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/challenges` | Profesor, Admin | Crear challenge |
| GET | `/challenges` | Profesor, Admin | Listar todos |
| GET | `/challenges/me` | Estudiante | Retos publicados en mis cursos matriculados |
| GET | `/challenges/:id` | Todos | Obtener por ID |
| PATCH | `/challenges/:id` | Profesor, Admin | Actualizar |
| PATCH | `/challenges/:id/status` | Profesor, Admin | Cambiar estado |
| DELETE | `/challenges/:id` | Admin | Eliminar |

### Evaluations — `/evaluations`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/evaluations` | Profesor, Admin | Crear evaluación |
| GET | `/evaluations` | Profesor, Admin | Listar todas |
| GET | `/evaluations/me` | Estudiante | Mis evaluaciones activas |
| GET | `/evaluations/:id` | Todos | Obtener por ID |
| PATCH | `/evaluations/:id` | Profesor, Admin | Actualizar |
| DELETE | `/evaluations/:id` | Admin | Eliminar |
| POST | `/evaluations/:id/challenges` | Profesor, Admin | Asignar challenges |

### Submissions — `/submissions`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/submissions` | Estudiante | Enviar solución SQL |
| GET | `/submissions/me` | Estudiante | Mis submissions (con score, tiempo y feedback) |
| GET | `/submissions/evaluation/:evalId/challenge/:chalId` | Estudiante | Mis submissions de un challenge en una evaluación |
| GET | `/submissions/evaluation/:evalId/challenge/:chalId/all` | Profesor, Admin | Submissions de todos los estudiantes para un challenge en una evaluación |

### Challenge Schemas — `/challenge-schemas`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/challenge-schemas/upload` | Profesor, Admin | Subir DDL y seed |
| GET | `/challenge-schemas/:challengeId` | Profesor, Admin | Ver esquema de un challenge |

---

## Flujo de Evaluación

```
Estudiante
    │
    │  POST /submissions  { challengeId, engine, query }
    ▼
SubmitSolutionUseCase
    │  1. Guarda submission con status = QUEUED
    │  2. Encola job en BullMQ (sql-evaluation queue)
    ▼
SqlEvaluationWorker  (proceso asíncrono)
    │  1. Actualiza status → RUNNING
    │  2. Crea contenedor Docker con PostgreSQL 16 aislado
    │  3. Ejecuta DDL + seed del challenge
    │  4. Ejecuta la consulta del estudiante y mide tiempo
    │  5. Compara resultado con expectedResult del schema
    │  6. Determina status final (ACCEPTED / WRONG_ANSWER / SYNTAX_ERROR...)
    │  7. Llama a SqlAssistantService (GPT-4o-mini) para generar feedback
    │  8. Guarda score, executionTimeMs y feedback en la submission
    │  9. Destruye el contenedor
    ▼
Resultado disponible en GET /submissions/me
```

El contenedor Docker corre en la red interna `evql_default`, con límite de 512 MB de RAM y 0.5 CPUs. Se destruye automáticamente al finalizar (`AutoRemove: true`).

---

## Autenticación y Roles

La API usa **JWT Bearer Token**. Cada token incluye `userId`, `email` y `role`.

Los tres roles disponibles son:

- **`ADMIN`** — acceso total
- **`PROFESSOR`** — gestiona sus cursos, challenges y evaluaciones
- **`STUDENT`** — accede a sus cursos, envía submissions y consulta sus resultados

El guard `RolesGuard` valida el rol del token contra el decorador `@Roles(...)` de cada endpoint.

---

## Instalación y Ejecución

### Requisitos previos

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (necesario para ejecutar las submissions)

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Ejecutar migraciones de base de datos
npx prisma migrate deploy

# 4. Generar cliente de Prisma
npx prisma generate

# 5. Iniciar en modo desarrollo
npm run start:dev

# 6. Iniciar en modo producción
npm run build
npm run start:prod
```

La documentación Swagger estará disponible en `http://localhost:3000/api` una vez levantado el servidor.
