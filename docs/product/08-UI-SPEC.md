---
artifact: ui-spec
phase: 8
status: approved
reason: ""
last_updated: "2026-09-01"
---
# 08 — UI Spec de E-block

## Sistema base
- **Dirección aprobada:** Operativa compacta.
- **Viewports:** 360, 375, 390, 412 y 430 px.
- **Grid:** ancho total, padding lateral fluido 14–20 px.
- **Escala:** tipografía 10–20 px; botones 40–44 px; radio 12–18 px.
- **Accesibilidad:** AA, objetivo táctil mínimo de 40 px, loading y error expuestos.

## Contrato mobile
- **Referencia:** dashboard visual entregado por el usuario; sin barra falsa de teléfono.
- **Primera pantalla:** saludo, estado de arriendo y cuatro acciones rápidas.
- **Adaptación:** `clamp()` en espaciado y tipografía; 100dvh; sin `transform: scale()` ni aspecto fijo.

## Navegación
Residente: Inicio, Servicios y Pagos. Administración: Inicio, Servicios, Pagos, Cuartos y Admin. El rol viene del servidor, no de un selector de interfaz.

## Componentes
### Button
- Variantes: principal, secundaria y acción rápida.
- Estados: default, disabled, loading y error recuperable.
- Uso: una primaria por superficie.

### Input
- Cédula numérica con label; contraseña protegida y mensaje de error debajo.

### Card
- Fondo blanco, estado identificado por texto e icono además de color.

## Pantallas clave
### SC-001 — Acceso
- **Estructura:** marca, explicación, campos y CTA.
- **Estados:** cargando, inválido y sesión existente restaurada.

### SC-002 — Inicio residente
- **Estructura:** arriendo arriba, cuadrícula de cuatro acciones, servicios disponibles.
- **Acción primaria:** Consultar mi arriendo.

### SC-003 — Pago de arriendo
- **Estados:** pagado, pendiente, error y aún sin medios configurados.
- **Regla:** `Próximamente` para enlace de pago; Bancolombia y Nequi solo muestran dato proporcionado por administración.

### SC-006 — Panel administrador
- **Estructura:** indicadores y accesos operativos, mantenida separada del residente.

## Referencia
La imagen entregada por el usuario define la densidad de cards y navegación, no los datos ni los permisos.

## Gate
- [x] Las pantallas clave tienen especificación.
- [x] Hay prompts estructurados o referencias generadas.
- [x] Las referencias están registradas en `design-reference/APPROVED.md`.
- [x] Estados y responsive están definidos.
- [x] Mobile conserva densidad visual, proporciones relativas y cantidad de contenido visible.
- [x] La interfaz móvil ocupa todo el ancho y fue especificada para 360, 375, 390, 412 y 430 px.
- [x] Screenshots y mockups se trataron como especificación geométrica cuando aplicaba.
- [x] Los componentes tienen reglas.
- [x] Un desarrollador puede implementar sin inventar el producto.
