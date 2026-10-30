import { Menu, Sun, CalendarDays, Wrench, Megaphone, History, Users, Package, Boxes, BarChart3, ChevronRight, DollarSign, WashingMachine, CookingPot, UserPlus, Download, Plus } from 'lucide-react'
import { Logo, BellButton, Avatar, Card } from '@/components/chrome'
import type { Screen } from '@/types'

/* Donut: 2 Alta (red), 2 Media (amber), 1 Baja (green) */
function Donut() {
  const total = 5
  const segs = [
    { v: 2, color: '#EF4444' },
    { v: 2, color: '#F59E0B' },
    { v: 1, color: '#22C55E' },
  ]
  const R = 34, C = 2 * Math.PI * R
  let offset = 25
  return (
    <svg width="92" height="92" viewBox="0 0 92 92">
      <circle cx="46" cy="46" r={R} fill="none" stroke="#F1F5F9" strokeWidth="13" />
      {segs.map((s, i) => {
        const dash = (s.v / total) * C
        const el = (
          <circle
            key={i}
            cx="46" cy="46" r={R} fill="none"
            stroke={s.color} strokeWidth="13"
            strokeDasharray={`${dash - 2} ${C - dash + 2}`}
            strokeDashoffset={-((offset / 100) * C)}
            strokeLinecap="round"
          />
        )
        offset += (s.v / total) * 100
        return el
      })}
    </svg>
  )
}

const reportes = [
  { t: 'Fuga de agua - Piso 2', id: '#INC-1287 · Hoy, 08:15', tag: 'Alta', color: 'text-red-500' },
  { t: 'Luz pasillo intermitente', id: '#INC-1286 · Ayer, 17:40', tag: 'Media', color: 'text-amber-500' },
  { t: 'Puerta de garaje atascada', id: '#INC-1285 · Ayer, 11:22', tag: 'Baja', color: 'text-green-600' },
]

const movimientos = [
  { t: 'Pago recibido - Apto 401', time: 'Hoy, 08:42', pill: '+$120.000', pillClass: 'bg-green-50 text-green-600', dot: 'bg-violet-400' },
  { t: 'Lavandería - Piso 2', time: 'Hoy, 07:15', pill: 'Lavada', pillClass: 'bg-[#FEF3EF] text-[#D8471A]', dot: 'bg-violet-400' },
  { t: 'Reserva cocina - Apto 303', time: 'Ayer, 21:30', pill: 'Reserva', pillClass: 'bg-violet-50 text-violet-600', dot: 'bg-violet-400' },
  { t: 'Reporte cerrado - INC-1284', time: 'Ayer, 18:05', pill: 'Resuelto', pillClass: 'bg-green-50 text-green-600', dot: 'bg-violet-400' },
]

const inventario = [
  { label: 'Detergente líquido', pct: 60, color: '#22C55E' },
  { label: 'Gas (cilindro)', pct: 40, color: '#F59E0B' },
  { label: 'Implementos de cocina', pct: 80, color: '#22C55E' },
  { label: 'Bolsas de basura', pct: 25, color: '#EF4444' },
]

export default function AdminScreen({ go: _go }: { go: (s: Screen) => void }) {
  return (
    <div className="px-5 pb-6">
      {/* Top bar */}
      <div className="flex items-center justify-between py-3">
        <button className="w-11 h-11 rounded-full bg-white shadow-[0_2px_10px_rgba(15,23,42,0.07)] flex items-center justify-center">
          <Menu size={19} className="text-slate-800" />
        </button>
        <Logo />
        <BellButton />
      </div>

      {/* Greeting */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <Avatar seed="Diana" size={58} className="ring-2 ring-white shadow" />
          <div>
            <h1 className="text-[17px] font-extrabold text-slate-900 leading-tight whitespace-nowrap">Panel de administradora</h1>
            <p className="text-[13px] font-bold text-slate-800 mt-0.5">¡Hola, Diana! 👋</p>
            <p className="text-[10.5px] text-slate-500 flex items-center gap-1 mt-0.5">
              <CalendarDays size={11} /> Martes, 27 de mayo de 2025
            </p>
          </div>
        </div>
        <Card className="px-3.5 py-2.5 flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <Sun size={20} className="text-amber-400" fill="#FBBF24" />
            <span className="text-[22px] font-extrabold text-slate-900">18°</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Soleado</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3.5 mt-5">
        {/* 1. Mantenimiento */}
        <Card className="p-4">
          <SectionHead icon={<Wrench size={16} className="text-amber-500" />} tint="bg-amber-100" title="1. Mantenimiento y reportes" sub="Incidentes abiertos" />
          <div className="flex items-center gap-4 mt-3">
            <div>
              <p className="text-[30px] font-extrabold text-slate-900 leading-none">5</p>
              <p className="text-[11px] text-slate-500 mt-1">reportes<br />abiertos</p>
            </div>
            <Donut />
            <div className="space-y-1">
              {[['#EF4444', '2 Alta'], ['#F59E0B', '2 Media'], ['#22C55E', '1 Baja'], ['#CBD5E1', '0 Cerrados']].map(([c, l]) => (
                <p key={l} className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} /> {l}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-3 divide-y divide-slate-50 border-t border-slate-100 pt-1">
            {reportes.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[12px] font-semibold text-slate-800">{r.t}</p>
                  <p className="text-[9.5px] text-slate-400">{r.id}</p>
                </div>
                <span className={`text-[10.5px] font-bold ${r.color}`}>{r.tag}</span>
              </div>
            ))}
          </div>
          <CardLink>Ver todos los reportes</CardLink>
        </Card>

        {/* 2. Anuncios */}
        <Card className="p-4">
          <SectionHead icon={<Megaphone size={16} className="text-[#D8471A]" />} tint="bg-[#FBE4DC]" title="2. Anuncios y comunicados" sub="Crea y envía avisos a los residentes" />
          <div className="bg-[#FEF7F4] border border-[#F6D4C8] rounded-xl p-4 text-center mt-3">
            <p className="text-[12.5px] font-bold text-slate-800">No hay comunicados activos</p>
            <p className="text-[10.5px] text-slate-500 mt-1">Crea uno nuevo para mantener<br />informados a todos.</p>
          </div>
          <button className="w-full mt-3 flex items-center justify-center gap-2 bg-[#D8471A] text-white text-[13.5px] font-semibold rounded-xl py-3 shadow-[0_6px_16px_rgba(216,71,26,0.28)]">
            <Plus size={16} strokeWidth={2.5} /> Crear comunicado
          </button>
          <CardLink>Ver comunicados enviados</CardLink>
        </Card>

        {/* 3. Historial */}
        <Card className="p-4">
          <SectionHead icon={<History size={16} className="text-violet-600" />} tint="bg-violet-100" title="3. Historial y movimientos" sub="Actividad reciente en el edificio" />
          <div className="mt-3 relative">
            <div className="absolute left-[3px] top-2 bottom-2 w-px bg-slate-150 bg-slate-200" />
            {movimientos.map((m) => (
              <div key={m.t} className="flex items-start gap-3 py-2 relative">
                <span className={`w-[7px] h-[7px] rounded-full mt-1.5 shrink-0 ${m.dot}`} />
                <div className="flex-1">
                  <p className="text-[12px] font-semibold text-slate-800">{m.t}</p>
                  <p className="text-[9.5px] text-slate-400">{m.time}</p>
                </div>
                <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${m.pillClass}`}>{m.pill}</span>
              </div>
            ))}
          </div>
          <CardLink>Ver historial completo</CardLink>
        </Card>

        {/* 4. Visitantes */}
        <Card className="p-4">
          <SectionHead icon={<Users size={16} className="text-teal-600" />} tint="bg-teal-100" title="4. Visitantes o paquetes" sub="Entradas pendientes" />
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div className="bg-slate-50 rounded-xl p-3.5 flex flex-col items-center text-center">
              <span className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center">
                <Users size={16} className="text-teal-600" />
              </span>
              <p className="text-[22px] font-extrabold text-slate-900 mt-1.5 leading-none">3</p>
              <p className="text-[10px] text-slate-500 mt-1">Visitantes pendientes</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 flex flex-col items-center text-center">
              <span className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                <Package size={16} className="text-amber-500" />
              </span>
              <p className="text-[22px] font-extrabold text-slate-900 mt-1.5 leading-none">2</p>
              <p className="text-[10px] text-slate-500 mt-1">Paquetes pendientes</p>
            </div>
          </div>
          <CardLink>Ver registros</CardLink>
        </Card>

        {/* 5. Inventario */}
        <Card className="p-4">
          <SectionHead icon={<Boxes size={16} className="text-green-600" />} tint="bg-green-100" title="5. Inventario de insumos" sub="Stock actual de insumos" />
          <div className="mt-3 space-y-3">
            {inventario.map((i) => (
              <div key={i.label} className="flex items-center gap-3">
                <span className="text-[11.5px] font-medium text-slate-700 w-[118px]">{i.label}</span>
                <div className="flex-1 h-[7px] rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${i.pct}%`, backgroundColor: i.color }} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 w-8 text-right">{i.pct}%</span>
              </div>
            ))}
          </div>
          <CardLink>Ver inventario completo</CardLink>
        </Card>

        {/* 6. Métricas */}
        <Card className="p-4">
          <SectionHead icon={<BarChart3 size={16} className="text-amber-500" />} tint="bg-amber-100" title="6. Métricas rápidas" sub="Indicadores del día / mes" />
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            {[
              { icon: DollarSign, tint: 'bg-green-100 text-green-600', big: '$320.000', bigClass: 'text-green-600 text-[16px]', label: 'Pagos del mes', sub: '32 completados', subClass: 'text-green-600' },
              { icon: WashingMachine, tint: 'bg-[#FBE4DC] text-[#D8471A]', big: '24', bigClass: 'text-slate-900 text-[19px]', label: 'Lavadas del día', sub: '6 pagadas', subClass: 'text-[#D8471A]' },
              { icon: CookingPot, tint: 'bg-violet-100 text-violet-600', big: '6', bigClass: 'text-slate-900 text-[19px]', label: 'Reservas cocina', sub: 'Hoy', subClass: 'text-slate-400' },
              { icon: Wrench, tint: 'bg-rose-100 text-rose-500', big: '5', bigClass: 'text-rose-500 text-[19px]', label: 'Reportes pendientes', sub: '2 alta prioridad', subClass: 'text-rose-500' },
            ].map((m) => {
              const Icon = m.icon
              return (
                <div key={m.label} className="border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${m.tint}`}>
                      <Icon size={13} />
                    </span>
                    <span className={`font-extrabold leading-none ${m.bigClass}`}>{m.big}</span>
                  </div>
                  <p className="text-[10.5px] font-semibold text-slate-700 mt-1.5">{m.label}</p>
                  <p className={`text-[9.5px] font-medium ${m.subClass}`}>{m.sub}</p>
                </div>
              )
            })}
          </div>
        </Card>

        {/* 7. Acciones rápidas */}
        <Card className="p-4">
          <h3 className="text-[14px] font-bold text-slate-900">7. Acciones rápidas de administración</h3>
          <p className="text-[10.5px] text-slate-500">Atajos para tareas frecuentes</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { icon: Megaphone, label: 'Crear comunicado', cls: 'bg-[#FDF0EB] text-[#D8471A] border-[#F4C7B8]' },
              { icon: UserPlus, label: 'Asignar tarea', cls: 'bg-[#FFF7E8] text-amber-600 border-amber-200' },
              { icon: Download, label: 'Exportar reporte', cls: 'bg-[#EBF9F0] text-green-600 border-green-200' },
            ].map((a) => {
              const Icon = a.icon
              return (
                <button key={a.label} className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 text-[11px] font-semibold ${a.cls}`}>
                  <Icon size={14} /> {a.label}
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

function SectionHead({ icon, tint, title, sub }: { icon: React.ReactNode; tint: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${tint}`}>{icon}</span>
      <div>
        <h3 className="text-[13.5px] font-bold text-slate-900 leading-tight">{title}</h3>
        <p className="text-[10px] text-slate-400">{sub}</p>
      </div>
    </div>
  )
}

function CardLink({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-full flex items-center justify-between mt-2 pt-2.5 border-t border-slate-100 text-[12px] font-semibold text-[#D8471A]">
      {children}
      <ChevronRight size={15} className="text-slate-300" />
    </button>
  )
}
