---
artifact: tech-architecture
phase: 9
status: approved
reason: ""
last_updated: "2026-09-01"
---
# 09 — Arquitectura técnica de E-block

## Objetivos técnicos
Login persistente por cédula, autorización por rol, consulta de arriendo y reservas sin Docker, con despliegue posterior en Railway.

## Restricciones
- Backend en un único archivo Python para la primera entrega.
- Sin Docker.
- Link de pago diferido; no procesar pagos ahora.
- La cuenta Bancolombia y Nequi deben ser configurables, nunca codificadas ni inventadas.

## Diagrama
```text
Residente/Admin → React (Vite) → FastAPI (app.py) → SQLite
                              ↘ cookie HTTP-only ↗
```

## Decisiones
| Área | Elección | Problema que resuelve | Alternativa | Razón | Riesgo |
|---|---|---|---|---|---|
| Frontend | React + TypeScript | UI móvil existente | HTML plano | Reutiliza la interfaz entregada | migración futura |
| Backend | FastAPI, un archivo | API sencilla sin Docker | Django | menor fricción inicial | modularizar al crecer |
| Database | SQLite | persistencia local inicial | Postgres | cero servicios adicionales | migrar para multiinstancia |
| Auth | sesión en cookie HTTP-only | persistencia y no exponer token a JS | localStorage | reduce robo por XSS | HTTPS obligatorio en producción |
| Hosting | Railway | publicación posterior | VPS | continuidad con el dominio/hosting actual | configurar variables y backups |

## Ambientes
| Ambiente | URL | Datos | Secretos | Propósito |
|---|---|---|---|---|
| Local | localhost | demo | `.env` no versionado | desarrollo |
| Production | Railway | cliente | variables Railway | operación |

## Observabilidad
Health endpoint, logs de acceso y tabla de actividad de autenticación. Backups de SQLite antes de cada despliegue; para multi-sede productiva migrar a Postgres administrado.

## Costos
Sin servicios nuevos en local. Railway y dominio quedan bajo acuerdo comercial del cliente.

## Gate
- [x] Existe diagrama.
- [x] Cada tecnología resuelve un problema.
- [x] Costos y límites están identificados.
- [x] Staging y producción están separados.
- [x] Backups, logs y secretos tienen plan.
- [x] No hay complejidad sin evidencia.
