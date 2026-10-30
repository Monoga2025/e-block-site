---
artifact: delivery-board
phase: 13
status: draft
reason: ""
last_updated: "2026-09-20"
---
# 13 — Delivery Board de E-block

## Estado general
- **Slice activa:** F-003 — reservas de lavado + secado.
- **Bloqueador:** [BLOCKING] F-004 no tiene un alcance contractual coherente: el board exige convertir arriendos, habitaciones, administración y cocina a datos reales, pero el MVP aprobado deja arriendos/cocina en `NOT NOW` y el alcance comercial excluye módulos posteriores sin slice y criterio de aceptación acordados.
- **Última evidencia:** build frontend, API de disponibilidad, reserva, prevención de solapamiento, marcado administrativo de pago y preview Railway público.
- **Preview Railway:** `https://eblock-production.up.railway.app` — health 200, UI, logo y assets verificados.
- **Próxima feature:** F-004 — reemplazar paneles administrativos estáticos por datos reales.

## Board
| ID | Feature | Prioridad | Estado | Evidencia | Riesgo |
|---|---|---|---|---|---|
| F-001 | Acceso por cédula y sesión | MUST | done | login residente/admin y cookie | acceso por cédula es sólo demo |
| F-002 | Arriendo y medios informativos | MUST | done | rent-status y UI residente | faltan datos de pago |
| F-003 | Reserva de lavado + secado | MUST | done | bundle 90 min, recursos atómicos, conflicto 409, cobro administrativo | tarifa fija demo |
| F-004 | Administración operativa real | MUST | active (blocked) | preflight de alcance 2026-09-20 | alcance contradice MVP/comercial aprobado |

## Preflight F-004 — 2026-09-20

- **Tarjeta activa:** F-004; no se abrió otra feature.
- **Dependencias técnicas:** F-001/F-003 están implementadas y existen endpoints autenticados de dashboard y lavandería.
- **Evidencia de implementación pendiente:** `Admin.tsx`, `Home.tsx`, `Pagos.tsx` y `Cuartos.tsx` conservan cifras o estados estáticos; no se modificó código en este preflight.
- **Contradicción Type 1:** `02-MVP-SCOPE.md` incluye como MUST el historial/resumen operativo de lavandería, pero declara arriendos mensuales y cocina compartida como `NOT NOW`. `03-COMMERCIAL-SCOPE.md` excluye módulos posteriores sin slice y criterio de aceptación acordados. Este board, en cambio, define F-004 como llevar pagos de arriendo, habitaciones, administración y cocina a datos reales.
- [ ] [BLOCKING] El responsable debe fijar si F-004 se limita al resumen operativo de lavandería ya aprobado o si aprueba formalmente la ampliación contractual a arriendos, habitaciones y cocina con criterios observables.
- **Regla de ejecución:** no implementar F-004 hasta resolver esa decisión de alcance/contrato.

## Auditoría lógica por módulo
| Módulo | Correcto | Corregido ahora | Pendiente |
|---|---|---|---|
| Acceso | sesión persistente y rol servidor | cédula sola por instrucción | OTP/invitación antes de producción pública |
| Inicio residente | arriendo y accesos rápidos | separado de administración | datos reales de habitación/sede |
| Lavandería | máquinas, reserva e historial son pertinentes | días de la semana + hora; sin selector de estado de pago; efectivo/link próximos; admin confirma cobro | tarifa y medios configurables |
| Pagos residente | el usuario consulta, no marca estado | link como Próximamente | datos Bancolombia/Nequi reales |
| Cocina | checklist e historial tienen sentido | — | reserva real, habitación desde perfil y carga de foto |
| Pagos admin | administración puede gestionar pagos | endpoint para marcar pago de lavandería | tabla de arriendos y acciones reales |
| Cuartos/Admin/Home | objetivos administrativos válidos | permisos de rol ya separan acceso | sustituir métricas/botones estáticos por API y persistencia |

## Registro de entrega
### F-003 — Reserva coherente de lavandería
- **Objetivo:** que un residente escoja máquina, día de la semana y hora en pocos toques.
- **Archivos:** `app.py`, `frontend/app/src/screens/Lavanderia.tsx`, `frontend/app/src/App.tsx`.
- **Criterios:** selección de 7 días, franjas 08:00–20:00, no mes/año, bloqueo de choques, pago bajo control administrativo.
- **Checks:** build PASS; availability PASS (3 máquinas/13 slots); colisión PASS (409); marcado admin PASS.
- **Decisiones:** sólo la administración ve ingresos y puede marcar `PAGADO`; residente nunca elige su estado de pago.

## MUST pendientes
- F-004: llevar pagos de arriendo, habitaciones, administración y cocina de maquetas a datos reales.

## Deuda aceptada
- Cédula sola es una decisión demo solicitada; no habilitar como acceso público final.
- SQLite se migra a Postgres con volumen/backups antes de múltiples instancias Railway o datos reales de clientes.

## Gate
- [ ] [BLOCKING] F-004 tiene alcance y criterios de aceptación coherentes con el MVP y el alcance comercial aprobados.
- [ ] Todos los MUST están `done`.
- [x] No hay más de una feature activa.
- [x] Cada feature tiene evidencia.
- [x] No quedan bloqueadores técnicos.
- [x] Deuda y TODOs están visibles.
- [x] El producto coincide con los artefactos aprobados.

### F-003 — Bundle de lavado + secado (2026-09-02)
- **Objetivo:** una reserva única de 90 minutos que asigne lavadora y secadora, sin que el residente administre equipos ni pagos.
- **Archivos:** `app.py`, `frontend/app/src/screens/Lavanderia.tsx`, `scripts/test_laundry_bundle.py`, `docs/product/13-DELIVERY-BOARD.md`, `docs/product/CHANGE_REQUESTS.md`.
- **Criterios:** API recibe sólo `starts_at`; servidor calcula fin/valor y persiste ambos recursos; una secadora compartida limita a un bundle concurrente; 08:00–09:30, 11:00–12:30 y 14:00–15:30 demo; Diana revisa y marca sólo reservas pendientes como pagadas.
- **Checks:** `test_laundry_bundle.py` PASS (90 min, conflictos 409, residente 403, transición admin PAGADO); `py_compile` PASS; frontend build PASS; lint focal PASS.
- **Decisiones:** reservas anteriores se conservan como historial legado y siguen bloqueando disponibilidad; las nuevas siempre se presentan como `Lavado + secado`.

### F-003 — Refinamiento visual y ocupación visible (2026-09-02)
- **Objetivo:** eliminar el acabado naranja-café, recuperar texto UTF-8 e informar disponibilidad de lavandería antes de reservar.
- **Archivos:** `frontend/app/src/index.css`, `components/chrome.tsx`, `screens/Home.tsx`, `screens/Lavanderia.tsx`, `app.py`, `scripts/verify_ui_sources.py`.
- **Criterios:** canvas ciruela-carbón con acento `#D8471A`; superficies distinguibles; campana/volver blancos por `currentColor`; franjas ocupadas visibles y no reservables; datos demo sembrados idempotentemente; sin selectores CSS por subcadena.
- **Checks:** build PASS; lint de archivos modificados PASS; `verify_ui_sources.py` PASS; API: 3 máquinas, 3 horarios ocupados y choque 409 PASS.
