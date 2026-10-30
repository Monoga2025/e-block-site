import { useEffect, useState } from 'react'
import { Building2, CreditCard, Landmark, Smartphone } from 'lucide-react'
import { BackButton, Card } from '@/components/chrome'
import type { RentStatus, Screen } from '@/types'

const API = import.meta.env.VITE_API_URL ?? ''
const formatCop = (value?: number) => value ? value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }) : '—'

export default function ResidentPaymentsScreen({ go }: { go: (screen: Screen | 'back') => void }) {
  const [rent, setRent] = useState<RentStatus | null>(null)
  useEffect(() => { fetch(`${API}/api/rent/status`, { credentials: 'include' }).then((response) => response.json()).then(setRent).catch(() => setRent(null)) }, [])
  const pending = rent?.status === 'PENDIENTE'
  return <div className="px-5 pb-7">
    <header className="flex items-center gap-3 py-4"><BackButton onClick={() => go('back')} /><div><h1 className="text-[20px] font-extrabold text-slate-900">Mi arriendo</h1><p className="text-[11px] text-slate-500">Estado e instrucciones de pago</p></div></header>
    <Card className={`p-4 ${pending ? 'border border-amber-100' : 'border border-green-100'}`}><div className="flex justify-between"><div><p className="text-[11px] text-slate-500">Estado actual</p><p className={`mt-1 text-[20px] font-extrabold ${pending ? 'text-amber-600' : 'text-green-600'}`}>{pending ? 'Pendiente' : rent?.status === 'PAGADO' ? 'Pagado' : 'Sin registro'}</p></div><CreditCard className={pending ? 'text-amber-500' : 'text-green-500'} /></div><p className="mt-3 text-[22px] font-extrabold text-slate-900">{formatCop(rent?.amount_cop)}</p>{rent?.due_date && <p className="text-[11px] text-slate-500">Vence el {rent.due_date}</p>}</Card>
    <Card className="mt-4 p-4"><div className="flex items-center gap-2"><span className="w-9 h-9 rounded-xl bg-[#FBE4DC] text-[#D8471A] flex items-center justify-center"><Smartphone size={18} /></span><div><p className="text-[13px] font-bold text-slate-900">Pago en línea</p><p className="text-[11px] text-slate-500">El enlace de pago estará disponible pronto.</p></div></div><span className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">PRÓXIMAMENTE</span></Card>
    <section className="mt-5"><h2 className="text-[15px] font-extrabold text-slate-900">Datos para pagar</h2><p className="mt-1 text-[11px] text-slate-500">Confirmá siempre el dato con administración antes de transferir.</p><div className="mt-3 space-y-3">{rent?.methods?.map((method) => <Card key={method.type} className="p-4 flex gap-3"><span className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">{method.type === 'NEQUI' ? <Smartphone size={18} /> : <Landmark size={18} />}</span><div><p className="text-[12px] font-bold text-slate-800">{method.label}</p><p className="mt-1 text-[11px] text-slate-500">{method.value}</p></div></Card>) ?? <Card className="p-4 text-[12px] text-slate-500">No hay medios de pago configurados todavía.</Card>}</div></section>
    <p className="mt-5 flex items-center gap-1.5 text-[11px] text-slate-400"><Building2 size={14} /> Los datos los configura la administración.</p>
  </div>
}
