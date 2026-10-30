---
artifact: screen-inventory
phase: 6
status: approved
reason: ""
last_updated: "2026-09-01"
---
# 06 — Inventario de pantallas de E-block

## Navegación general
`Acceso por cédula → Inicio personal → Servicios / Pagos`; el administrador usa el mismo acceso y recibe el panel operativo según su rol. La sesión se conserva en una cookie segura durante 30 días.

## Pantallas
| ID | Pantalla | Usuario | Objetivo | Acción principal | Flujo |
|---|---|---|---|---|---|
| SC-001 | Acceso | Residente, administrador | Entrar con cédula y contraseña | Ingresar | UF-001 |
| SC-002 | Inicio residente | Residente | Ver arriendo y accesos rápidos | Consultar arriendo | UF-001 |
| SC-003 | Pago de arriendo | Residente | Ver estado y medios informativos | Ver instrucciones | UF-002 |
| SC-004 | Servicios | Residente | Acceder a cocina y lavandería | Abrir servicio | UF-003 |
| SC-005 | Lavandería | Residente | Reservar equipo disponible | Reservar turno | UF-003 |
| SC-006 | Panel administrador | Administración | Operar sedes, pagos y reportes | Revisar operación | UF-004 |

## Detalle por pantalla
### SC-001 — Acceso
- **Usuario:** residente o administrador.
- **Objetivo:** autenticar sin repetir el acceso cada visita.
- **Entrada:** cédula y contraseña.
- **Acción primaria:** Ingresar.
- **Estados:** validación local, cargando, credenciales inválidas y sesión restaurada.
- **Responsive:** edge-to-edge de 360 a 430 px; formulario compacto y controles de 44 px.
- **Accesibilidad:** labels, foco visible, errores asociados al campo.

### SC-002 — Inicio residente
- **Objetivo:** responder en segundos qué puede hacer y si el arriendo está pagado.
- **Acciones:** Ver arriendo, reservar lavandería, abrir cocina y ver pagos.
- **Estados:** pago pagado, pendiente, sin dato y error de consulta.

### SC-003 — Pago de arriendo
- **Objetivo:** informar el estado actual y los datos de Bancolombia o Nequi.
- **Regla:** no existe enlace de cobro aún; se rotula `Próximamente` y no se inventan números bancarios.

### SC-004 a SC-006
- Servicios exponen acciones permitidas por rol; administración conserva paneles de pagos, habitaciones y reportes.

## Componentes
| ID | Tipo | Propósito | Disparador |
|---|---|---|---|
| CMP-001 | Card de arriendo | Estado, valor y vencimiento | Inicio residente |
| CMP-002 | Acción rápida | Llevar a una tarea frecuente | Inicio residente |
| CMP-003 | Sesión | Cerrar sesión | Navegación |

## Copy funcional
- Labels: Cédula, Contraseña, Ingresar, Mi arriendo, Próximamente.
- Validaciones: Ingresá una cédula válida. Ingresá tu contraseña.
- Errores: No pudimos iniciar sesión. Revisá tus datos e intentá de nuevo.

## Gate
- [x] Cada flujo tiene superficies suficientes.
- [x] No hay pantallas sin objetivo.
- [x] Cada pantalla tiene acción principal.
- [x] Loading, empty, error y success están definidos.
- [x] Navegación funciona para el dispositivo principal.
- [x] El inventario incluye administración.
