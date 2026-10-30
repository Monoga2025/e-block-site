---
artifact: commercial-scope
phase: 3
status: approved
reason: "Modelo comercial definido por el responsable: desarrollo con pago único; los costos recurrentes corresponden al cliente. La primera operación de producción usará la cuenta/dominio Railway existente del proveedor, sin compra de dominio propio en esta etapa."
last_updated: "2026-09-01"
---

# 03 — Alcance comercial de E-block

## Resultado prometido

Backend Python de E-block, entregado como producto de pago único, que permite una operación local verificable sin Docker y evoluciona por slices desde acceso y lavandería.

## Entregables incluidos

- Backend Python, modelo de datos local y API documentada.
- Primera slice: autenticación por rol, datos demo, habitaciones/ocupación y lavandería sin solapes.
- Pruebas automatizadas de autenticación y reservas.
- Documentación de ejecución, variables de entorno y despliegue.
- Despliegue inicial en Railway usando la cuenta/dominio existente del proveedor, si la plataforma resulta compatible con la arquitectura aprobada.

## No incluido

- Operación continua del sistema después de la garantía pactada.
- Servicios de terceros consumidos por el cliente: hosting, mensajería, dominio propio, correo, almacenamiento de archivos y proveedores de pago.
- Implementación de módulos posteriores sin un slice y criterio de aceptación acordados.
- Compra, transferencia o administración permanente de un dominio personalizado.

## Revisiones incluidas

- Diseño: una revisión por slice antes de implementación.
- Copy: una revisión por endpoint/documentación de cada slice.
- UAT: una ronda formal por slice.
- Otras: corrección de defectos reproducibles dentro de la garantía.

## Responsabilidades del cliente

- Entregar información operativa, reglas del edificio y datos de prueba no sensibles.
- Aprobar alcance, prioridades, reglas de negocio y UAT de cada slice.
- Cubrir o reembolsar costos recurrentes de operación y proveedores externos.
- Probar flujos en UAT y reportar defectos con pasos de reproducción.
- Gestionar permisos de sus servicios externos cuando se integren.

## Dependencias externas

| Dependencia | Responsable | Costo | Riesgo |
|---|---|---:|---|
| Railway existente del proveedor | Proveedor para el despliegue inicial; cliente para consumo recurrente | Variable según plan | Cambio de límites, disponibilidad o política de plataforma |
| Dominio personalizado | Cliente, si lo solicita | Variable | No está incluido en esta primera etapa |
| WhatsApp, correo y almacenamiento de archivos | Cliente cuando esos módulos entren en alcance | Variable | Requieren cuentas, credenciales y política de privacidad |

## Hitos de aceptación

| Hito | Evidencia | Quién aprueba |
|---|---|---|
| Primera slice local | API inicia sin Docker, pruebas pasan y roles demo funcionan | Sebastian |
| Lavandería operativa | Reservas sin solapes, historial y resumen verificables | Diana |
| Despliegue inicial | Servicio accesible y configuración documentada | Sebastian |

## Estimación

| Bloque | Alcance | Estimación |
|---|---|---:|
| Discovery/diseño | Reglas, MVP, arquitectura y datos | Por estimar por slice |
| Implementación | Backend Python y primera slice | Por estimar por slice |
| QA/deploy | Pruebas, UAT y despliegue inicial | Por estimar por slice |
| Handoff | Documentación y transferencia operativa | Por estimar tras definir módulos |
| Contingencia | Integraciones y ajustes de plataforma | 15% por slice |

## Precio y forma de pago

- Precio: pago único por el backend acordado, definido en propuesta o cotización separada.
- Anticipo: por definir en la cotización.
- Hitos: asociados a slices aceptadas.
- Moneda: COP, salvo acuerdo comercial distinto.
- Impuestos: según corresponda al proveedor y al cliente.
- Validez: definida en la propuesta comercial.

## Costos recurrentes

| Servicio | Estimado | Quién paga | Cuenta a nombre de |
|---|---:|---|---|
| Hosting Railway | Variable | Cliente | Proveedor durante el despliegue inicial; transferencia o reembolso documentado si el cliente solicita continuidad independiente |
| Dominio propio | Variable | Cliente, si lo solicita | Cliente |
| Mensajería, correo y almacenamiento | Variable | Cliente cuando se integren | Cliente |

## Propiedad

- Código: se entrega al cliente tras el pago acordado, sujeto a licencias de dependencias.
- Dominio: no incluido; cualquier dominio nuevo queda a nombre del cliente.
- Datos: propiedad del cliente.
- Cuentas: las cuentas externas de operación recurrente deben quedar bajo control del cliente cuando sean necesarias.
- Diseños: parte de los entregables acordados.
- Licencias: se documentan por dependencia y proveedor.

## Garantía, soporte y mantenimiento

### Garantía por defectos

Defectos reproducibles dentro del alcance aceptado se corrigen durante el periodo definido en la propuesta comercial.

### Soporte incluido

Acompañamiento de puesta en marcha y una ronda de UAT por slice.

### Mantenimiento mensual

No incluido en el pago único; se cotiza por separado si el cliente lo requiere.

### No incluido

Nuevas features, cambios de proveedor, uso extraordinario de servicios externos, contenido, soporte continuo y costos de plataforma.

## Política de cambios

Toda nueva capacidad se registra en `CHANGE_REQUESTS.md` antes de implementarse y requiere estimación/aceptación cuando altera alcance, costo o plazo.

## Supuestos comerciales

- El usuario responsable vende el backend como pago único.
- El cliente asume costos recurrentes de operación.
- Railway existente se usa sólo como punto inicial; no sustituye una decisión futura de titularidad operativa.

## Gate

- [x] Incluido y excluido están claros.
- [x] Los entregables tienen criterio de aceptación.
- [x] Las revisiones tienen límite.
- [x] Los costos recurrentes tienen responsable.
- [x] La propiedad de cuentas y datos está definida.
- [x] Soporte, garantía y mantenimiento no se confunden.
- [x] Existe proceso para cambios.
