# Change Requests de E-block

## CR-001 — Acceso demo solamente con cédula

- **Fecha:** 2026-09-01
- **Solicitante:** Sebastian
- **Clasificación:** Arquitectura / UX
- **Estado:** Applied

### Solicitud
Eliminar la contraseña: una cédula registrada ingresa directamente. Cédula demo residente `1034657945`; administración `1034657946`.

### Razón
Reducir fricción para que residentes accedan rápido desde el teléfono y conserven la sesión.

### Impacto
- **Producto:** acceso simplificado; una cédula conocida permite suplantar la cuenta.
- **UI:** formulario de un campo.
- **Datos:** se actualizaron los dos usuarios demo.
- **Permisos:** los roles del servidor siguen imponiéndose tras el acceso.
- **Arquitectura:** se elimina validación de contraseña para este flujo solicitado.
- **QA:** se verificó login de ambas cédulas y rechazo de una no registrada.

### Recomendación
Now, por instrucción explícita del solicitante. Antes de producción pública, reemplazar por invitación con OTP o verificación de dispositivo.

### Decisión
Applied.

## CR-002 — Lógica de reservas y cobro de lavandería

- **Fecha:** 2026-09-01
- **Solicitante:** Sebastian
- **Clasificación:** UX / Datos / Permisos
- **Estado:** Applied

### Solicitud
Simplificar lavandería: seleccionar un día de la semana y hora, reservar sin que el residente elija `pendiente` o `pagado`; permitir enlace de pago futuro o pago en efectivo confirmado por administración.

### Decisión
Applied. La reserva nace `PENDIENTE`, el residente ve link `Próximamente` y la instrucción de efectivo. Sólo administración puede marcar el pago recibido.

## CR-003 — Contraste suave y movimiento funcional

- **Fecha:** 2026-09-01
- **Solicitante:** Sebastian
- **Clasificación:** UX / Accesibilidad
- **Estado:** Applied

### Solicitud
Conservar la limpieza visual de la app, pero separar de forma suave el fondo, las cards y los botones; además, lograr que la interfaz se sienta viva sin convertirse en una imagen estática.

### Decisión
Applied. Se definieron superficies frías de baja intensidad, cards con borde y sombra tenue, feedback de presión y transición breve entre pantallas. Se evita animar acciones de alta frecuencia; las transiciones usan únicamente `transform` y `opacity`, incluyen reducción de movimiento y limitan el hover a mouse/trackpad.

## CR-004 — Identidad visual oficial E-block

- **Fecha:** 2026-09-01
- **Solicitante:** Sebastian
- **Clasificación:** Marca / UX
- **Estado:** Applied

### Solicitud
Aplicar el logo oficial entregado por el cliente y usar `#D8471A` como color principal de la plataforma.

### Decisión
Applied. El símbolo oficial se incorporó al frontend como activo local y el azul de marca fue reemplazado por el naranja E-block en acciones principales, navegación, foco e íconos. Los colores verdes, ámbar y rojos se mantienen solamente para estados semánticos.

## CR-005 — Modo oscuro cálido E-block

- **Fecha:** 2026-09-01
- **Solicitante:** Sebastian
- **Clasificación:** Marca / UX / Accesibilidad
- **Estado:** Applied

### Solicitud
Transformar la aplicación en una interfaz dark, evitando el negro puro y manteniendo una sensación naranja coherente con E-block.

### Decisión
Applied. Se definió una escala de fondos naranja-marrón profundo y texto marfil, preservando naranja brillante para acciones principales. Los estados semánticos conservan sus colores propios y el foco visible usa un naranja claro de alto contraste.

## CR-006 — Preview público en Railway

- **Fecha:** 2026-09-01
- **Solicitante:** Sebastian
- **Clasificación:** Infraestructura / QA
- **Estado:** Applied

### Solicitud
Publicar la web en Railway para revisión externa y verificar visualmente que los controles del modo oscuro no conservaran fondos blancos.

### Decisión
Applied como preview técnico. Railway sirve el frontend compilado desde FastAPI en el mismo origen, usa `APP_ENV=production` para cookies seguras y expone un health check. El enlace público no constituye lanzamiento final: SQLite permanece sin volumen/backups de producción y el acceso por cédula sola sigue siendo demo.


## CR-007 — Refinamiento visual y disponibilidad visible de lavandería

- **Fecha:** 2026-09-02
- **Solicitante:** Sebastian
- **Clasificación:** UX / Calidad visual / Datos demo
- **Estado:** Applied

### Solicitud
Reemplazar el fondo naranja-café por una interfaz dark moderna, corregir iconos de campana y volver en blanco, restaurar textos con tildes y mostrar claramente horarios ocupados en lavandería.

### Decisión
Applied. Se definieron tokens de canvas ciruela-carbón, superficies elevadas y acentos naranjas suaves; los iconos usan `currentColor` desde controles con texto blanco. La disponibilidad ahora proviene del API, comunica la ocupación por máquina y bloquea franjas ocupadas. Se agregaron reservas demo idempotentes en la base de datos para el día actual sin alterar la regla de conflicto 409.


## CR-008 — Reserva única de lavado + secado

- **Fecha:** 2026-09-02
- **Solicitante:** Sebastian
- **Clasificación:** Reglas de negocio / UX / Datos / Permisos
- **Estado:** Applied

### Solicitud
Cada lavado debe incluir lavadora y secadora y durar aproximadamente hora y media. El residente elige sólo el día y la franja; Diana revisa todas las reservas y marca pago recibido.

### Decisión
Applied. Las nuevas reservas son bundles de 90 minutos: el servidor decide fin, valor y recursos. Cada bundle persiste una lavadora y la secadora compartida, por lo que sólo existe un bundle concurrente aunque haya dos lavadoras. La reserva nace `PENDIENTE`; sólo la administradora puede cambiarla a `PAGADO`. El enlace de pago se mantiene como `Próximamente`.

### Migración
Las reservas de la versión anterior se mantienen como historial legado y continúan bloqueando disponibilidad; las tres semillas demo previas se sustituyen de forma idempotente por bundles 08:00–09:30, 11:00–12:30 y 14:00–15:30.
