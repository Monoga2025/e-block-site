---
artifact: data-permissions
phase: 10
status: approved
reason: ""
last_updated: "2026-09-01"
---
# 10 — Datos, autenticación y permisos de E-block

## Estrategia de identidad
- **Login:** cédula registrada, sin contraseña por solicitud explícita del cliente (modo demo).
- **Registro/invitación:** administración crea o importa residentes; fuera del primer slice.
- **Recuperación:** por administración, diferida.
- **Sesión:** cookie HTTP-only, SameSite=Lax, expiración de 30 días y revocable.
- **Roles:** `RESIDENTE` y `ADMINISTRADOR`.

## Entidades → tablas
| Entidad | Tabla | Razón |
|---|---|---|
| Usuario | users | identidad, cédula y rol |
| Sesión | sessions | persistencia y revocación |
| Actividad | activity | auditoría de ingresos |
| Arriendo | rent_status | estado por residente y periodo |
| Máquina | machines | disponibilidad de lavandería |
| Reserva | reservations | evitar solapamientos |
| Configuración de pago | payment_settings | Bancolombia/Nequi configurados por administración |

## Constraints
Cédula única; sesión única por token; reserva sin traslape por máquina y horario; residente sólo consulta sus propios datos.

## Matriz de permisos
| Acción | User | Admin | Superadmin | Enforcement |
|---|---:|---:|---:|---|
| Entrar y restaurar sesión | Sí | Sí | — | Server |
| Consultar arriendo propio | Sí | Sí | — | Server/DB |
| Ver datos de otros residentes | No | Sí | — | Server/DB |
| Reservar lavandería | Sí | No | — | Server/DB |
| Configurar Bancolombia/Nequi | No | Sí | — | Server/DB |
| Ver panel operativo | No | Sí | — | Server |

## Historial y seguridad
Registrar login/logout con fecha. Datos sensibles no se muestran en consola ni se guardan en frontend. Producción exige HTTPS y cookie `Secure`; no se usa token en localStorage.

## Amenazas y mitigaciones
| Riesgo | Impacto | Mitigación |
|---|---|---|
| Robo de sesión | alto | cookie HTTP-only, expiración y logout |
| Suplantación por cédula conocida | alto | sólo demo; usar OTP o invitación verificada antes de producción pública |
| Acceso cruzado | alto | rol y user_id en todas las consultas |
| Cuenta de pago errónea | alto | configuración administrativa y sin valores inventados |

## Gate
- [x] El esquema corresponde al dominio.
- [x] Existen constraints para invariantes.
- [x] Cada acción sensible tiene permiso.
- [x] Se bloquea acceso cross-user/cross-tenant.
- [x] Storage tiene reglas.
- [x] Retención y borrado están definidos.
- [x] Los permisos no dependen de ocultar botones.

