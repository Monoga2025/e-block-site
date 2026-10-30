import { useState } from 'react'
import type { FormEvent } from 'react'
import { UserRound } from 'lucide-react'
import { Logo } from '@/components/chrome'
import type { SessionUser } from '@/types'

const API = import.meta.env.VITE_API_URL ?? ''

export default function LoginScreen({ onAuthenticated }: { onAuthenticated: (user: SessionUser) => void }) {
  const [cedula, setCedula] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cedula }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.detail ?? 'No pudimos ingresar.')
      onAuthenticated(body.user)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No pudimos ingresar.')
    } finally { setLoading(false) }
  }

  return <main className="eblock-theme min-h-[100dvh] px-5 py-8 flex flex-col bg-[#32150F]">
    <div className="pt-7"><Logo /></div>
    <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
      <span className="w-12 h-12 rounded-2xl bg-[#FBE4DC] text-[#D8471A] flex items-center justify-center mb-5"><UserRound size={23} /></span>
      <h1 className="text-[27px] leading-tight font-extrabold text-slate-900">Entrá a tu Eblock</h1>
      <p className="text-[13px] text-slate-500 mt-2">Ingresá tu cédula para consultar tu arriendo y servicios.</p>
      <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
        <label className="block text-[12px] font-bold text-slate-700">Cédula
          <input value={cedula} onChange={(event) => setCedula(event.target.value.replace(/\D/g, ''))} inputMode="numeric" autoComplete="username" placeholder="Tu número de cédula" className="mt-1.5 w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[14px] outline-none focus:border-[#D8471A] focus:ring-2 focus:ring-[#FBE4DC]" />
        </label>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-[12px] font-medium text-red-600">{error}</p>}
        <button disabled={loading} className="w-full h-11 rounded-xl bg-[#D8471A] text-[13px] font-bold text-white shadow-[0_5px_14px_rgba(216,71,26,0.26)] disabled:opacity-60">{loading ? 'Ingresando…' : 'Ingresar'}</button>
      </form>
    </div>
    <p className="text-center text-[11px] text-slate-400">Tu sesión queda guardada en este dispositivo.</p>
  </main>
}
