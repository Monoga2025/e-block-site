import { ChefHat, WashingMachine, ChevronRight, Check, CookingPot, CalendarDays } from 'lucide-react'
import { Logo, BellButton, Card } from '@/components/chrome'
import type { Screen } from '@/types'

export default function ServiciosScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="px-5 pb-6">
      <div className="flex items-center justify-between py-3">
        <span className="w-11" />
        <Logo />
        <BellButton />
      </div>

      <h1 className="text-[22px] font-extrabold text-slate-900 mt-3">Servicios</h1>
      <p className="text-[12px] text-slate-500">Gestiona los servicios compartidos del edificio</p>

      <div className="space-y-3 mt-5">
        {/* Cocina */}
        <Card className="p-4">
          <button onClick={() => go('cocina')} className="w-full text-left">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#FBE4DC] flex items-center justify-center">
                <ChefHat size={22} className="text-[#D8471A]" />
              </span>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-slate-900">Cocina compartida</p>
                <p className="text-[11px] text-slate-500">Reserva de turnos y checklist de limpieza</p>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-green-50 rounded-xl px-2.5 py-2 text-center">
                <Check size={13} className="text-green-600 mx-auto" strokeWidth={3} />
                <p className="text-[10px] font-bold text-green-600 mt-0.5">Libre</p>
              </div>
              <div className="bg-amber-50 rounded-xl px-2.5 py-2 text-center">
                <CookingPot size={13} className="text-amber-500 mx-auto" />
                <p className="text-[10px] font-bold text-amber-500 mt-0.5">En uso</p>
              </div>
              <div className="bg-violet-50 rounded-xl px-2.5 py-2 text-center">
                <CalendarDays size={13} className="text-violet-500 mx-auto" />
                <p className="text-[10px] font-bold text-violet-600 mt-0.5">6 turnos hoy</p>
              </div>
            </div>
          </button>
        </Card>

        {/* Lavandería */}
        <Card className="p-4">
          <button onClick={() => go('lavanderia')} className="w-full text-left">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                <WashingMachine size={22} className="text-violet-600" />
              </span>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-slate-900">Lavandería</p>
                <p className="text-[11px] text-slate-500">Servicio de lavado y secado · $10.000 por lavada</p>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { name: 'Lavadora 1', ok: true },
                { name: 'Lavadora 2', ok: true },
                { name: 'Secadora', ok: false },
              ].map((m) => (
                <div key={m.name} className="bg-slate-50 rounded-xl px-2.5 py-2 text-center">
                  <p className="text-[10px] font-bold text-slate-700">{m.name}</p>
                  <p className={`flex items-center justify-center gap-1 text-[9px] font-semibold mt-0.5 ${m.ok ? 'text-green-600' : 'text-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${m.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                    {m.ok ? 'Disponible' : 'Ocupada'}
                  </p>
                </div>
              ))}
            </div>
          </button>
        </Card>
      </div>
    </div>
  )
}
