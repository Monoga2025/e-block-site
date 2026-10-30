---
artifact: ui-direction
phase: 7
status: approved
reason: ""
last_updated: "2026-09-01"
---
# 07 — Dirección visual de E-block

## Contexto de uso
- **Usuario:** residente en móvil y administración en móvil/escritorio.
- **Dispositivo:** móvil 360–430 px prioritario.
- **Frecuencia:** varias consultas cortas por semana.
- **Densidad:** información accionable sin desplazamiento innecesario.

## Dirección A — Operativa compacta
Jerarquía por estado y acción, cards cortas, azul institucional, iconos explícitos y navegación inferior. Riesgo: puede sentirse fría.

## Dirección B — Residencial cálida
Ilustraciones y espacio amplio, tono humano. Riesgo: reduce densidad para pagos y operación.

## Dirección C — SaaS de escritorio reducido
Tablas y filtros densos. Riesgo: no sirve bien para el residente móvil.

## Matriz de decisión
| Criterio | Peso | A | B | C |
|---|---:|---:|---:|---:|
| Claridad | 30 | 5 | 4 | 3 |
| Velocidad | 25 | 5 | 3 | 4 |
| Confianza | 20 | 5 | 4 | 4 |
| Datos | 15 | 4 | 2 | 5 |
| Mobile | 10 | 5 | 4 | 2 |

## Dirección elegida
Dirección A, suavizada con copy claro y cards residenciales.

## Identidad de marca
- **Logo:** símbolo oficial de E-block provisto por el cliente, usado como marca blanca sobre un contenedor naranja.
- **Color primario:** `#D8471A` (naranja E-block) para acciones principales, estado activo, foco y acentos de navegación.
- **Superficies de apoyo:** naranja claro `#FBE4DC` y tonos neutros fríos; no conservar el azul anterior como color de marca.
- **Modo visual activo:** oscuro cálido, con lienzo `#26100C`, página `#32150F` y cards `#421C13`; no usar negro neutro.

## Reglas no negociables
- Priorizar estado del arriendo y acción rápida sobre métricas decorativas.
- Usar 14–20 px de margen horizontal, 14–22 px entre secciones, botones 40–44 px.
- Mantener primera pantalla útil en 9:20, 360, 375, 390, 412 y 430 px sin escala global ni aspect-ratio fijo.
- Contraste AA, labels visibles y foco de teclado.
- Mantener tres niveles de superficie suaves: lienzo azul-gris, página casi blanca y cards blancas con borde tenue; los botones de acción conservan el azul institucional.
- La animación es funcional, no decorativa: respuesta táctil de 140 ms, transición de pantalla de 180 ms con `transform` y `opacity`, y sin movimiento prolongado en navegación frecuente o datos.
- Respetar `prefers-reduced-motion` y habilitar movimiento de hover sólo con puntero fino.

## Gate
- [x] Las tres direcciones son realmente distintas.
- [x] La elección se basa en contexto, no solo gusto.
- [x] Jerarquía y densidad están definidas.
- [x] Mobile y desktop están resueltos sin convertir mobile en una versión ampliada o reducida accidental de desktop.
- [x] La dirección móvil define densidad visual, proporciones y cantidad de contenido visible.
- [x] La solución móvil ocupa el viewport edge-to-edge sin bloquearse a un único teléfono.
- [x] Existen reglas de accesibilidad y contenido.
