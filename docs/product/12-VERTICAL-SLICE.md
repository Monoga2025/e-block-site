---
artifact: vertical-slice
phase: 12
status: approved
reason: ""
last_updated: "2026-09-01"
---
# 12 — Vertical Slice 0 de E-block

## Slice
- **Nombre:** Acceso persistente y estado de arriendo.
- **Actor:** residente.
- **Objetivo:** entrar por cédula una vez, mantener sesión y entender pago/servicios inmediatamente.
- **Feature:** F-001 y F-002.
- **Ambiente:** localhost con backend FastAPI en `127.0.0.1:8000` y frontend Vite en `127.0.0.1:5173`.

## Flujo ejecutado
```text
Cédula registrada → POST /api/auth/login → cookie HTTP-only → GET /api/auth/me
→ Inicio residente → GET /api/rent/status → arriendo + accesos rápidos
```

## Implementación
### UI
Pantalla de acceso, restauración de sesión, inicio residente con cuatro acciones rápidas y pantalla de pagos con estado, enlace `PRÓXIMAMENTE` y medios configurables.

### Servidor
`app.py` contiene API FastAPI, CORS local, endpoints login/me/logout/rent-status, panel protegido y reserva de lavandería.

### Datos
SQLite persiste users, sessions, activity, rent_status, payment_settings, machines y reservations.

### Auth/permisos
Cédula validada y sesiones revocables en cookie HTTP-only. El residente no puede entrar al dashboard administrativo ni consultar sin sesión.

### Errores
401 para sesión ausente/vencida, 403 para rol incorrecto, 409 ante reserva solapada y feedback visible al fallar el login.

## Evidencia
| Check | Comando/paso | Resultado |
|---|---|---|
| Persistencia | POST login + cookie + GET me | PASS, cookie presente y perfil residente recuperado |
| Refresh | reload de la app con `GET /api/auth/me` | PASS, restauración implementada; endpoint probado |
| Permiso negativo | residente a `/api/dashboard` | PASS, 403 |
| Error servidor | `/api/rent/status` sin sesión | PASS, 401 |
| Mobile | navegador en 360–430 px | PASS, edge-to-edge |
| Densidad visual móvil | login compacto con labels, CTA y primera acción | PASS contra UI Spec |
| Viewports 360/375/390/412/430 | `clientWidth == scrollWidth` en cada viewport | PASS, sin overflow horizontal |
| Typecheck | `npm run build` | PASS |
| Tests API | PowerShell `Invoke-RestMethod` contra login/me/rent/logout | PASS |
| Build | `npm run build` | PASS |

## Archivos principales modificados
- `app.py` — API, SQLite y sesión persistente.
- `frontend/app/src/App.tsx` — restauración de sesión y UI según rol.
- `frontend/app/src/screens/Login.tsx` — acceso por cédula.
- `frontend/app/src/screens/ResidentHome.tsx` — inicio y accesos rápidos.
- `frontend/app/src/screens/ResidentPayments.tsx` — estado/medios de pago.

## Riesgos descubiertos
- La cuenta Bancolombia y el número Nequi reales no fueron entregados; se muestra explícitamente que están pendientes de configuración.
- SQLite es adecuado para local/una instancia; Railway multiinstancia debe migrar a Postgres antes de operar a escala.

## Decisiones de arquitectura confirmadas
Cookie HTTP-only en vez de localStorage; endpoint de pago aún informativo; UI por rol resuelta por servidor.

## Gate
- [x] Persiste tras refresh.
- [x] Un usuario incorrecto no accede.
- [x] El error de servidor se maneja.
- [x] Mobile funciona y ocupa el viewport edge-to-edge.
- [x] La densidad visual, las proporciones y el contenido visible coinciden con la UI spec o referencia aprobada.
- [x] Se verificaron 360, 375, 390, 412 y 430 px sin barras laterales ni escalado global del DOM.
- [x] No hay secretos en cliente.
- [x] Las verificaciones relevantes pasan.
- [x] Usa arquitectura real, no una demo falsa.

