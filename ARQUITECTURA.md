# HausseUp — Arquitectura y estado del proyecto

> Documento de contexto para traspaso. Resume estructura, componentes, flujos y deuda técnica conocida.
> Generado el 2026-06-26. Rama `main`.

---

## 1. Qué es

**HausseUp** (paquetes internos llamados `parceros-backend` / `frontend`; el README aún dice "MigraWork") es una **plataforma de empleo para personas migrantes hispanohablantes en España**. Inspirada en LinkedIn / InfoJobs. El diferenciador es un **sistema de dos agentes de IA conversacionales** (Claude) que reemplazan el flujo clásico de búsqueda/publicación por chat:

- **Agente Compañero** → para candidatos (`role = worker`): onboarding conversacional, matching de empleos, candidaturas.
- **Agente de Selección / Recruiter** → para empleadores (`role = employer`): creación de ofertas en lenguaje natural, ranking de candidatos, agendar entrevistas.

El tipo de agente se **deriva del rol del JWT**, no se elige en el cliente.

Dominio en producción: `hausseup.com`. Backend desplegado (Railway, según docs): `hausseup-production.up.railway.app`. BD: PostgreSQL (Neon).

---

## 2. Stack tecnológico

### Backend (`/backend`)
- **Node 22 + TypeScript 5.4**, Express 5, arquitectura modular por feature (controller / service / routes).
- **PostgreSQL** vía `pg` (pool). DDL en `schema.postgres.sql` (raíz).
- **Auth**: JWT (`jsonwebtoken`) + **Google OAuth 2.0** (`passport-google-oauth20`), sesiones express-session solo durante el handshake OAuth.
- **IA**: `@anthropic-ai/sdk` v0.105. Modelo por defecto `claude-sonnet-4-6` (env `ANTHROPIC_MODEL`).
- Build: `tsc` → `dist/`. Dev: `nodemon + ts-node`. Arranque prod: `node dist/app.js`.
- Docker: `Dockerfile` en raíz (node:22-alpine, expone 3001).

### Frontend (`/frontend`)
- **React 19 + TypeScript + Vite 8**, React Router 7.
- **TailwindCSS 4** (`@tailwindcss/vite`).
- `lucide-react` para iconos.
- Estado de auth vía Context (`AuthContext`). Sin librería de estado global ni de data-fetching (fetch nativo).

---

## 3. Estructura de carpetas

```
HausseUp_Code/
├── Dockerfile                 # build del backend
├── README.md                  # desactualizado (dice "MigraWork")
├── schema.postgres.sql        # esquema completo de la BD (fuente de verdad del modelo)
├── querys.sql                 # queries de referencia / seeds
├── implementacion/            # COPIA original entregada de los agentes + INTEGRACION.md
│                              # (snapshot histórico; el código vivo está en backend/src/agent)
│
├── backend/
│   └── src/
│       ├── app.ts             # bootstrap Express, CORS, sesión, montaje de rutas, /health
│       ├── config/
│       │   ├── db.ts          # pool de pg (export default)
│       │   ├── env.ts         # carga y valida variables de entorno
│       │   └── passport.ts    # estrategia Google OAuth
│       ├── middlewares/
│       │   ├── auth.middleware.ts    # verifica JWT → req.userId, req.userRole (AuthRequest)
│       │   └── error.middleware.ts
│       ├── modules/                  # API REST clásica (no-IA)
│       │   ├── auth/                 # login, registro, Google OAuth
│       │   ├── users/
│       │   ├── jobs/                 # CRUD ofertas (usa sectors, cities)
│       │   ├── applications/
│       │   └── cities/
│       └── agent/                    # SISTEMA DE AGENTES IA (núcleo del producto)
│           ├── agent.service.ts      # loop de orquestación (Messages API + tool_use)
│           ├── agent.controller.ts   # POST /message y /confirm-action
│           ├── agent.routes.ts
│           ├── types.ts              # tipos compartidos del agente
│           ├── memory.repository.ts  # memoria persistente (agent_user_memory)
│           ├── prompts/
│           │   ├── companion.prompt.ts   # system prompt candidato
│           │   └── recruiter.prompt.ts   # system prompt empleador
│           └── tools/
│               ├── companion.tools.ts    # defs de tools (candidato)
│               ├── recruiter.tools.ts    # defs de tools (empleador)
│               ├── handlers.ts           # ejecución real de cada tool contra la BD
│               └── matchReason.ts        # genera frases de match con Claude
│
└── frontend/
    └── src/
        ├── App.tsx              # rutas (React Router)
        ├── main.tsx
        ├── context/AuthContext.tsx
        ├── services/api.ts      # cliente HTTP
        ├── data/locationData.ts # autocompletado de ciudades
        ├── components/common/   # Button, Input, Card, Header, Footer, Layout, modales...
        ├── pages/
        │   ├── LandingPage.tsx, PrivacyPolicy.tsx
        │   ├── auth/            # AuthChoice, Login, RegisterManual/Options, AuthCallback
        │   ├── selection/UserIntent.tsx
        │   ├── worker/WorkerSearch.tsx
        │   └── employer/EmployerDashboard.tsx, CreateJob.tsx
        ├── sections/LandingSections/   # Hero, HowItWorks
        ├── features/agent/             # UI del chat de agentes
        │   ├── useAgentChat.ts         # hook de estado del chat (el seleccionado en el IDE)
        │   ├── MessageBubble.tsx
        │   ├── JobCard.tsx, JobPostingCard.tsx, CandidateCard.tsx
        │   ├── ActionConfirmModal.tsx  # modal HITL
        │   ├── CompanionFeed.tsx       # pantalla /agente para workers
        │   ├── RecruiterFeed.tsx       # pantalla /agente para employers
        │   └── AgentDrawer.tsx
        └── types/agent.ts
```

---

## 4. Backend — API REST (módulos no-IA)

Montaje en `app.ts`, prefijo `/api`:

| Ruta base            | Módulo         | Responsabilidad |
|----------------------|----------------|-----------------|
| `/api/auth`          | auth           | registro manual, login JWT, Google OAuth (`/google`, `/google/callback`) |
| `/api/users`         | users          | perfil de usuario |
| `/api/jobs`          | jobs           | CRUD de ofertas (join con `sectors`, `cities`) |
| `/api/applications`  | applications   | candidaturas |
| `/api/cities`        | cities         | catálogo de ciudades (autocompletado) |
| `/api/agent`         | agent          | **chat de IA** (ver §5) — requiere JWT |
| `/health`            | —              | comprueba conexión a BD |

CORS restringido a `localhost:5173`, `hausseup.com`, `www.hausseup.com` con `credentials: true`.

---

## 5. Sistema de agentes IA (el corazón)

### 5.1 Endpoints (`agent.routes.ts`, todos con `authMiddleware`)
- `POST /api/agent/message` → `{ message, history[] }`. Devuelve `{ success, message, cards?, pendingAction? }`.
- `POST /api/agent/confirm-action` → `{ pendingActionId, confirmed }`. Resuelve el flujo HITL.

### 5.2 Loop de orquestación (`agent.service.ts → runAgentLoop`)
1. Carga en paralelo memoria del usuario (`agent_user_memory`) y `full_name`.
2. Construye el **system prompt** según `agentType` (companion/recruiter) inyectando memoria + nombre.
3. Arma `messages = [...history, { role: 'user', content }]`.
4. **Bucle hasta `MAX_ITERATIONS = 5`** llamando a `anthropic.messages.create` con `tools`:
   - `stop_reason === 'end_turn'` → toma el texto final y termina.
   - `stop_reason === 'tool_use'` → ejecuta **todas las tools en paralelo** (`executeTool`), recoge `pendingAction`, y acumula `cards` cuando el resultado trae `jobs` o `candidates`. Reinyecta `tool_result` y continúa.
5. Si agota iteraciones → mensaje de error genérico.
6. Devuelve `{ message, pendingAction?, cards? }`.

`max_tokens: 1024`. El historial se recibe del **frontend** en cada request (no se persiste el hilo en BD).

### 5.3 Human-in-the-loop (HITL)
Acciones críticas (`apply_to_job`, `accept_offer` para publicar, `reject_candidate`, etc.) **no se ejecutan directamente**. La tool crea un `PendingAction` con TTL de **10 min**, guardado en un **`Map` en memoria** (`pendingActionsMap` en `handlers.ts`) — explícitamente "reemplaza Redis para el MVP, sirve para un solo proceso". Un `setInterval` limpia expirados cada minuto. El frontend muestra `ActionConfirmModal` y llama a `/confirm-action`; `executeConfirmedAction` ejecuta la mutación real.

> ⚠️ El Map en memoria **no sobrevive a reinicios ni escala a múltiples instancias**. Migrar a Redis/BD antes de escalar horizontalmente.

### 5.4 Tools

**Compañero (`COMPANION_TOOLS`)** — 7 tools:
`buscar_empleos`, `obtener_perfil`, `actualizar_perfil` (escritura silenciosa durante onboarding), `aplicar_a_empleo` (HITL), `mis_candidaturas`, `guardar_empleo`, `log_audit_event`.

**Selección (`RECRUITER_TOOLS`)** — 6 tools:
`crear_oferta_empleo` (crea en `paused` + HITL para publicar), `recomendar_candidatos`, `programar_entrevista`, `listar_mis_ofertas`, `editar_oferta_empleo`, `log_audit_event`.

Cada tool se implementa en `handlers.ts → executeTool(switch)`. Las que devuelven `{ jobs }` o `{ candidates }` generan **tarjetas inline** en el chat.

### 5.5 Matching
`calculateSimpleMatchScore` — heurística sin embeddings: base 50, +25 ciudad, +15 sector, +10 compatibilidad de papeles (máx 100). `matchReason.ts` genera la frase explicativa con una llamada extra a Claude. Las tarjetas se **filtran si no tienen matchReason válido** (regla de negocio). El esquema ya prevé una tabla `embeddings` para matching semántico futuro (Fase 2/3, aún no implementado).

### 5.6 Memoria (`memory.repository.ts`)
- **Historial de conversación: NO se persiste** — las funciones `getRecentHistoryText` / `saveConversationTurn` son stubs que devuelven vacío. El hilo vive solo en el estado del frontend y se reenvía en cada request.
- **Memoria persistente**: tabla `agent_user_memory` (clave-valor por usuario). Se usa para datos de onboarding y como **almacén improvisado** de campos que no tienen columna en `jobs` (p. ej. salario → `job_<id>_salary`, paperwork → `job_<id>_paperwork`).

### 5.7 Cumplimiento / ética (EU AI Act)
Los prompts incluyen reglas **anti-discriminación**. La tool `log_audit_event` registra en `ai_audit_log` (envuelta en try/catch para no bloquear si la tabla no existe). El agente Compañero declara explícitamente lo que NO hace (asesoría legal/psicológica, garantías de empleo) y nunca juzga la situación migratoria.

---

## 6. Frontend — flujo del chat (`useAgentChat.ts`)

Hook central del chat. Detalles relevantes:
- Mantiene `messages` (texto o tarjeta), `isLoading`, `pendingAction`, `inputValue`. Usa `useRef` para evitar closures obsoletos.
- **Señales silenciosas** en el texto del mensaje que no se renderizan como burbuja: `__init__` (dispara el primer mensaje canónico del agente), `__silent__`, `__jobid:UUID__`.
- En cada envío reenvía el `history` completo (solo mensajes de texto) al backend.
- **Gestión de tarjetas**: si llega 1 card, reemplaza la existente por `id` (evita duplicados al editar); si llegan varias, reemplaza todas las del mismo `type` (evita acumulación entre batches).
- `confirmAction` llama a `/confirm-action` y muestra el resultado como mensaje del agente.

### Rutas (`App.tsx`)
Públicas: `/`, `/registro*`, `/login`, `/auth/callback`, `/privacidad`.
Protegidas (`ProtectedRoute`): `/busco-empleo`, `/dashboard-empleador`, `/publicar-empleo`, y **`/agente`** que renderiza `RecruiterFeed` si `usuario.rol === 'employer'`, si no `CompanionFeed`.
Modal de privacidad bloqueante hasta aceptar (`localStorage: hausseup_privacy_accepted`).

---

## 7. Modelo de datos (`schema.postgres.sql`)

PostgreSQL con muchos ENUMs. Tablas principales:

- **Identidad/catálogos**: `users` (PK UUID, role `worker|employer|both`, section `raices|semillas`), `countries`, `cities`, `sectors`, `skills`, `user_skills`, `user_documents` (NIE/TIE/passport/work_permit).
- **Empleo**: `jobs` (PK **UUID**, `employer_id`, `city_id`, `sector_id`, `contract_type`, `requires_nie`, `status active|paused|closed`), `services`, `applications` (PK **SERIAL**, `job_id` UUID, `worker_id` UUID, status `pending|viewed|contacted|rejected|hired`, UNIQUE(job_id, worker_id)), `saved_jobs`.
- **Social**: `connections`, `conversations`, `messages`, `posts`, `post_likes`, `post_comments`, `notifications`.
- **IA**: `agent_user_memory` (clave-valor por usuario), `embeddings` (entidad job/user/service — preparada, sin usar aún).
- **Admin**: `admin_users` (superadmin/moderator/support).

Concepto de producto "raíces / semillas" (`platform_section`) presente en el esquema pero no central en el código de agentes revisado.

---

## 8. Estado y deuda técnica (importante para el traspaso)

### ⚠️ Inconsistencias de tipos `jobId` (number vs UUID)
`jobs.id` y `users.id` son **UUID** en la BD, pero varias tools y los tipos TS declaran `jobId: number` (`companion.tools.ts`, `JobCardData.id: number`, `aplicar_a_empleo`, `guardar_empleo`). `recomendar_candidatos` valida el jobId contra un **regex de UUID** (síntoma de que el modelo a veces manda algo no-UUID y cae al "último job activo"). `editar_oferta_empleo` sí declara `jobId: string`. **Revisar y unificar a string/UUID** en tipos, tools y tarjetas.

### ⚠️ Campos de perfil inexistentes en `users`
`handleBuscarEmpleos` y `calculateSimpleMatchScore` leen `profile.sector`, `profile.migration_status`, `profile.experience_summary`, `profile.languages`, pero la tabla `users` **no tiene esas columnas** (solo `bio`, `is_available`, etc.). Esos datos viven en `agent_user_memory`, así que el match por sector/migración hoy **casi siempre falla** (queda en score base). El matching real depende de implementar lectura desde memoria o añadir columnas.

### ⚠️ Tablas referenciadas que pueden no existir en el esquema entregado
`user_consents`, `ai_audit_log`, `interviews` se usan en `handlers.ts`. Las dos primeras están envueltas en try/catch (degradan a "sin consentimiento" / no loguean). **`programar_entrevista` NO está protegida**: si la tabla `interviews` no existe, lanza error. Verificar/crear estas tablas.

### Otras notas
- **Historial del agente no persistido**: depende 100% del frontend; si el cliente pierde estado, el agente "olvida" la conversación (la memoria clave-valor sí persiste).
- **HITL en memoria de proceso** (Map): no apto para multi-instancia ni reinicios (§5.3).
- **README desactualizado** ("MigraWork"), nombre de paquete backend `parceros-backend` — el branding real es **HausseUp**.
- **`implementacion/`** es un snapshot de entrega anterior; el código vivo está en `backend/src/agent`. No editar `implementacion/` esperando efecto en runtime.
- `dist/` (build compilado) está versionado en el repo.
- Salario y "paperwork" de ofertas se guardan como pares clave-valor en `agent_user_memory` en lugar de columnas en `jobs` (workaround porque `jobs` no tiene esos campos).

### Trabajo reciente (git log)
Últimos commits centrados en pulir las **tarjetas del agente** (scroll horizontal de ofertas, evitar duplicados al editar, reemplazo por tipo/batch), `worker_id`/columnas en candidaturas, resolución de ciudad al crear oferta, y ocultar mensajes internos de resumen de contexto. El foco activo está en el **sistema de agentes**, no en la API REST clásica.

---

## 9. Variables de entorno

**Backend** (`backend/.env`): `DATABASE_URL` (req), `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` (def `claude-sonnet-4-6`), `JWT_SECRET`, `JWT_EXPIRES_IN` (def 7d), `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (req), `GOOGLE_CALLBACK_URL`, `FRONTEND_URL`, `PORT` (def 3001).

**Frontend**: `VITE_API_URL` (ej. `https://hausseup-production.up.railway.app/api`).

---

## 10. Cómo correr

```bash
# Backend
cd backend && npm install && npm run dev      # nodemon + ts-node en :3001

# Frontend
cd frontend && npm install && npm run dev      # vite en :5173

# Build prod backend
cd backend && npm run build && npm start
```

Requiere PostgreSQL accesible vía `DATABASE_URL` con el esquema de `schema.postgres.sql` aplicado.
