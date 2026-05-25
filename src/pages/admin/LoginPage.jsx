import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

export default function LoginPage() {
  const { signIn, role } = useAuth()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      // La redirección la maneja AppRouter según el rol
      // pero forzamos aquí por si el usuario ya tenía sesión
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex">

      {/* ── Panel izquierdo — branding ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-105 bg-bg-sidebar p-12"
        style={{ borderRight: '1px solid var(--color-line)' }}
      >
        {/* Logo */}
        <div>
          <div
            className="inline-block text-white text-xs font-display font-bold tracking-widest px-2 py-1 mb-5"
            style={{ background: 'var(--color-toyota)', borderRadius: 2 }}
          >
            AGENCIA OFICIAL
          </div>
          <h1 className="font-display text-4xl font-bold text-ink leading-tight tracking-wide">
            TOYOTA<br />LEADS
          </h1>
          <p className="text-ink-muted text-sm mt-3">
            Sistema de gestión de prospectos
          </p>
        </div>

        {/* Stats decorativos */}
        <div className="space-y-4">
          {[
            { label: 'Prospectos activos', value: '47' },
            { label: 'Citas esta semana',  value: '12' },
            { label: 'Asesores en línea',  value: '6'  },
          ].map(s => (
            <div
              key={s.label}
              className="flex items-center justify-between p-4"
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: 8,
                border: '1px solid var(--color-line)',
              }}
            >
              <span className="text-ink-muted text-sm">{s.label}</span>
              <span className="font-display font-bold text-xl text-ink">{s.value}</span>
            </div>
          ))}
        </div>

        <p className="text-ink-muted text-xs">
          © {new Date().getFullYear()} Automotriz Toyota — Acapulco
        </p>
      </div>

      {/* ── Panel derecho — formulario ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Header móvil */}
          <div className="lg:hidden mb-8 text-center">
            <div
              className="inline-block text-white text-xs font-display font-bold tracking-widest px-2 py-1 mb-3"
              style={{ background: 'var(--color-toyota)', borderRadius: 2 }}
            >
              AGENCIA OFICIAL
            </div>
            <h1 className="font-display text-3xl font-bold text-ink tracking-wide">
              TOYOTA LEADS
            </h1>
          </div>

          <h2 className="text-ink text-xl font-semibold mb-1">
            Iniciar sesión
          </h2>
          <p className="text-ink-muted text-sm mb-8">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-ink-muted text-xs font-medium tracking-wide uppercase">
                Correo electrónico
              </label>
              <input
                type="email"
                className="input"
                placeholder="usuario@toyota.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-ink-muted text-xs font-medium tracking-wide uppercase">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                className="text-sm px-3 py-2 rounded-md"
                style={{
                  background: 'rgb(235 10 30 / 0.08)',
                  color: 'var(--color-toyota)',
                  border: '1px solid rgb(235 10 30 / 0.2)',
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Spinner /> Ingresando...</>
                : 'Ingresar'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

/* ── Íconos inline pequeños ── */
function Eye() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
function EyeOff() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}
function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )
}