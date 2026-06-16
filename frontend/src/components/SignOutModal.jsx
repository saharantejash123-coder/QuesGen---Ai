import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

export default function SignOutModal({ isOpen, onConfirm, onCancel, userName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            style={{
              position: 'fixed', inset: 0, zIndex: 9000,
              background: 'rgba(0,0,0,0.52)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9001,
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 24,
              padding: '2rem 2rem 1.75rem',
              width: 'min(420px, calc(100vw - 2rem))',
              boxShadow: '0 40px 100px rgba(0,0,0,0.28), 0 8px 30px rgba(0,0,0,0.12)',
            }}
          >
            <button
              onClick={onCancel}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: 9,
                border: '1px solid var(--border)', background: 'var(--bg3)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text3)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg3)'}
            >
              <X size={15} />
            </button>

            <div style={{
              width: 58, height: 58, borderRadius: 18,
              background: 'rgba(239,68,68,0.1)',
              border: '1.5px solid rgba(239,68,68,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.3rem',
            }}>
              <LogOut size={26} color="#ef4444" />
            </div>

            <h2 style={{
              fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)',
              marginBottom: '0.55rem', letterSpacing: '-0.02em',
            }}>
              Sign out?
            </h2>

            <p style={{
              fontSize: '0.92rem', color: 'var(--text3)',
              lineHeight: 1.7, marginBottom: '1.8rem',
            }}>
              {userName
                ? <>You are signed in as <strong style={{ color: 'var(--text2)', fontWeight: 700 }}>{userName}</strong>.<br />Are you sure you want to sign out?</>
                : 'Are you sure you want to sign out of QuesGen?'
              }
            </p>

            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button
                onClick={onCancel}
                style={{
                  flex: 1, padding: '0.8rem',
                  borderRadius: 13, border: '1.5px solid var(--border)',
                  background: 'transparent', color: 'var(--text)',
                  fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Stay Logged In
              </button>
              <button
                onClick={onConfirm}
                style={{
                  flex: 1, padding: '0.8rem',
                  borderRadius: 13, border: 'none',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  boxShadow: '0 4px 18px rgba(239,68,68,0.32)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(239,68,68,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(239,68,68,0.32)'; }}
              >
                <LogOut size={15} /> Yes, Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
