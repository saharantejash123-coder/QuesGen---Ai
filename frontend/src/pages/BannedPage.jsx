import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ban, Send, Clock, CheckCircle, XCircle } from 'lucide-react'
import { getActiveBan, getAppealForBan, submitAppeal } from '../services/adminService'

export default function BannedPage() {
  const navigate  = useNavigate()
  const [ban,     setBan]     = useState(null)
  const [appeal,  setAppeal]  = useState(null)
  const [text,    setText]    = useState('')
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('questra_user')
    if (!raw) { navigate('/login'); return }
    try {
      const user    = JSON.parse(raw)
      const activeBan = getActiveBan(user.email)
      if (!activeBan) { navigate('/student'); return }
      setBan(activeBan)
      setAppeal(getAppealForBan(activeBan.id))
    } catch { navigate('/login') }
  }, [navigate])

  // Listen for appeal approval in real-time (cross-tab)
  useEffect(() => {
    const check = () => {
      if (!ban) return
      const updated = getAppealForBan(ban.id)
      setAppeal(updated)
      if (updated?.status === 'approved') {
        // Ban was lifted — let them log back in
      }
    }
    window.addEventListener('storage', check)
    return () => window.removeEventListener('storage', check)
  }, [ban])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ban) return
    const res = submitAppeal(ban, text)
    if (res.error) { setError(res.error); return }
    setAppeal(getAppealForBan(ban.id))
    setDone(true)
  }

  const logout = () => {
    localStorage.removeItem('questra_user')
    localStorage.removeItem('questra_token')
    navigate('/login')
  }

  if (!ban) return null

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 480, width: '100%' }}>

        {/* Icon + Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 76, height: 76, borderRadius: 24, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Ban style={{ width: 34, height: 34, color: '#ef4444' }} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Account Suspended</h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            Your QuesGen AI account has been suspended by a platform administrator.
          </p>
        </div>

        {/* Ban Details */}
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(239,68,68,0.6)', marginBottom: '0.6rem' }}>
            Reason for Suspension
          </p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6 }}>{ban.reason}</p>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(239,68,68,0.15)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>By: {ban.bannedBy}</span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{fmt(ban.bannedAt)}</span>
          </div>
        </div>

        {/* Appeal Section */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '1.25rem' }}>

          {/* No appeal yet */}
          {!appeal && !done && (
            <>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Submit an Appeal</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Believe this was a mistake? Explain your case — our admin team reviews appeals within 24–48 hours.
              </p>
              {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{error}</p>}
              <form onSubmit={handleSubmit}>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  required
                  rows={4}
                  placeholder="Explain clearly why your account should be restored..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.875rem 1rem', color: '#fff', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' }}
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  style={{ width: '100%', padding: '0.875rem', borderRadius: 12, background: text.trim() ? 'linear-gradient(135deg,#2354F4,#7c3aed)' : 'rgba(255,255,255,0.05)', border: 'none', color: text.trim() ? '#fff' : 'rgba(255,255,255,0.2)', fontWeight: 700, fontSize: '0.875rem', cursor: text.trim() ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Send style={{ width: 15, height: 15 }} /> Submit Appeal
                </button>
              </form>
            </>
          )}

          {/* Pending */}
          {(done || appeal?.status === 'pending') && (
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <Clock style={{ width: 32, height: 32, color: '#f59e0b', margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>Appeal Under Review</p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                Your appeal has been submitted. Our admin team will respond within 24–48 hours.
                <br />Check back here or refresh this page for updates.
              </p>
            </div>
          )}

          {/* Approved */}
          {appeal?.status === 'approved' && (
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <CheckCircle style={{ width: 32, height: 32, color: '#10b981', margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', marginBottom: '0.4rem' }}>Appeal Approved!</p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>
                Your account has been restored. Sign in to continue.
              </p>
              <button onClick={logout} style={{ padding: '0.75rem 2rem', borderRadius: 12, background: '#10b981', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Sign Back In
              </button>
            </div>
          )}

          {/* Rejected */}
          {appeal?.status === 'rejected' && (
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <XCircle style={{ width: 32, height: 32, color: '#ef4444', margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.4rem' }}>Appeal Rejected</p>
              {appeal.adminNote && (
                <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: '0.875rem', marginBottom: '0.75rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(239,68,68,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Admin Note</p>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{appeal.adminNote}</p>
                </div>
              )}
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                If you believe this is wrong, contact platform support.
              </p>
            </div>
          )}
        </div>

        <button onClick={logout} style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
