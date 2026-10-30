---
artifact: brief
phase: 1
status: approved
reason: "Brief reconstruido desde el requerimiento entregado el 2026-09-01; las suposiciones no bloqueantes se validarán en las fases de MVP y alcance."
last_updated: "2026-09-01"
---

# 01 — Brief de E-block

## Identificación

- **Cliente:** Sebastian (administradora: Diana)
- **Modo:** client
- **Entrega:** production
- **Responsable del proyecto:** Sebastian
- **Decisor final:** Sebastian

## Problema

### ¿Qué ocurre hoy?

La administración del edificio no dispone de una operación única y verificable para gestionar residentes, habitaciones, cobros, reservas de espacios compartidos, incidentes y comunicaciones. La versión anterior no permitía siquiera un acceso local reproducible sin Docker.

### ¿Por qué importa?

Diana necesita controlar ocupación, recaudo, servicios y solicitudes sin depender de registros dispersos. Los residentes necesitan consultar y ejecutar sus trámites sin intermediación manual.

### ¿Cómo se resuelve actualmente?

[INFERENCE] Mediante coordinación manual, registros no centralizados y seguimiento directo de la administradora. La evidencia recibida no identifica una herramienta operativa actual.

### Costo observable

- Tiempo: seguimiento manual de pagos, reservas, incidentes y entregas.
- Dinero: cobros vencidos y servicios compartidos sin conciliación consistente.
- Errores: solapes de reservas, estados desactualizados y asignaciones incorrectas.
- Riesgo: exposición de datos personales, fotos y estados de pago sin controles homogéneos.
- Pérdida de confianza: residentes sin información o notificaciones oportunas.

## Usuarios

| Usuario | Objetivo | Frecuencia | Dispositivo | Nivel técnico |
|---|---|---:|---|---|
| Diana, administradora | Gestionar la operación del edificio y resolver excepciones | Diario | Computador y móvil | Intermedio |
| Residente | Consultar su estado y realizar reservas, pagos o reportes | Semanal o por necesidad | Móvil | Variable |

## Proceso actual

```text
Residente o administrador detecta una necesidad → coordinación manual → registro disperso o inexistente → seguimiento manual → cierre sin trazabilidad uniforme
```

## Dolor principal

La operación cotidiana carece de una fuente de verdad con permisos por rol, trazabilidad y reglas automáticas para pagos, reservas y notificaciones.

## Resultado esperado

Un monolito Python ejecutable sin Docker que entregue una API segura y una base local reproducible para operar E-block, empezando por acceso y lavandería y ampliando módulos mediante slices verificables.

## Acción principal del usuario

- **Diana:** consultar y actuar sobre el estado operativo del edificio.
- **Residente:** acceder a su cuenta y gestionar sus servicios y solicitudes autorizadas.

## Valor para administración

Centralizar estados, automatizar vencimientos y evitar conflictos operativos con permisos, historial y métricas confiables.

## Reglas del negocio conocidas

- Existen dos roles: `ADMINISTRADOR` (Diana) y `RESIDENTE`.
- El edificio tiene 4 pisos y 10 habitaciones por piso como topología inicial.
- Cada habitación puede estar ocupada o disponible; el arriendo de referencia es COP 320.000 y vence el día 5.
- Las reservas de lavandería son de una hora y no pueden solaparse.
- Las reservas de cocina duran como máximo dos horas y requieren 30 minutos de anticipación.
- Todo evento operativo relevante debe generar historial.
- La zona horaria operativa es `America/Bogota` y los montos son COP.

## Excepciones conocidas

- Credenciales inválidas o cuenta sin autorización.
- Habitación sin residente o residente sin habitación activa.
- Pago parcial, vencido o sin comprobante válido.
- Reserva solapada, máquina en mantenimiento o recurso no disponible.
- Foto de cocina pendiente, rechazada o no cargada.
- Reporte, visitante o paquete que se cierra o entrega fuera del flujo normal.

## Datos y archivos

- Datos personales: nombre, teléfono, avatar y asignación de habitación.
- Datos financieros: obligaciones, pagos, comprobantes e historial.
- Archivos: comprobantes y fotos operativas, con acceso por rol y retención por definir.
- Datos operativos: reservas, reportes, comunicados, visitantes, paquetes e inventario.

## Integraciones

- [DEFERRED:Fase 9] Proveedor de mensajería WhatsApp.
- [DEFERRED:Fase 9] Almacenamiento de archivos compatible con producción.
- [DEFERRED:Fase 9] Exportación PDF/Excel.

## Restricciones

- Presupuesto: por definir en Fase 3.
- Tiempo: por definir en Fase 3.
- Plataforma: backend Python; ejecución local sin Docker.
- Privacidad: autenticar, autorizar por rol y proteger PII, pagos y archivos.
- Operación: base de datos local reproducible para desarrollo; despliegue de producción por definir.
- Otras: no se conserva ni se amplía la versión anterior; quedó archivada en `Version malisima/`.

## Riesgos iniciales

- El requerimiento mezcla más de diez dominios y no debe entregarse como una sola implementación sin priorización.
- Las integraciones de WhatsApp y almacenamiento tienen costos, credenciales y políticas externas pendientes.
- Fotos, pagos y datos de visitantes exigen políticas de permisos, retención y auditoría.
- Reemplazar una UI existente por Python sólo procede si la arquitectura lo define explícitamente.

## Definición en cinco líneas

1. **Para quién:** Diana, administradora, y residentes de E-block.
2. **Problema:** La operación del edificio no cuenta con una fuente de verdad segura y trazable.
3. **Acción principal:** Gestionar y consultar servicios, reservas, cobros y solicitudes según rol.
4. **Valor administrativo:** Reducir coordinación manual, conflictos y cobros sin seguimiento.
5. **Resultado de negocio:** Operación controlada y medible desde una plataforma local reproducible en Python.

## Evidencia clasificada

- [FACT] El requerimiento suministrado define roles, módulos, reglas de pagos, reservas, seguridad y restricciones técnicas.
- [FACT] La versión anterior dependía de Next.js/Supabase y su semilla no creaba usuarios de autenticación locales.
- [FACT] El usuario pidió archivar la versión previa y reconstruir desde cero con Python sin Docker.
- [INFERENCE] La administración actual opera con coordinación y registros manuales o dispersos.
- [ASSUMPTION] Sebastian es el decisor final y Diana administra la operación diaria.

## Incertidumbres abiertas

- [ ] [DEFERRED:Fase 2] Priorizar el MVP entre los once módulos solicitados.
- [ ] [DEFERRED:Fase 3] Definir presupuesto, plazo, soporte y responsable de costos de proveedores.
- [ ] [DEFERRED:Fase 9] Definir proveedor de almacenamiento, mensajería y estrategia de despliegue.
- [ ] [DEFERRED:Fase 10] Definir retención de archivos, políticas de PII y autorización detallada.

## Gate

- [x] El problema está descrito sin usar “necesitamos una app” como explicación.
- [x] Existe usuario principal.
- [x] El proceso actual está documentado.
- [x] La acción principal está definida.
- [x] El valor administrativo está definido.
- [x] El resultado de negocio es verificable.
- [x] Las incertidumbres están clasificadas y no queda ningún `BLOCKING` abierto.
