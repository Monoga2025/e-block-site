import { Home, LayoutGrid, Wallet, BedDouble, UserRound } from 'lucide-react'
import type { AppRole, Screen } from '@/types'

export function Logo() {
  return <div className="flex items-center gap-2" aria-label="E-block"><span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#D8471A]"><img src="/eblock-mark-white.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" /></span><div className="leading-none"><div className="text-[19px] font-extrabold text-slate-900 tracking-tight">E-block</div><div className="mt-0.5 text-[8.5px] font-semibold tracking-[0.35em] text-slate-500">EDIFICIO</div></div></div>
}

const avatarBg: Record<string, string> = { Diana: 'e3ecfd', Carlos: 'fde8d8', Maria: 'ffe3ec', Juan: 'e0f5e9', Laura: 'f3e8fd', Andres: 'fff3d6', Valentina: 'e0f2fe', Diego: 'e8f0fe', Sofia: 'fce7f3' }
export function Avatar({ seed, size = 56, className = '' }: { seed: string; size?: number; className?: string }) {
  const bg = avatarBg[seed] ?? 'e8f0fe'
  return <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=${bg}`} alt={seed} width={size} height={size} className={`rounded-full object-cover ${className}`} style={{ width: size, height: size }} />
}

const tabs: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Inicio', icon: Home }, { id: 'servicios', label: 'Servicios', icon: LayoutGrid }, { id: 'pagos', label: 'Pagos', icon: Wallet }, { id: 'cuartos', label: 'Cuartos', icon: BedDouble }, { id: 'admin', label: 'Admin', icon: UserRound },
]
export function BottomNav({ active, onNavigate, role }: { active: Screen; onNavigate: (s: Screen) => void; role: AppRole }) {
  return <div className="eblock-bottom-nav sticky bottom-0 z-50 border-t px-2 pb-3 pt-2 backdrop-blur-sm"><div className="flex items-center justify-around">{tabs.filter((tab) => role === 'ADMINISTRADOR' || !['cuartos', 'admin'].includes(tab.id)).map((tab) => { const Icon = tab.icon; const isActive = active === tab.id; return <button key={tab.id} onClick={() => onNavigate(tab.id)} className="eblock-tab flex w-14 flex-col items-center gap-0.5 rounded-xl"><Icon size={21} strokeWidth={isActive ? 2.4 : 2} className={isActive ? 'text-[#D8471A]' : 'text-slate-400'} /><span className={`text-[10px] ${isActive ? 'font-semibold text-[#D8471A]' : 'font-medium text-slate-400'}`}>{tab.label}</span><span className={`mt-0.5 h-[3px] w-6 rounded-full ${isActive ? 'bg-[#D8471A]' : 'bg-transparent'}`} /></button> })}</div></div>
}

export function BellButton() {
  return <button type="button" disabled title="Notificaciones próximamente" aria-label="Notificaciones próximamente" className="eblock-icon-button relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg><span className="absolute right-3 top-2.5 h-2 w-2 rounded-full border border-[var(--eblock-surface-raised)] bg-[#D8471A]" /></button>
}
export function BackButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} aria-label="Volver" className="eblock-icon-button flex h-11 w-11 shrink-0 items-center justify-center rounded-full"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button>
}
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <div className={`eblock-card rounded-[18px] ${className}`}>{children}</div> }
