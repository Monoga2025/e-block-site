import { DollarSign, Clock, AlertTriangle, WashingMachine, ChevronDown, ChevronRight, Check, Send, HandCoins, FileText, MessageCircle, Bell } from 'lucide-react'
import { BellButton, BackButton, Avatar, Card } from '@/components/chrome'
import type { Screen } from '@/types'

const stats = [
  { icon: DollarSign, n: '26', label: 'Pagados', sub: '52% del total', tint: 'bg-green-100 text-green-600', subColor: 'text-green-600' },
  { icon: Clock, n: '14', label: 'Pendientes', sub: '28% del total', tint: 'bg-amber-100 text-amber-500', subColor: 'text-amber-500' },
  { icon: AlertTriangle, n: '10', label: 'Vencidos', sub: '20% del total', tint: 'bg-red-100 text-red-500', subColor: 'text-red-500' },
  { icon: WashingMachine, n: '$6.240.000', label: 'Total recaudado', sub: 'Este mes', tint: 'bg-[#FBE4DC] text-[#D8471A]', subColor: 'text-slate-400' },
]

const floorColor: Record<number, string> = { 1: '#D8471A', 2: '#16A34A', 3: '#EF4444', 4: '#EAB308' }

type Estado = 'Pagado' | 'Pendiente' | 'Vencido'
const residents: { room: string; floor: number; name: string; seed: string; date: string; estado: Estado; dateRed?: boolean }[] = [
  { room: '101', floor: 1, name: 'Carlos Ramírez', seed: 'Carlos', date: '05 may 2025', estado: 'Pagado' },
  { room: '102', floor: 1, name: 'María Gómez', seed: 'Maria', date: '05 may 2025', estado: 'Pendiente' },
  { room: '201', floor: 2, name: 'Juan P. López', seed: 'Juan', date: '05 may 2025', estado: 'Pagado' },
  { room: '202', floor: 2, name: 'Laura Torres', seed: 'Laura', date: '05 may 2025', estado: 'Vencido' },
  { room: '301', floor: 3, name: 'Andrés Mejía', seed: 'Andres', date: '03 may 2025', estado: 'Vencido', dateRed: true },
  { room: '302', floor: 3, name: 'Valentina Ruiz', seed: 'Valentina', date: '05 may 2025', estado: 'Pendiente' },
  { room: '401', floor: 4, name: 'Diego Morales', seed: 'Diego', date: '05 may 2025', estado: 'Pagado' },
  { room: '402', floor: 4, name: 'Sofía Peña', seed: 'Sofia', date: '05 may 2025', estado: 'Pendiente' },
]

const estadoStyle: Record<Estado, { pill: string; icon: typeof Check }> = {
  Pagado: { pill: 'bg-green-50 text-green-600', icon: Check },
  Pendiente: { pill: 'bg-amber-50 text-amber-600', icon: Clock },
  Vencido: { pill: 'bg-red-50 text-red-500', icon: AlertTriangle },
}

const filters = [
  { label: 'Todos', n: '50', active: true, badge: 'bg-[#D8471A] text-white' },
  { label: 'Pagados', n: '26', active: false, badge: 'bg-green-100 text-green-700' },
  { label: 'Pendientes', n: '14', active: false, badge: 'bg-amber-100 text-amber-600' },
  { label: 'Vencidos', n: '10', active: false, badge: 'bg-red-100 text-red-600' },
]

export default function PagosScreen({ go }: { go: (s: Screen | 'back') => void }) {
  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => go('back')} />
          <div>
            <h1 className="text-[20px] font-extrabold text-slate-900 leading-tight">Arriendos y pagos</h1>
            <p className="text-[11.5px] text-slate-500">Panel de Diana</p>
          </div>
        </div>
        <BellButton />
      </div>

      {/* Resumen del mes */}
      <div className="flex items-center justify-between mt-3 mb-2.5">
        <div>
          <h2 className="text-[15px] font-bold text-slate-900">Resumen del mes</h2>
          <p className="text-[11px] text-slate-500">Mayo 2025</p>
        </div>
        <Card className="px-3 py-2 flex items-center gap-2">
          <span className="text-[12px] font-semibold text-slate-700">🗓 Mayo 2025</span>
          <ChevronDown size={14} className="text-slate-400" />
        </Card>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-2.5">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center ${s.tint}`}>
                <Icon size={13} />
              </span>
              <p className={`font-extrabold text-slate-900 mt-1.5 leading-none ${s.n.length > 3 ? 'text-[13.5px] text-[#D8471A]' : 'text-[19px]'}`}>{s.n}</p>
              <p className="text-[9.5px] text-slate-500 font-medium mt-1">{s.label}</p>
              <p className={`text-[8.5px] font-semibold mt-0.5 ${s.subColor}`}>{s.sub}</p>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.label}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap ${
              f.active ? 'bg-[#FCE7DF] text-[#D8471A]' : 'bg-white text-slate-600 shadow-[0_1px_4px_rgba(15,23,42,0.05)]'
            }`}
          >
            {f.label}
            <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${f.badge}`}>{f.n}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="mt-3 overflow-hidden">
        <div className="flex items-center px-3 py-2.5 text-[9.5px] font-semibold text-slate-400 border-b border-slate-100">
          <span className="w-10">Habitación</span>
          <span className="flex-1 pl-1">Residente</span>
          <span className="w-[62px]">Vence el</span>
          <span className="w-[52px]">Valor</span>
          <span className="w-[70px] text-right">Estado</span>
        </div>
        {residents.map((r) => {
          const st = estadoStyle[r.estado]
          const Icon = st.icon
          const color = floorColor[r.floor]
          return (
            <div key={r.room} className="flex items-center px-3 py-2.5 border-b border-slate-50 last:border-0 relative">
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r" style={{ backgroundColor: color }} />
              <div className="w-10 shrink-0">
                <p className="text-[12.5px] font-extrabold" style={{ color }}>{r.room}</p>
                <p className="text-[7.5px] font-bold tracking-wide" style={{ color }}>PISO {r.floor}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-1 min-w-0 pl-1">
                <Avatar seed={r.seed} size={24} className="shrink-0" />
                <span className="text-[10.5px] font-semibold text-slate-800 whitespace-nowrap">{r.name}</span>
              </div>
              <span className={`w-[62px] shrink-0 text-[9.5px] font-medium ${r.dateRed ? 'text-red-500 font-bold' : 'text-slate-600'}`}>{r.date}</span>
              <span className="w-[52px] shrink-0 text-[10px] font-bold text-slate-800">$320.000</span>
              <span className="w-[70px] shrink-0 flex justify-end">
                <span className={`flex items-center gap-0.5 text-[8.5px] font-bold rounded-full px-1.5 py-1 ${st.pill}`}>
                  <Icon size={9} strokeWidth={3} /> {r.estado}
                </span>
              </span>
            </div>
          )
        })}
      </Card>

      {/* Cuentas vencidas */}
      <Card className="mt-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Bell size={18} className="text-red-500" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5">
                Cuentas vencidas
                <span className="text-[10px] font-bold bg-red-100 text-red-600 rounded-full px-1.5 py-0.5">10</span>
              </p>
              <p className="text-[10px] text-slate-500">Estas cuentas ya pasaron su fecha de vencimiento.</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 bg-[#D8471A] text-white text-[11.5px] font-semibold rounded-xl px-3 py-2.5 shadow-[0_4px_12px_rgba(216,71,26,0.28)]">
            <Send size={13} /> Enviar recordatorio
          </button>
        </div>
        <div className="flex items-center mt-3.5 pt-3.5 border-t border-slate-100">
          <div className="flex-1">
            <p className="text-[10px] text-slate-400">Total vencido</p>
            <p className="text-[17px] font-extrabold text-red-500">$3.200.000</p>
          </div>
          <div className="flex-1 border-l border-slate-100 pl-3">
            <p className="text-[10px] text-slate-400">Cuentas vencidas</p>
            <p className="text-[17px] font-extrabold text-red-500">10</p>
          </div>
          <div className="flex items-center">
            {['Laura', 'Andres', 'Carlos', 'Diego'].map((s, i) => (
              <Avatar key={s} seed={s} size={28} className={`ring-2 ring-white ${i > 0 ? '-ml-2.5' : ''}`} />
            ))}
            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center -ml-2.5 ring-2 ring-white">+6</span>
          </div>
        </div>
      </Card>

      {/* Cargos por servicios */}
      <Card className="mt-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-full bg-[#FBE4DC] flex items-center justify-center">
              <WashingMachine size={18} className="text-[#D8471A]" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-slate-900">Cargos por servicios adicionales</p>
              <p className="text-[10px] text-slate-500">Lavandería disponible para residentes</p>
            </div>
          </div>
          <button className="text-[11.5px] font-semibold text-[#D8471A] flex items-center whitespace-nowrap">
            Ver detalle <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex items-center mt-3.5 pt-3.5 border-t border-slate-100">
          <div className="flex-1">
            <p className="text-[11px] text-slate-500">Lavandería</p>
            <p className="text-[15px] font-extrabold text-[#D8471A]">$10.000 <span className="text-[10px] font-medium text-slate-400">por lavada</span></p>
          </div>
          <div className="border-l border-slate-100 pl-4 text-right">
            <p className="text-[15px] font-extrabold text-[#D8471A]">24</p>
            <p className="text-[10px] text-slate-400">Lavadas este mes</p>
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { icon: HandCoins, title: 'Registrar pago', sub: 'Agregar un pago recibido', tint: 'bg-green-100 text-green-600' },
          { icon: FileText, title: 'Ver historial', sub: 'Pagos y movimientos', tint: 'bg-[#FBE4DC] text-[#D8471A]' },
          { icon: MessageCircle, title: 'Recordar por WhatsApp', sub: 'Enviar recordatorios', tint: 'bg-green-100 text-green-600' },
        ].map((a) => {
          const Icon = a.icon
          return (
            <Card key={a.title} className="p-3">
              <button className="w-full text-left">
                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${a.tint}`}>
                    <Icon size={15} />
                  </span>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
                <p className="text-[11px] font-bold text-slate-800 mt-2 leading-tight">{a.title}</p>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{a.sub}</p>
              </button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
