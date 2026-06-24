import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ── Tiny dependency-free toast ──
   Fire from anywhere:  toast('message')
   Mount <Toaster /> once at the app root so toasts survive route changes. */

let listeners = [];
let seq = 0;

export function toast(message, { duration = 3500 } = {}) {
  const id = ++seq;
  listeners.forEach((fn) => fn({ id, message, duration }));
  return id;
}

export function Toaster() {
  const [items, setItems] = useState([]);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const onToast = (t) => {
      setItems((prev) => [...prev, t]);
      if (t.duration > 0) setTimeout(() => remove(t.id), t.duration);
    };
    listeners.push(onToast);
    return () => { listeners = listeners.filter((fn) => fn !== onToast); };
  }, [remove]);

  return (
    <div style={{
      position: 'fixed', top: 'max(1rem, env(safe-area-inset-top))', left: '50%', transform: 'translateX(-50%)',
      zIndex: 10000, display: 'flex', flexDirection: 'column', gap: '0.6rem',
      width: 'min(92vw, 390px)', pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            role="status"
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={() => remove(t.id)}
            style={{
              pointerEvents: 'auto', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.7rem',
              padding: '0.85rem 1.1rem', borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(35,84,244,0.97), rgba(124,58,237,0.97))',
              color: '#fff', fontSize: '0.88rem', fontWeight: 600,
              boxShadow: '0 12px 36px rgba(35,84,244,0.4)',
              border: '1px solid rgba(255,255,255,0.18)',
              WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ lineHeight: 1.4 }}>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
