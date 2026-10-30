import { useEffect, useState } from 'react'
import { BottomNav } from '@/components/chrome'
import HomeScreen from '@/screens/Home'
import ResidentHomeScreen from '@/screens/ResidentHome'
import LoginScreen from '@/screens/Login'
import ServiciosScreen from '@/screens/Servicios'
import CocinaScreen from '@/screens/Cocina'
import LavanderiaScreen from '@/screens/Lavanderia'
import PagosScreen from '@/screens/Pagos'
import ResidentPaymentsScreen from '@/screens/ResidentPayments'
import CuartosScreen from '@/screens/Cuartos'
import AdminScreen from '@/screens/Admin'
import type { NavigationTarget, Screen, SessionUser } from '@/types'

const API = import.meta.env.VITE_API_URL ?? ''

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [user, setUser] = useState<SessionUser | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [, setHistory] = useState<Screen[]>([])

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: 'include' }).then(async (response) => response.ok ? response.json() : null).then((body) => { if (body?.user) setUser(body.user) }).finally(() => setCheckingSession(false))
  }, [])

  const go = (next: NavigationTarget) => {
    if (next === 'back') {
      setHistory((previous) => {
        const nextHistory = previous.slice(0, -1)
        setScreen(nextHistory.at(-1) ?? 'home')
        return nextHistory
      })
    } else {
      setHistory((previous) => [...previous, next])
      setScreen(next)
    }
    window.scrollTo({ top: 0 })
  }
  const onAuthenticated = (nextUser: SessionUser) => { setUser(nextUser); go('home') }
  const onLogout = async () => { await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' }); setUser(null); setScreen('home') }
  const tabFor: Record<Screen, Screen> = { home: 'home', servicios: 'servicios', cocina: 'servicios', lavanderia: 'servicios', pagos: 'pagos', cuartos: 'cuartos', admin: 'admin' }
  const showNav = screen !== 'cocina' && screen !== 'lavanderia'

  if (checkingSession) return <div className="eblock-theme flex min-h-[100dvh] items-center justify-center text-[13px] font-semibold text-slate-500">Cargando Eblock…</div>
  if (!user) return <LoginScreen onAuthenticated={onAuthenticated} />

  return <div className="eblock-theme flex min-h-[100dvh] justify-center font-[Inter]"><div className="eblock-shell relative flex min-h-[100dvh] w-full flex-col overflow-hidden sm:my-4 sm:min-h-[calc(100dvh-2rem)] sm:max-w-[480px] sm:rounded-[28px] sm:shadow-[0_18px_52px_rgba(0,0,0,0.32)]"><div key={`${user.role}-${screen}`} className="flex-1 eblock-screen">
    {user.role === 'ADMINISTRADOR' && screen === 'home' && <HomeScreen go={go} />}
    {user.role === 'RESIDENTE' && screen === 'home' && <ResidentHomeScreen user={user} go={go} onLogout={onLogout} />}
    {screen === 'servicios' && <ServiciosScreen go={go} />}
    {screen === 'cocina' && <CocinaScreen go={go} />}
    {screen === 'lavanderia' && <LavanderiaScreen go={go} role={user.role} />}
    {user.role === 'ADMINISTRADOR' && screen === 'pagos' && <PagosScreen go={go} />}
    {user.role === 'RESIDENTE' && screen === 'pagos' && <ResidentPaymentsScreen go={go} />}
    {user.role === 'ADMINISTRADOR' && screen === 'cuartos' && <CuartosScreen go={go} />}
    {user.role === 'ADMINISTRADOR' && screen === 'admin' && <AdminScreen go={go} />}
  </div>{showNav && <BottomNav active={tabFor[screen]} onNavigate={go} role={user.role} />}</div></div>
}



