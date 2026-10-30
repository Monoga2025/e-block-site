import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, CookingPot, LoaderCircle } from 'lucide-react'
import { BackButton, BellButton, Card } from '@/components/chrome'
import type { Screen } from '@/types'

const API = import.meta.env.VITE_API_URL ?? ''
const HOURS = Array.from({ length: 13 }, (_, index) => `${String(index + 8).padStart(2, '0')}:00`)
const tasks = ['Lavar los utensilios', 'Limpiar la estufa', 'Limpiar el mesón', 'Sacar la basura']

function daysThisWeek() {
  const today = new Date()
  return Array.from({ length: 7 }, (_, index) => { const date = new Date(today); date.setHours(12, 0, 0, 0); date.setDate(today.getDate() + index); return { key: date.toISOString().slice(0, 10), day: new Intl.DateTimeFormat('es-CO', { weekday: 'short' }).format(date).replace('.', ''), number: date.getDate() } })
}

type KitchenHistory = { id: number; starts_at: string; status: string }

export default function CocinaScreen({ go }: { go: (screen: Screen | 'back') => void }) {
  const days = useMemo(daysThisWeek, [])
  const [day, setDay] = useState(days[0].key)
  const [booked, setBooked] = useState<string[]>([])
  const [time, setTime] = useState<string | null>(null)
  const [history, setHistory] = useState<KitchenHistory[]>([])
  const [checked, setChecked] = useState<number[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  function loadHistory() { fetch(`${API}/api/kitchen/reservations`, { credentials: 'include' }).then((response) => response.json()).then((body) => setHistory(body.data ?? [])).catch(() => setHistory([])) }
  useEffect(() => { loadHistory() }, [])
  useEffect(() => { setLoading(true); setTime(null); fetch(`${API}/api/kitchen/availability?day=${day}`, { credentials: 'include' }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.detail); return body }).then((body) => setBooked(body.booked ?? [])).catch((reason) => setError(reason instanceof Error ? reason.message : 'No pudimos consultar horarios.')).finally(() => setLoading(false)) }, [day])

  async function reserve() {
    if (!time) { setError('Elegí una hora disponible.'); return }
    setSaving(true); setError('')
    const end = String(Number(time.slice(0, 2)) + 1).padStart(2, '0')
    try { const response = await fetch(`${API}/api/kitchen/reservations`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ machine_id: 0, starts_at: `${day}T${time}:00`, ends_at: `${day}T${end}:00:00` }) }); const body = await response.json(); if (!response.ok) throw new Error(body.detail ?? 'No pudimos reservar.'); setTime(null); loadHistory() } catch (reason) { setError(reason instanceof Error ? reason.message : 'No pudimos reservar.') } finally { setSaving(false) }
  }

  return <div className="px-5 pb-7"><header className="flex items-center justify-between py-3"><BackButton onClick={() => go('back')} /><div className="flex items-center gap-2"><span className="w-10 h-10 rounded-xl bg-[#FBE4DC] flex items-center justify-center"><CookingPot size={20} className="text-[#D8471A]" /></span><div><h1 className="text-[19px] font-extrabold text-slate-900">Cocina compartida</h1><p className="text-[10.5px] text-slate-500">Reservá un turno y dejala lista.</p></div></div><BellButton /></header>
    <Card className="mt-4 p-4"><div className="flex items-center gap-2"><span className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center"><Check size={18} className="text-green-600" /></span><div><p className="text-[13px] font-bold text-slate-900">Reserva tu turno</p><p className="text-[11px] text-slate-500">Máximo una hora. Horarios ocupados aparecen bloqueados.</p></div></div></Card>
    <section className="mt-5"><h2 className="text-[15px] font-extrabold text-slate-900">Elegí el día</h2><div className="grid grid-cols-7 gap-1.5 mt-2.5">{days.map((item) => <button key={item.key} onClick={() => setDay(item.key)} className={`h-14 rounded-xl ${day === item.key ? 'bg-[#D8471A] text-white' : 'bg-white border border-slate-100 text-slate-600'}`}><span className="block text-[9px] font-bold uppercase">{item.day}</span><strong className="block mt-1 text-[16px]">{item.number}</strong></button>)}</div></section>
    <section className="mt-5"><div className="flex items-center justify-between"><h2 className="text-[15px] font-extrabold text-slate-900">Elegí la hora</h2>{loading && <LoaderCircle size={15} className="animate-spin text-[#D8471A]" />}</div><div className="grid grid-cols-3 gap-2 mt-2.5">{HOURS.map((slot) => { const unavailable = booked.includes(slot); return <button key={slot} disabled={unavailable} onClick={() => setTime(slot)} className={`h-10 rounded-xl text-[12px] font-bold ${unavailable ? 'bg-slate-100 text-slate-400 line-through' : time === slot ? 'bg-[#D8471A] text-white' : 'bg-white border border-slate-100 text-slate-700'}`}>{slot}</button> })}</div></section>
    <Card className="mt-5 p-4"><div className="flex gap-3"><CalendarDays size={18} className="text-[#D8471A]" /><div><p className="text-[12px] font-bold text-slate-800">Tu turno</p><p className="mt-1 text-[11px] text-slate-500">{time ? `${day} · ${time}–${String(Number(time.slice(0,2)) + 1).padStart(2,'0')}:00` : 'Elegí una hora para continuar.'}</p></div></div></Card>
    {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-[12px] text-red-600">{error}</p>}
    <button onClick={reserve} disabled={!time || saving} className="mt-4 w-full h-11 rounded-xl bg-[#D8471A] text-[13px] font-bold text-white disabled:opacity-45">{saving ? 'Reservando…' : 'Confirmar turno'}</button>
    <section className="mt-6"><h2 className="text-[15px] font-extrabold text-slate-900">Antes de salir</h2><Card className="mt-2.5 divide-y divide-slate-100">{tasks.map((task, index) => <button key={task} onClick={() => setChecked((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])} className="w-full flex items-center gap-3 px-4 py-3 text-left"><span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${checked.includes(index) ? 'border-green-500 bg-green-500' : 'border-slate-300'}`}>{checked.includes(index) && <Check size={13} className="text-white" />}</span><span className={`text-[12px] font-medium ${checked.includes(index) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task}</span></button>)}</Card></section>
    <section className="mt-6"><h2 className="text-[15px] font-extrabold text-slate-900">Mi historial</h2><Card className="mt-2.5 divide-y divide-slate-100">{history.length === 0 ? <p className="p-4 text-[12px] text-slate-500">Todavía no tenés turnos de cocina.</p> : history.map((item) => <div key={item.id} className="p-3.5 flex justify-between"><span className="text-[12px] font-bold text-slate-800">{item.starts_at.slice(0, 16).replace('T',' · ')}</span><span className="text-[10px] font-bold text-green-600">Reservada</span></div>)}</Card></section>
  </div>
}

