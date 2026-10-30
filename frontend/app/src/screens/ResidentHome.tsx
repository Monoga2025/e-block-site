import { useEffect, useState } from 'react'
import { ArrowRight, ChefHat, CircleDollarSign, Clock3, CreditCard, WashingMachine } from 'lucide-react'
import { BellButton, Card, Logo } from '@/components/chrome'
import type { RentStatus, Screen, SessionUser } from '@/types'

const API = import.meta.env.VITE_API_URL ?? ''
const formatCop = (value: number) => value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

export default function ResidentHomeScreen({ user, go, onLogout }: { user: SessionUser; go: (screen: Screen) => void; onLogout: () => void }) {
  const [rent, setRent] = useState<RentStatus | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/api/rent/status`, { credentials: 'include' })
      .then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.detail ?? 'No pudimos consultar tu arriendo.')
        setRent(body)
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'No pudimos consultar tu arriendo.'))
  }, [])

  const pending = rent?.status === 'PENDIENTE'
  return (
    <div className="px-5 pb-6">
      <header className="flex items-center justify-between pt-4">
        <Logo />
        <BellButton />
      </header>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div><p className="text-[12px] text-slate-500">Hola, {user.name}</p><h1 className="text-[22px] font-extrabold text-slate-900">Tu espacio, en orden</h1></div>
        <button onClick={onLogout} className="text-[11px] font-bold text-slate-400">Salir</button>
      </div>

      <Card className={`mt-4 p-4 ${pending ? 'border border-amber-100' : 'border border-green-100'}`}>
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-[11px] font-semibold text-slate-500">Estado de arriendo</p><p className={`mt-1 text-[18px] font-extrabold ${pending ? 'text-amber-600' : 'text-green-600'}`}>{rent ? (pending ? 'Pendiente de pago' : 'Pagado') : error ? 'No disponible' : 'Consultando…'}</p></div>
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${pending ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}><CircleDollarSign size={20} /></span>
        </div>
        {rent?.amount_cop && <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[12px]"><span className="text-slate-500">Valor del periodo</span><strong className="text-slate-900">{formatCop(rent.amount_cop)}</strong></div>}
        {rent?.due_date && <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1"><Clock3 size={13} /> Vence el {rent.due_date}</p>}
        <button onClick={() => go('pagos')} className="mt-4 h-10 w-full rounded-xl bg-[#D8471A] text-[12px] font-bold text-white flex items-center justify-center gap-1">Ver mi arriendo <ArrowRight size={14} /></button>
      </Card>

      <section className="mt-5"><h2 className="text-[15px] font-extrabold text-slate-900">Accesos rápidos</h2><div className="grid grid-cols-2 gap-3 mt-2.5">
        {[{ icon: WashingMachine, title: 'Lavandería', sub: 'Reservá un turno', screen: 'lavanderia' as Screen, tint: 'bg-[#FBE4DC] text-[#D8471A]' }, { icon: ChefHat, title: 'Cocina', sub: 'Revisá disponibilidad', screen: 'cocina' as Screen, tint: 'bg-orange-100 text-orange-600' }, { icon: CreditCard, title: 'Mis pagos', sub: 'Estado y cuentas', screen: 'pagos' as Screen, tint: 'bg-green-100 text-green-600' }, { icon: ArrowRight, title: 'Servicios', sub: 'Todo lo disponible', screen: 'servicios' as Screen, tint: 'bg-violet-100 text-violet-600' }].map((item) => { const Icon = item.icon; return <button key={item.title} onClick={() => go(item.screen)} className="text-left"><Card className="p-3.5 min-h-[96px]"><span className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.tint}`}><Icon size={16} /></span><p className="mt-2 text-[12px] font-bold text-slate-800">{item.title}</p><p className="text-[10px] text-slate-500">{item.sub}</p></Card></button> })}
      </div></section>
      {error && <p role="alert" className="mt-4 text-[11px] text-red-600">{error}</p>}
    </div>
  )
}
