import { useEffect, useMemo, useState } from 'react'
import { Check, Clock3, CreditCard, Landmark, LoaderCircle, WashingMachine } from 'lucide-react'
import { BackButton, BellButton, Card, Logo } from '@/components/chrome'
import type { AppRole, Screen } from '@/types'

const API = import.meta.env.VITE_API_URL ?? ''

type Slot = { time: string; ends_at: string; available: boolean }
type Availability = { bundle: { label: string; duration_minutes: number; includes: string[] }; slots: Slot[] }
type Reservation = { id: number; label: string; starts_at: string; ends_at: string; duration_minutes: number; amountCop: number; status: string }
type LaundryHistory = { id: number; starts_at: string; ends_at: string; status: string; amount_cop: number; bundle_label: string; resident_name: string; resource_names: string; legacy?: boolean }

function weekDays() {
  const today = new Date()
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setHours(12, 0, 0, 0)
    date.setDate(today.getDate() + index)
    return { key: date.toISOString().slice(0, 10), label: new Intl.DateTimeFormat('es-CO', { weekday: 'short' }).format(date).replace('.', ''), number: date.getDate() }
  })
}

function range(startsAt: string, endsAt: string) {
  const start = startsAt.slice(11, 16)
  const end = endsAt.slice(11, 16)
  return `${start}–${end}`
}

export default function LavanderiaScreen({ go, role }: { go: (screen: Screen | 'back') => void; role: AppRole }) {
  const days = useMemo(weekDays, [])
  const [day, setDay] = useState(days[0].key)
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<LaundryHistory[]>([])

  const loadHistory = () => fetch(`${API}/api/laundry/reservations`, { credentials: 'include' })
    .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.detail ?? 'No pudimos cargar las reservas.'); return body })
    .then((body) => setHistory(body.data ?? []))
    .catch((reason) => setError(reason instanceof Error ? reason.message : 'No pudimos cargar las reservas.'))

  useEffect(() => { loadHistory() }, [])
  useEffect(() => {
    setLoading(true); setError(''); setTime(null)
    fetch(`${API}/api/laundry/availability?day=${day}`, { credentials: 'include' })
      .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.detail ?? 'No pudimos consultar la disponibilidad.'); return body })
      .then((body: Availability) => setAvailability(body))
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'No pudimos consultar la disponibilidad.'))
      .finally(() => setLoading(false))
  }, [day])

  const selectedSlot = availability?.slots.find((slot) => slot.time === time)

  async function reserve() {
    if (!time || !selectedSlot?.available) { setError('Elegí un bloque disponible.'); return }
    setSaving(true); setError('')
    try {
      const response = await fetch(`${API}/api/laundry/reservations`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starts_at: `${day}T${time}:00` }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.detail ?? 'No pudimos guardar la reserva.')
      setReservation(body); loadHistory()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'No pudimos guardar la reserva.') } finally { setSaving(false) }
  }

  async function markPaid(reservationId: number) {
    setError('')
    try {
      const response = await fetch(`${API}/api/laundry/reservations/${reservationId}/mark-paid`, { method: 'POST', credentials: 'include' })
      const body = await response.json()
      if (!response.ok) throw new Error(body.detail ?? 'No pudimos marcar el pago.')
      loadHistory()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'No pudimos marcar el pago.') }
  }

  if (reservation) return <div className="px-5 pb-7"><header className="flex items-center justify-between py-3"><BackButton onClick={() => go('back')} /><Logo /><BellButton /></header><div className="mt-14 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><Check size={32} className="text-green-600" strokeWidth={3} /></span><h1 className="mt-5 text-[24px] font-extrabold text-slate-900">Reserva confirmada</h1><p className="mt-2 text-[13px] text-slate-500">Lavado + secado · {range(reservation.starts_at, reservation.ends_at)}</p></div><Card className="mt-7 p-4 text-left"><p className="text-[13px] font-bold text-slate-900">Incluye lavadora y secadora</p><p className="mt-1 text-[11px] text-slate-500">El bloque dura 90 minutos. Tu reserva quedó pendiente de pago; administración confirma el efectivo recibido.</p><p className="mt-3 text-[20px] font-extrabold text-slate-900">$ {reservation.amountCop.toLocaleString('es-CO')}</p><div className="mt-4 grid grid-cols-2 gap-2"><button disabled className="h-11 rounded-xl bg-slate-100 text-[11px] font-bold text-slate-400"><CreditCard size={14} className="mr-1 inline" />Link: Próximamente</button><div className="rounded-xl bg-amber-50 px-3 py-2 text-[10px] text-amber-700"><Landmark size={13} className="mr-1 inline" />Efectivo: entregalo a administración.</div></div></Card><button onClick={() => go('back')} className="mt-5 h-11 w-full rounded-xl bg-[#D8471A] text-[13px] font-bold text-white">Volver al inicio</button></div>

  const isAdmin = role === 'ADMINISTRADOR'
  return <div className="px-5 pb-7"><header className="flex items-center justify-between py-3"><BackButton onClick={() => go('back')} /><Logo /><BellButton /></header>
    <div className="mt-4 flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100"><WashingMachine size={23} className="text-violet-600" /></span><div><h1 className="text-[22px] font-extrabold text-slate-900">{isAdmin ? 'Control de lavandería' : 'Lavandería'}</h1><p className="text-[12px] text-slate-500">{isAdmin ? 'Revisá reservas y confirmá pagos recibidos.' : 'Cada reserva incluye lavado y secado.'}</p></div></div>
    {!isAdmin && <>
      <Card className="mt-5 p-4"><div className="flex items-start gap-3"><WashingMachine size={19} className="mt-0.5 shrink-0 text-[#D8471A]" /><div><p className="text-[13px] font-bold text-slate-800">Lavado + secado · 90 minutos</p><p className="mt-1 text-[11px] text-slate-500">Elegí el día y el bloque. La reserva asigna una lavadora y la secadora compartida.</p></div></div></Card>
      <section className="mt-5"><h2 className="text-[15px] font-extrabold text-slate-900">Elegí el día</h2><div className="mt-2.5 grid grid-cols-7 gap-1.5">{days.map((item) => <button key={item.key} onClick={() => setDay(item.key)} aria-pressed={day === item.key} className={`h-14 rounded-xl text-center ${day === item.key ? 'bg-[#D8471A] text-white shadow-[0_8px_18px_rgba(216,71,26,0.22)]' : 'eblock-slot-available'}`}><span className="block text-[9px] font-bold uppercase">{item.label}</span><span className="mt-1 block text-[16px] font-extrabold">{item.number}</span></button>)}</div></section>
      <section className="mt-5"><div className="flex items-center justify-between"><div><h2 className="text-[15px] font-extrabold text-slate-900">Elegí el bloque</h2><p className="mt-0.5 text-[10px] text-slate-500">Un bloque incluye lavadora + secadora durante 90 minutos.</p></div>{loading && <LoaderCircle size={15} className="animate-spin text-[#D8471A]" />}</div><div className="mt-2.5 grid grid-cols-2 gap-2">{availability?.slots.map((slot) => <button key={slot.time} disabled={!slot.available} onClick={() => setTime(slot.time)} className={`min-h-14 rounded-xl px-2 text-[12px] font-bold ${!slot.available ? 'eblock-slot-unavailable' : time === slot.time ? 'eblock-slot-selected' : 'eblock-slot-available'}`}><span className={!slot.available ? 'line-through' : ''}>{slot.time}–{slot.ends_at}</span><span className="mt-0.5 block text-[8px] no-underline">{slot.available ? 'Disponible' : 'Ocupado'}</span></button>)}</div></section>
      <Card className="mt-5 p-4"><div className="flex gap-3"><Clock3 size={18} className="shrink-0 text-[#D8471A]" /><div><p className="text-[12px] font-bold text-slate-800">Tu reserva</p><p className="mt-1 text-[11px] text-slate-500">Lavado + secado · {selectedSlot ? `${selectedSlot.time}–${selectedSlot.ends_at}` : 'Elegí una franja'} · 90 min</p></div></div><div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-[12px]"><span className="text-slate-500">Valor</span><strong className="text-[#D8471A]">$ 10.000</strong></div></Card>
      <button onClick={reserve} disabled={saving || !time || !selectedSlot?.available} className="mt-4 h-11 w-full rounded-xl bg-[#D8471A] text-[13px] font-bold text-white disabled:opacity-45">{saving ? 'Guardando reserva…' : 'Confirmar lavado + secado'}</button>
    </>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-[12px] text-red-600">{error}</p>}
    <section className="mt-6"><h2 className="text-[15px] font-extrabold text-slate-900">{isAdmin ? 'Reservas de lavado + secado' : 'Mi historial de lavadas'}</h2><Card className="mt-2.5 divide-y divide-slate-100">{history.length === 0 ? <p className="p-4 text-[12px] text-slate-500">Todavía no hay reservas.</p> : history.map((item) => <div key={`${item.legacy ? 'legacy' : 'bundle'}-${item.id}`} className="p-3.5"><div className="flex items-start justify-between gap-2"><div><p className="text-[12px] font-bold text-slate-800">{item.bundle_label}{isAdmin ? ` · ${item.resident_name}` : ''}</p><p className="mt-0.5 text-[10px] text-slate-500">{item.starts_at.slice(0, 10)} · {range(item.starts_at, item.ends_at)}</p><p className="mt-0.5 text-[9px] text-slate-400">{item.resource_names}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${item.status === 'PAGADO' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{item.status === 'PAGADO' ? 'Pagado' : 'Pendiente de pago'}</span></div>{isAdmin && !item.legacy && item.status !== 'PAGADO' && <button onClick={() => markPaid(item.id)} className="mt-2 h-8 rounded-lg bg-green-600 px-3 text-[10px] font-bold text-white">Marcar pago recibido</button>}</div>)}</Card></section>
    {isAdmin && <Card className="mt-4 p-4"><p className="text-[12px] font-bold text-slate-900">Pago en línea</p><p className="mt-1 text-[11px] text-slate-500">Próximamente. Por ahora Diana confirma sólo los pagos entregados en efectivo.</p></Card>}
  </div>
}
