---
artifact: user-flows
phase: 5
status: approved
reason: "Flujos del MVP definidos para que el backend Python exponga contratos verificables antes de conectar la interfaz React existente."
last_updated: "2026-09-01"
---

# 05 — User flows de E-block

## Índice de flujos

| ID | Flujo | Actor | Prioridad | Estado |
|---|---|---|---|---|
| UF-001 | Inicio de sesión y acceso por rol | Diana / Residente | MUST | Approved |
| UF-002 | Consulta del dashboard administrativo | Diana | MUST | Approved |
| UF-003 | Consulta de disponibilidad y reserva de lavandería | Residente | MUST | Approved |
| UF-004 | Gestión operativa de reserva | Diana | MUST | Approved |

---

## UF-001 — Inicio de sesión y acceso por rol

### Actor
Diana o residente.

### Trigger
La persona abre la interfaz e ingresa sus credenciales.

### Precondiciones
- Cuenta activa.
- Contraseña válida.

### Happy path
1. Envía identificador y contraseña a la API.
2. La API valida las credenciales y emite sesión/tokens.
3. La API devuelve perfil, rol y edificio.
4. La interfaz lleva a Diana al dashboard y al residente a sus servicios.

### Decisiones
- Si el rol es `ADMINISTRADOR`, autorizar acciones de administración.
- Si el rol es `RESIDENTE`, limitar datos y acciones a su propia ocupación.

### Validaciones
- Identificador y contraseña obligatorios.
- Cuenta activa y contraseña verificada mediante hash.

### Persistencia
- Evento de inicio de sesión exitoso o rechazado.

### Permisos
- Sólo una sesión autenticada accede a recursos protegidos.

### Errores y recuperación

| Error | Mensaje | Recuperación |
|---|---|---|
| Credenciales inválidas | `Credenciales inválidas.` | Permitir nuevo intento sin revelar cuál campo falló. |
| Cuenta deshabilitada | `Tu cuenta no está disponible.` | Contactar a la administración. |
| Sesión expirada | `Tu sesión venció. Ingresa de nuevo.` | Redirigir a acceso. |

### Cancelación / timeout
No persiste cambios; el cliente puede volver a intentar.

### Notificaciones
No aplica fuera del registro de evento.

### Resultado y evidencia
Token válido y perfil limitado por rol; pruebas cubren acceso correcto, incorrecto y prohibido.

## UF-002 — Consulta del dashboard administrativo

### Actor
Diana.

### Trigger
Diana abre el inicio de la aplicación.

### Precondiciones
Sesión activa con rol `ADMINISTRADOR`.

### Happy path
1. La interfaz solicita resumen diario y estado por piso.
2. La API calcula pagos, lavandería, reportes y ocupación desde datos persistidos.
3. La interfaz muestra cifras, módulos y movimientos recientes.

### Validaciones
- Rango de fecha permitido.
- Edificio resuelto desde la sesión, no desde un identificador editable del cliente.

### Persistencia
No modifica datos; registra auditoría sólo si se solicita exportación en una slice futura.

### Permisos
Exclusivo de Diana.

### Errores y recuperación

| Error | Mensaje | Recuperación |
|---|---|---|
| No autorizado | `No tienes permiso para consultar este panel.` | Redirigir a la superficie permitida. |
| Sin datos aún | `Aún no hay actividad para este periodo.` | Mostrar estado vacío. |

### Cancelación / timeout
La interfaz conserva la última respuesta válida y ofrece reintentar.

### Notificaciones
No aplica.

### Resultado y evidencia
Dashboard devuelve sólo métricas del edificio de Diana.

## UF-003 — Consulta de disponibilidad y reserva de lavandería

### Actor
Residente.

### Trigger
El residente abre lavandería y elige máquina, fecha y hora.

### Precondiciones
- Sesión de residente activa.
- Ocupación activa.
- Máquina disponible y no en mantenimiento.

### Happy path
1. La interfaz consulta máquinas y franjas disponibles.
2. El residente selecciona una franja de una hora.
3. La API verifica rol, ocupación, recurso y no solape de forma atómica.
4. La API crea una reserva pendiente por COP 10.000 y un evento.
5. La interfaz confirma con fecha, hora, máquina y estado de pago.

### Decisiones
- Si hay una reserva que se intersecta, rechazar sin persistir.
- Si la máquina está en mantenimiento, rechazar.
- Si el pago se confirma en una slice posterior, cambiar el estado de la reserva según la regla de negocio.

### Validaciones
- Fecha/hora futura y exacta en `America/Bogota`.
- Duración fija de 60 minutos.
- Identidad del residente tomada de la sesión.

### Persistencia
Reserva, cargo de lavandería y evento operativo.

### Permisos
Sólo el residente autenticado crea o consulta sus propias reservas; Diana consulta las del edificio.

### Errores y recuperación

| Error | Mensaje | Recuperación |
|---|---|---|
| Franja ocupada | `Ese horario ya no está disponible.` | Recargar disponibilidad y elegir otra franja. |
| Recurso en mantenimiento | `La máquina está en mantenimiento.` | Elegir otra máquina u horario. |
| Sin ocupación activa | `No tienes una habitación activa asignada.` | Contactar a la administración. |
| Datos inválidos | `Revisa la fecha y el horario seleccionados.` | Corregir y reenviar. |

### Cancelación / timeout
Cancelar antes de confirmar no persiste. Ante timeout, la interfaz consulta historial antes de reintentar para evitar duplicados.

### Notificaciones
Confirmación visible; evento disponible para Diana.

### Resultado y evidencia
Una reserva exclusiva y auditable, sin solapes.

## UF-004 — Gestión operativa de reserva

### Actor
Diana.

### Trigger
Diana revisa lavandería o el dashboard.

### Precondiciones
Sesión de administradora activa.

### Happy path
1. Diana consulta reservas y estado de máquinas.
2. Marca una máquina en mantenimiento o restablece su disponibilidad.
3. La API valida rol y registra el cambio/evento.
4. Las futuras solicitudes de residentes reflejan el nuevo estado.

### Validaciones
- Estado permitido del recurso.
- Razón obligatoria al marcar mantenimiento.

### Persistencia
Cambio de estado de máquina y evento operativo.

### Permisos
Exclusivo de Diana.

### Errores y recuperación

| Error | Mensaje | Recuperación |
|---|---|---|
| Acción prohibida | `No tienes permiso para administrar máquinas.` | No modificar datos. |
| Estado inválido | `El estado solicitado no es válido.` | Mostrar estado actual y elegir opción válida. |

### Cancelación / timeout
No confirmar cambios incompletos; recargar estado tras timeout.

### Notificaciones
Residentes reciben el nuevo estado al consultar disponibilidad; tiempo real queda diferido.

### Resultado y evidencia
Diana puede impedir reservas futuras sobre recursos en mantenimiento.

## Gate

- [x] Todos los MUST tienen happy path.
- [x] Todos los MUST tienen errores y recuperación.
- [x] Cada acción sensible tiene actor y permiso.
- [x] Se sabe qué datos cambian.
- [x] Existen cancelación y duplicados cuando aplican.
- [x] Los mensajes de feedback están definidos.
