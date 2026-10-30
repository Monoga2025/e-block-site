import { useEffect, useState } from 'react'
import { Menu, Sun, DollarSign, Wallet, WashingMachine, CookingPot, Wrench, ChefHat, Megaphone, BedDouble, ClipboardList, UserCheck, ChevronRight, CalendarDays } from 'lucide-react'
import { Logo, BellButton, Avatar, Card } from '@/components/chrome'
import type { Screen } from '@/types'

const dayStats = [
  { icon: DollarSign, n: '32', label: 'Arriendos pagados', tint: 'bg-green-100 text-green-600' },
  { icon: Wallet, n: '18', label: 'Pagos pendientes', tint: 'bg-amber-100 text-amber-500' },
  { icon: WashingMachine, n: '24', label: 'Lavadas del día', tint: 'bg-[#FBE4DC] text-[#B93814]' },
  { icon: CookingPot, n: '6', label: 'Turnos de cocina hoy', tint: 'bg-violet-100 text-violet-600' },
  { icon: Wrench, n: '5', label: 'Reportes abiertos', tint: 'bg-rose-100 text-rose-500' },
]

const floors = [
  { name: 'PISO 1', color: '#D8471A', pagadas: 7 },
  { name: 'PISO 2', color: '#16A34A', pagadas: 6 },
  { name: 'PISO 3', color: '#EF4444', pagadas: 5 },
  { name: 'PISO 4', color: '#EAB308', pagadas: 8 },
]

const modules: { icon: typeof ChefHat; n: string; label: string; tint: string; go: Screen }[] = [
  { icon: ChefHat, n: '1.', label: 'Cocina compartida', tint: 'bg-[#FBE4DC] text-[#B93814]', go: 'cocina' },
  { icon: WashingMachine, n: '2.', label: 'Lavandería', tint: 'bg-green-100 text-green-600', go: 'lavanderia' },
  { icon: Wallet, n: '3.', label: 'Arriendos / pagos', tint: 'bg-amber-100 text-amber-500', go: 'pagos' },
  { icon: BedDouble, n: '4.', label: 'Habitaciones / cuartos', tint: 'bg-violet-100 text-violet-600', go: 'cuartos' },
  { icon: Wrench, n: '5.', label: 'Mantenimiento / reportes', tint: 'bg-rose-100 text-rose-500', go: 'admin' },
  { icon: Megaphone, n: '6.', label: 'Anuncios y comunicados', tint: 'bg-[#FBE4DC] text-[#B93814]', go: 'admin' },
  { icon: ClipboardList, n: '7.', label: 'Historial y movimientos', tint: 'bg-violet-100 text-violet-600', go: 'admin' },
  { icon: UserCheck, n: '8.', label: 'Panel de administradora', tint: 'bg-teal-100 text-teal-600', go: 'admin' },
]

export default function HomeScreen({ go }: { go: (s: Screen) => void }) {
  const [backendOnline, setBackendOnline] = useState(false)
  useEffect(() => { fetch('/api/health').then(r => r.ok && setBackendOnline(true)).catch(() => setBackendOnline(false)) }, [])
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

      <p className={backendOnline ? "text-center text-[10px] font-semibold text-green-600" : "text-center text-[10px] font-semibold text-amber-600"}>{backendOnline ? "API conectada" : "API sin conexión"}</p>

      {/* Greeting */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <Avatar seed="Diana" size={58} className="ring-2 ring-white shadow" />
          <div>
            <h1 className="text-[20px] font-extrabold text-slate-900 leading-tight">¡Buenos días, Diana!</h1>
            <p className="text-[13px] font-semibold text-[#D8471A]">Administradora</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
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

      {/* Resumen del día */}
      <h2 className="text-[15px] font-bold text-slate-900 mt-5 mb-2.5">Resumen del día</h2>
      <div className="grid grid-cols-5 gap-1.5">
        {dayStats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="px-1 py-3 flex flex-col items-center text-center">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${s.tint}`}>
                <Icon size={15} />
              </span>
              <span className="text-[19px] font-extrabold text-slate-900 mt-1.5 leading-none">{s.n}</span>
              <span className="text-[8.5px] text-slate-500 font-medium leading-tight mt-1">{s.label}</span>
            </Card>
          )
        })}
      </div>

      {/* Estado por pisos */}
      <div className="flex items-center justify-between mt-5 mb-2.5">
        <h2 className="text-[15px] font-bold text-slate-900">Estado por pisos</h2>
        <button onClick={() => go('cuartos')} className="text-[12px] font-semibold text-[#D8471A] flex items-center">
          Ver detalle <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {floors.map((f) => (
          <Card key={f.name} className="px-2.5 py-3">
            <span className="text-[9.5px] font-bold tracking-wide" style={{ color: f.color }}>{f.name}</span>
            <div className="text-[17px] font-extrabold text-slate-900 mt-1 leading-none">
              10<span className="text-[12px] text-slate-400 font-semibold">/10</span>
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">Habitaciones</div>
            <div className="h-[4px] rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div className="h-full rounded-full" style={{ backgroundColor: f.color, width: `${f.pagadas * 10}%` }} />
            </div>
            <div className="text-[9.5px] font-semibold mt-1.5" style={{ color: f.color }}>{f.pagadas} pagadas</div>
          </Card>
        ))}
      </div>

      {/* Modules grid */}
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        {modules.map((m) => {
          const Icon = m.icon
          return (
            <Card key={m.n} className="px-3 py-3.5">
              <button onClick={() => go(m.go)} className="w-full flex items-center gap-2.5 text-left">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.tint}`}>
                  <Icon size={18} />
                </span>
                <span className="text-[12.5px] font-semibold text-slate-800 leading-tight flex-1">
                  {m.n} {m.label}
                </span>
                <ChevronRight size={16} className="text-slate-300 shrink-0" />
              </button>
            </Card>
          )
        })}
      </div>

      {/* Resumen financiero */}
      <Card className="mt-4 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14.5px] font-bold text-slate-900">Resumen financiero</h3>
          <button onClick={() => go('pagos')} className="text-[12px] font-semibold text-[#D8471A] flex items-center">
            Ver detalle <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex items-center divide-x divide-slate-100">
          <div className="flex items-center gap-3 flex-1 pr-3">
            <span className="w-11 h-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <DollarSign size={20} />
            </span>
            <div>
              <p className="text-[10.5px] text-slate-500">Arriendos recibidos hoy</p>
              <p className="text-[18px] font-extrabold text-green-600 leading-tight">$320.000</p>
              <p className="text-[10px] text-slate-400">32 pagos completados</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1 pl-4">
            <span className="w-11 h-11 rounded-full bg-[#FBE4DC] text-[#B93814] flex items-center justify-center shrink-0">
              <WashingMachine size={20} />
            </span>
            <div>
              <p className="text-[10.5px] text-slate-500">Lavandería ( $10.000 c/u )</p>
              <p className="text-[18px] font-extrabold text-[#D8471A] leading-tight">$240.000</p>
              <p className="text-[10px] text-slate-400">24 lavadas hoy</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
