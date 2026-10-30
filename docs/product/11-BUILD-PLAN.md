---
artifact: build-plan
phase: 11
status: approved
reason: ""
last_updated: "2026-09-01"
---
# 11 — Plan de construcción de E-block

## Estrategia
Construir una vertical slice real: residente ingresa por cédula, conserva sesión, ve su arriendo y accede a servicios. Luego se valida administración y reservas.

## Vertical Slice 0 propuesta
- **Nombre:** Acceso persistente y arriendo del residente.
- **Valor:** el residente conoce su estado y próximas acciones sin pedir ayuda.
- **Actor:** residente.
- **Flujo:** cédula + contraseña → sesión cookie → inicio → arriendo → medios informativos.
- **UI:** login, inicio residente, acciones rápidas y pago.
- **Servidor:** auth/me/logout y rent-status.
- **Datos:** users, sessions, activity y rent_status.
- **Permisos:** residente sólo ve su propio arriendo; administrador mantiene panel propio.
- **Errores:** 401, cédula inválida, sesión vencida y estado no disponible.
- **Evidencia:** build del frontend y prueba HTTP de login, cookie, me y rent-status.

## Backlog
| ID | Feature | Slice | Dependencias | Prioridad | Estado |
|---|---|---|---|---|---|
| F-001 | Acceso persistente por cédula | VS-0 | users/sessions | MUST | Ready |
| F-002 | Estado de arriendo y medios | VS-0 | auth | MUST | Ready |
| F-003 | Reserva de lavandería | VS-1 | auth/machines | MUST | Planned |
| F-004 | Administración de pagos y sedes | VS-2 | roles/rent | MUST | Planned |

## Feature F-001 — Acceso persistente por cédula
### Criterios de aceptación
- [x] El usuario puede iniciar con cédula y contraseña.
- [x] La sesión persiste con cookie HTTP-only y se restaura al abrir la app.
- [x] La API rechaza solicitudes sin sesión.
- [x] La interfaz se adapta a 360–430 px sin overflow.
- [x] El pago online se muestra como Próximamente y no intenta cobrar.

## Dependencias y secuencia
VS-0 → reservas → administración de pagos/sedes → integración de pagos real → observabilidad y despliegue Railway.

## Riesgos de implementación
SQLite sirve para la primera entrega local; para varias instancias en Railway se migrará a Postgres antes de operación multi-sede.

## Gate
- [x] Las tareas tienen alcance controlado.
- [x] Cada feature termina en valor verificable.
- [x] La Vertical Slice 0 prueba arquitectura real.
- [x] Los criterios son observables.
- [x] Las dependencias están ordenadas.
- [x] QA, deploy y handoff están incluidos.
