---
artifact: domain-model
phase: 4
status: approved
reason: "Modelo conceptual construido desde el brief y el alcance del producto; no define tablas ni tecnología."
last_updated: "2026-09-01"
---

# 04 — Modelo de dominio de E-block

## Entidad principal

**Edificio** es el límite operativo: agrupa espacios, residentes, cobros, recursos compartidos y sus eventos. Las personas y ocupaciones cambian; el edificio, habitaciones y recursos persisten.

## Mapa conceptual

```text
EDIFICIO
├── Piso ── Habitación ── Ocupación ── Residente
├── Obligación ── Pago
├── Recurso compartido ── Reserva ── Cargo de servicio
├── Reporte de mantenimiento
├── Comunicado ── Notificación
├── Registro de visitante/paquete
├── Insumo
└── Evento operativo
```

## Entidades

### Edificio
- **Representa:** la unidad administrativa.
- **Persiste aunque:** cambien administradores, residentes u ocupaciones.
- **Relaciones:** contiene pisos, habitaciones, recursos, inventario y eventos.
- **Dueño:** Diana como administradora autorizada.
- **Estados:** activo/inactivo.
- **Historial requerido:** cambios administrativos relevantes.

### Usuario y perfil
- **Representa:** una persona autenticable con rol `ADMINISTRADOR` o `RESIDENTE`.
- **Persiste aunque:** cambie su habitación o deje el edificio.
- **Relaciones:** un residente puede tener una ocupación activa; Diana administra un edificio.
- **Estados:** invitado, activo, deshabilitado.
- **Historial requerido:** acceso, activación, recuperación y cambios de rol.

### Piso, habitación y ocupación
- **Representa:** la topología física y la asignación temporal de un residente.
- **Persiste aunque:** cambie el residente.
- **Relaciones:** un piso tiene habitaciones; una habitación tiene a lo sumo una ocupación activa; un residente tiene a lo sumo una ocupación activa.
- **Estados de habitación:** disponible, ocupada, inactiva.
- **Historial requerido:** asignaciones, desasignaciones y cambios de estado.

### Obligación y pago
- **Representa:** una deuda periódica o de servicio y su liquidación.
- **Relaciones:** pertenece a una habitación/ocupación y puede recibir pagos; puede originarse en arriendo o lavandería.
- **Estados:** pendiente, pagado, vencido, anulado.
- **Cierre:** un pago válido la liquida; una anulación exige razón y auditoría.
- **Historial requerido:** generación, vencimiento, pagos y ajustes.

### Recurso compartido y reserva
- **Representa:** un recurso reservable —máquina de lavandería o cocina— y un uso delimitado en el tiempo.
- **Relaciones:** un recurso tiene reservas; una reserva pertenece a un residente y puede generar cargo/checklist.
- **Estados del recurso:** disponible, ocupada, en_mantenimiento.
- **Estados de reserva:** solicitada, confirmada, en_curso, completada, cancelada.
- **Historial requerido:** creación, cancelación, pago, ocupación y liberación.

### Checklist y evidencia de cocina
- **Representa:** la verificación de entrega del espacio y su foto.
- **Relaciones:** pertenece a una reserva de cocina.
- **Estados de evidencia:** pendiente_de_revision, aprobada, rechazada.
- **Historial requerido:** respuesta de Diana y comentario de revisión.

### Reporte de mantenimiento
- **Representa:** un incidente identificado como `INC-XXXX`.
- **Relaciones:** lo crea un usuario y puede referir habitación, piso o zona.
- **Estados:** abierto, en_proceso, resuelto, cerrado.
- **Historial requerido:** cada transición, responsable y cierre.

### Comunicado, visitante/paquete e insumo
- **Comunicado:** mensaje de Diana para audiencia total, por piso o individual; se publica y genera notificaciones.
- **Visitante/paquete:** llegada destinada a una habitación; permanece pendiente hasta entrega.
- **Insumo:** recurso consumible con stock actual/máximo; genera alerta bajo 30%.

### Evento operativo
- **Representa:** el feed auditable unificado.
- **Persiste aunque:** la entidad de origen cambie de estado.
- **Atributos conceptuales:** tipo, descripción, actor, monto opcional, fecha y referencia a origen.

## Actores

| Actor | Responsabilidad | Entidades que controla |
|---|---|---|
| Diana | Administración y excepciones | Edificio, habitaciones, obligaciones, recursos, reportes, comunicados, visitantes, insumos |
| Residente | Uso autorizado y consulta propia | Perfil, reservas propias, pagos propios, reportes propios, checklist |
| Sistema | Reglas temporales y notificaciones | Vencimientos, solapes, ocupación temporal, alertas y eventos |

## Eventos del negocio

- Cuenta activada o acceso rechazado.
- Residente asignado/desasignado.
- Obligación generada, vencida, pagada o anulada.
- Recurso reservado, ocupado, liberado o puesto en mantenimiento.
- Checklist presentado y foto revisada.
- Reporte creado, actualizado o cerrado.
- Comunicado publicado; visitante/paquete recibido o entregado.
- Insumo bajo mínimo.

## Reglas

| ID | Regla | Ejemplo | Excepción |
|---|---|---|---|
| BR-001 | Sólo Diana administra el edificio y datos de otros residentes. | Diana asigna residente a 101. | Un residente sólo consulta/actúa sobre lo propio. |
| BR-002 | Una habitación y un residente sólo tienen una ocupación activa. | 101 no admite dos residentes activos. | Desasignar o cerrar la ocupación anterior. |
| BR-003 | Las reservas de lavandería duran una hora y no se solapan. | 10:00–11:00 impide otra reserva en ese intervalo. | Máquina distinta sí permite reserva. |
| BR-004 | Una reserva de cocina dura máximo dos horas y exige 30 min de anticipación. | 14:30 permite reservar desde 15:00. | Diana sólo puede cambiarlo mediante regla explícita. |
| BR-005 | El arriendo vence el día 5 y pasa a vencido después de esa fecha. | Obligación sin pago el día 6. | Anulación o ajuste auditado por Diana. |
| BR-006 | La evidencia de cocina exige foto antes de revisión. | Checklist completo sin foto no se presenta. | No existe excepción automática. |
| BR-007 | Todo hecho relevante genera evento inmutable. | Pago registrado crea evento financiero. | Correcciones generan evento nuevo, no borran el anterior. |

## Estados y transiciones

```text
Usuario: INVITADO → ACTIVO → DESHABILITADO
Ocupación: ACTIVA → FINALIZADA
Obligación: PENDIENTE → PAGADA | VENCIDA → PAGADA | ANULADA
Reserva: SOLICITADA → CONFIRMADA → EN_CURSO → COMPLETADA | CANCELADA
Reporte: ABIERTO → EN_PROCESO → RESUELTO → CERRADO
Evidencia: PENDIENTE_DE_REVISION → APROBADA | RECHAZADA
```

## Invariantes

- Ninguna acción se ejecuta fuera del edificio y del rol autorizados.
- El residente nunca ve ni modifica datos de otro residente.
- Los intervalos reservados para un mismo recurso no se intersectan.
- Los montos se almacenan como COP exactos, nunca como flotantes.
- Un evento histórico no se edita ni elimina; se compensa con otro evento.

## Casos límite

- Pago confirmado fuera de la fecha de vencimiento.
- Sesión expirada durante una acción sensible.
- Recurso pasa a mantenimiento después de una reserva futura.
- Residente se muda con obligaciones o reservas pendientes.
- Archivo de evidencia no disponible o rechazado.

## Términos del negocio

| Término | Significado exacto |
|---|---|
| Ocupación | Vínculo temporal activo entre residente y habitación. |
| Obligación | Deuda exigible de arriendo o servicio. |
| Reserva | Derecho temporal y exclusivo sobre un recurso compartido. |
| Evento | Registro auditable e inmutable de un hecho de negocio. |
| Diana | Administradora del edificio, rol `ADMINISTRADOR`. |

## Gate

- [x] La entidad persistente principal está identificada.
- [x] Cada entidad tiene ciclo de vida.
- [x] Las relaciones importantes están claras.
- [x] Estados y transiciones no se contradicen.
- [x] Las reglas críticas tienen ejemplo.
- [x] El historial necesario está definido.
- [x] Todavía no se confundió dominio con tablas.
