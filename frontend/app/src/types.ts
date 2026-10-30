export type Screen = 'home' | 'servicios' | 'cocina' | 'lavanderia' | 'pagos' | 'cuartos' | 'admin'
export type NavigationTarget = Screen | 'back'
export type AppRole = 'ADMINISTRADOR' | 'RESIDENTE'
export type SessionUser = { id: number; cedula: string; role: AppRole; name: string }
export type RentStatus = { status: 'PENDIENTE' | 'PAGADO' | 'SIN_REGISTRO'; amount_cop?: number; due_date?: string; payment_link_status: 'PROXIMAMENTE'; methods: { type: string; label: string; value: string }[] }
