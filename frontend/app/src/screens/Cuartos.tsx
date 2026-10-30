import { useState } from 'react'
import { MoreVertical, Check, Clock, CookingPot, WashingMachine, Minus, UserRound, Users, ClipboardList, Eye, UserPlus, Pencil, Building2 } from 'lucide-react'
import { Logo, BellButton, BackButton, Card } from '@/components/chrome'
import type { Screen } from '@/types'

const floorMeta = [
  { n: 1, color: '#D8471A', ocupadas: 7 },
  { n: 2, color: '#16A34A', ocupadas: 6 },
  { n: 3, color: '#EF4444', ocupadas: 5 },
  { n: 4, color: '#EAB308', ocupadas: 8 },
]

type RoomState = { ocupado: boolean; pago: 'ok' | 'pend' | 'na'; cocina: boolean; lav: boolean }
const rooms: Record<number, { num: number; state: RoomState }[]> = {
  1: [
    { num: 101, state: { ocupado: true, pago: 'ok', cocina: true, lav: true } },
    { num: 102, state: { ocupado: false, pago: 'na', cocina: false, lav: false } },
    { num: 103, state: { ocupado: true, pago: 'ok', cocina: true, lav: true } },
    { num: 104, state: { ocupado: true, pago: 'pend', cocina: true, lav: false } },
    { num: 105, state: { ocupado: false, pago: 'na', cocina: false, lav: false } },
    { num: 106, state: { ocupado: true, pago: 'ok', cocina: true, lav: true } },
    { num: 107, state: { ocupado: false, pago: 'na', cocina: false, lav: false } },
    { num: 108, state: { ocupado: true, pago: 'pend', cocina: true, lav: true } },
    { num: 109, state: { ocupado: true, pago: 'ok', cocina: true, lav: false } },
    { num: 110, state: { ocupado: false, pago: 'na', cocina: false, lav: false } },
  ],
  2: [], 3: [], 4: [],
}
// generate other floors from piso 1 pattern
for (const f of [2, 3, 4]) {
  rooms[f] = rooms[1].map((r) => ({ num: r.num + f * 100 - 100, state: r.state }))
}

function BuildingIllustration() {
  return (
    <svg viewBox="0 0 120 130" className="w-full h-auto">
      {/* tree */}
      <circle cx="18" cy="98" r="12" fill="#4ADE80" />
      <circle cx="12" cy="106" r="8" fill="#22C55E" />
      <rect x="16" y="106" width="4" height="14" rx="2" fill="#A16207" />
      {/* building body */}
      <rect x="34" y="14" width="72" height="106" rx="6" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="34" y="14" width="72" height="10" rx="5" fill="#E2E8F0" />
      {/* windows */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <rect key={`${row}-${col}`} x={42 + col * 22} y={32 + row * 20} width="14" height="12" rx="2" fill={row === 3 && col === 1 ? '#D8471A' : '#CBD5E1'} />
        ))
      )}
      {/* door */}
      <rect x="62" y="104" width="16" height="16" rx="2" fill="#94A3B8" />
      {/* shadow */}
      <ellipse cx="70" cy="124" rx="42" ry="4" fill="#E2E8F0" opacity="0.6" />
    </svg>
  )
}

export default function CuartosScreen({ go }: { go: (s: Screen | 'back') => void }) {
  const [floor, setFloor] = useState(1)
  const meta = floorMeta[floor - 1]

  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <BackButton onClick={() => go('back')} />
        <Logo />
        <BellButton />
      </div>

      <h1 className="text-[22px] font-extrabold text-slate-900 mt-3">Habitaciones y pisos</h1>
      <p className="text-[12px] text-slate-500">Administra los pisos y habitaciones del edificio</p>

      {/* Building + floors */}
      <Card className="mt-4 p-4 flex items-center gap-3">
        <div className="w-[86px] shrink-0">
          <BuildingIllustration />
        </div>
        <div className="grid grid-cols-4 gap-1.5 flex-1">
          {floorMeta.map((f) => (
            <button
              key={f.n}
              onClick={() => setFloor(f.n)}
              className={`rounded-xl border px-1.5 py-2 text-left ${floor === f.n ? 'border-slate-300 bg-slate-50' : 'border-slate-100'}`}
            >
              <span className="text-[7.5px] font-bold tracking-wide whitespace-nowrap" style={{ color: f.color }}>PISO {f.n}</span>
              <p className="text-[15px] font-extrabold text-slate-900 leading-tight">10</p>
              <p className="text-[7.5px] text-slate-500 whitespace-nowrap">habitaciones</p>
              <p className="text-[7.5px] font-semibold mt-0.5 whitespace-nowrap" style={{ color: f.color }}>{f.ocupadas} ocupadas</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Floor tabs */}
      <div className="flex gap-1.5 mt-4 bg-white rounded-full p-1.5 shadow-[0_1px_6px_rgba(15,23,42,0.05)]">
        {floorMeta.map((f) => (
          <button
            key={f.n}
            onClick={() => setFloor(f.n)}
            className={`flex-1 flex items-center justify-center gap-1 rounded-full py-2 text-[11px] font-semibold ${
              floor === f.n ? 'bg-[#FCE7DF] text-[#D8471A]' : 'text-slate-600'
            }`}
          >
            <Building2 size={13} style={{ color: f.color }} />
            Piso {f.n}
          </button>
        ))}
      </div>

      {/* Rooms */}
      <div className="flex items-center justify-between mt-4 mb-2.5">
        <h2 className="text-[14.5px] font-bold text-slate-900">Habitaciones - Piso {floor}</h2>
        <span className="text-[11px] text-slate-400">10 habitaciones</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {rooms[floor].map((r) => (
          <Card key={r.num} className="p-1.5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between px-0.5">
              <span className="text-[13px] font-extrabold text-slate-900">{r.num}</span>
              <MoreVertical size={11} className="text-slate-300" />
            </div>
            <span className={`flex items-center gap-0.5 text-[8px] font-semibold mt-1 ${r.state.ocupado ? 'text-[#D8471A]' : 'text-green-600'}`}>
              <UserRound size={9} fill="currentColor" />
              {r.state.ocupado ? 'Ocupado' : 'Disponible'}
            </span>
            <div className="flex items-center gap-1 mt-1.5">
              {r.state.pago === 'ok' && (
                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={9} className="text-white" strokeWidth={4} />
                </span>
              )}
              {r.state.pago === 'pend' && (
                <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                  <Clock size={9} className="text-white" strokeWidth={3} />
                </span>
              )}
              {r.state.pago === 'na' && (
                <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center">
                  <Minus size={9} className="text-slate-400" strokeWidth={3} />
                </span>
              )}
              <CookingPot size={13} className={r.state.cocina ? 'text-[#D8471A]' : 'text-slate-300'} />
              <WashingMachine size={13} className={r.state.lav ? 'text-violet-500' : 'text-slate-300'} />
            </div>
          </Card>
        ))}
      </div>

      {/* Leyenda */}
      <Card className="mt-4 p-3.5">
        <h3 className="text-[13px] font-bold text-slate-900 mb-2.5">Leyenda</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {[
            { icon: <UserRound size={12} className="text-[#D8471A]" fill="#D8471A" />, label: 'Ocupado' },
            { icon: <UserRound size={12} className="text-green-600" fill="#16A34A" />, label: 'Disponible' },
            { icon: <span className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center"><Check size={8} className="text-white" strokeWidth={4} /></span>, label: 'Pago al día' },
            { icon: <span className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center"><Clock size={8} className="text-white" strokeWidth={3} /></span>, label: 'Pago pendiente' },
            { icon: <CookingPot size={12} className="text-[#D8471A]" />, label: 'Cocina activa' },
            { icon: <WashingMachine size={12} className="text-violet-500" />, label: 'Lavandería activa' },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-[10.5px] text-slate-600 font-medium">
              {l.icon} {l.label}
            </span>
          ))}
        </div>
      </Card>

      {/* Resumen */}
      <Card className="mt-3 p-4">
        <h3 className="text-[13.5px] font-bold text-slate-900 mb-3">Resumen - Piso {floor}</h3>
        <div className="flex items-center justify-around divide-x divide-slate-100">
          {[
            { icon: Users, n: String(meta.ocupadas), label: 'Habitaciones ocupadas', tint: 'bg-[#FBE4DC] text-[#D8471A]' },
            { icon: Check, n: '5', label: 'Pagos al día', tint: 'bg-green-100 text-green-600' },
            { icon: ClipboardList, n: '2', label: 'Solicitudes activas', tint: 'bg-violet-100 text-violet-600' },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="flex flex-col items-center text-center flex-1 px-1">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center ${s.tint}`}>
                  <Icon size={17} />
                </span>
                <span className="text-[20px] font-extrabold text-slate-900 mt-1.5 leading-none">{s.n}</span>
                <span className="text-[9.5px] text-slate-500 mt-1 leading-tight">{s.label}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Acciones rápidas */}
      <h3 className="text-[14.5px] font-bold text-slate-900 mt-5 mb-2.5">Acciones rápidas</h3>
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Eye, title: 'Ver detalle', sub: 'Ver información del piso', tint: 'bg-[#FBE4DC] text-[#D8471A]' },
          { icon: UserPlus, title: 'Asignar residente', sub: 'Asignar un residente a una habitación', tint: 'bg-green-100 text-green-600' },
          { icon: Pencil, title: 'Editar cuarto', sub: 'Editar información del cuarto', tint: 'bg-amber-100 text-amber-500' },
        ].map((a) => {
          const Icon = a.icon
          return (
            <Card key={a.title} className="p-3">
              <button className="w-full text-left flex flex-col items-start">
                <span className={`w-9 h-9 rounded-full flex items-center justify-center ${a.tint}`}>
                  <Icon size={16} />
                </span>
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
