'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'radial-gradient(circle at 20% 20%, rgba(194,145,93,0.10) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(82,106,104,0.08) 0%, transparent 50%), #f7f1e7',
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="eyebrow mb-2">Organic Search Ops</p>
          <h1
            className="font-display text-6xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--petrol)' }}
          >
            NOCTUA
          </h1>
          <p className="text-tweed text-sm">
            Transformez vos signaux SEO/GEO en roadmap priorisée.
          </p>
        </div>

        <div className="card p-8 space-y-6">
          {sent ? (
            <div className="text-center space-y-3">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-2"
                style={{ background: 'var(--petrol-light)' }}
              >
                <Mail size={24} style={{ color: 'var(--petrol)' }} />
              </div>
              <h2 className="font-display text-2xl font-semibold" style={{ color: 'var(--petrol-deep)' }}>
                Vérifiez vos emails
              </h2>
              <p className="text-sm" style={{ color: 'var(--tweed)' }}>
                Un lien de connexion a été envoyé à <strong style={{ color: 'var(--ink)' }}>{email}</strong>.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="text-sm font-medium"
                style={{ color: 'var(--copper)' }}
              >
                Utiliser un autre email
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border font-medium text-sm transition-colors hover:bg-paper-deep"
                style={{ borderColor: 'var(--line)', color: 'var(--ink)', background: 'var(--paper-cream)' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continuer avec Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'var(--line)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--tweed)' }}>ou</span>
                <div className="flex-1 h-px" style={{ background: 'var(--line)' }} />
              </div>

              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--tweed)' }}>
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="vous@domaine.com"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--paper-cream)',
                      borderColor: 'var(--line)',
                      color: 'var(--ink)',
                    }}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                  style={{ background: 'var(--petrol)', color: 'var(--paper-cream)' }}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      Envoyer le lien magique
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--tweed)' }}>
          Noctua · Organic Search Ops · MVP v0.1
        </p>
      </div>
    </div>
  )
}
