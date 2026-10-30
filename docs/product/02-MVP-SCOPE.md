---
artifact: mvp-scope
phase: 2
status: approved
reason: "MVP delimitado para entregar una operación verificable sin convertir once dominios en una sola entrega no comprobable. Los módulos restantes quedan planificados como slices posteriores, no descartados."
last_updated: "2026-09-01"
---

# 02 — MVP Scope de E-block

## Objetivo de V1

Entregar un backend Python sin Docker que permita iniciar sesión con datos demo, aplicar autorización por rol y completar una reserva de lavandería sin solapes, con trazabilidad básica para Diana y el residente.

## Flujo principal

```text
Residente inicia sesión → consulta disponibilidad → reserva una máquina por una hora → el sistema valida rol y solape → se registra la reserva y Diana puede auditarla
```

## Usuarios incluidos

- Diana, administradora: consulta la operación de lavandería y administra disponibilidad.
- Residente: inicia sesión, consulta máquinas y crea o consulta sus reservas.

## MUST

| Capacidad | Problema que resuelve | Evidencia de éxito |
|---|---|---|
| Autenticación Python con cuentas demo y roles | No se puede entrar ni distinguir responsabilidades | Diana y un residente ingresan con credenciales locales y reciben sólo sus capacidades autorizadas |
| Modelo de edificio, habitaciones y ocupación | No hay relación verificable entre residente y habitación | El residente demo queda asignado a una habitación activa |
| Máquinas y disponibilidad | No existe una fuente de verdad para lavandería | Se consulta disponibilidad por fecha y máquina |
| Reserva de una hora sin solapes | Evita conflictos operativos | Dos reservas incompatibles reciben error de validación; dos compatibles persisten |
| Estado de pago de lavandería | Permite controlar el cargo de COP 10.000 | La reserva registra monto COP y estado pendiente/pagado |
| Historial básico y resumen operativo | Diana no puede auditar acciones | La API devuelve reservas e ingresos básicos de lavandería |
| Validación, errores, paginación y pruebas críticas | La API no sería segura ni mantenible | Endpoints validan entradas y las pruebas cubren auth y solapes |

## SHOULD

- Registro manual de pago de lavandería por Diana.
- Dashboard agregado de operación inicial.
- Generación de datos demo: Diana, residentes, 40 habitaciones, máquinas y reservas de ejemplo.
- Documentación OpenAPI automática desde FastAPI.

## COULD

- Eventos en tiempo real para cambios de disponibilidad.
- Exportación local de resumen de lavandería.
- Avatar de perfil local.

## NOT NOW

- Arriendos mensuales y cobros de habitación.
- Cocina compartida y revisión de fotos.
- Mantenimiento, reportes, comunicados, visitantes, paquetes e inventario.
- Integraciones de WhatsApp, S3/Cloudinary, correos, push notifications y pasarelas externas.
- Exportación PDF/Excel de todos los módulos.
- Despliegue de producción.

## Exclusiones explícitas

- No se usará Docker ni Supabase en desarrollo local.
- No se construirá una UI completa antes de que el backend y su API estén verificados.
- No se implementarán los módulos `NOT NOW` dentro de la primera slice.

## Definición de éxito

| Métrica | Estado actual | Meta V1 | Cómo se mide |
|---|---:|---:|---|
| Inicio de sesión local reproducible | 0 cuentas utilizables | 2 roles demo funcionales | Prueba automatizada y ejecución local |
| Conflictos de reserva aceptados | Sin backend Python | 0 solapes persistidos | Pruebas de servicio y API |
| Operación de lavandería trazable | Sin fuente de verdad | 100% de reservas demo en historial | Consulta API |
| Dependencia de Docker local | Requerida por la versión anterior | 0 | Arranque con comando Python |

## Restricciones de V1

- Python como único runtime de backend.
- SQLite local para persistencia de desarrollo, sin Docker.
- Zona horaria `America/Bogota` y moneda COP.
- Secretos en variables de entorno, nunca en código ni en datos demo.
- Hash de contraseñas y autorización por rol desde la primera slice.

## Riesgos que pueden invalidar el MVP

- Intentar introducir los once módulos simultáneamente elimina la capacidad de verificar la primera entrega.
- Una decisión posterior de reemplazar también la UI puede ampliar esta slice; se tratará como cambio separado.
- Las integraciones externas requieren cuentas, costos y políticas que todavía no están aprobadas.

## Criterios generales de aceptación

- [x] El backend inicia con un único comando Python y sin Docker.
- [x] Existen credenciales demo documentadas sólo para desarrollo local.
- [x] Un residente autenticado no puede ejecutar acciones de Diana.
- [x] Una reserva solapada no se persiste.
- [x] La API expone documentación y errores HTTP en español.
- [x] Las pruebas críticas se ejecutan localmente.

## Gate

- [x] Existe un único flujo principal.
- [x] Cada MUST es indispensable.
- [x] Las exclusiones están escritas.
- [x] El éxito puede medirse.
- [x] El MVP no mezcla varios productos.
- [x] Los riesgos críticos tienen respuesta o bloqueo.
