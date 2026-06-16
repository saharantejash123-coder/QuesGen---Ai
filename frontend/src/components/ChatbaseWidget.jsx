import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

const CHATBOT_ID = '8reY9mRYpNkJdMgGdCZAr';

export default function ChatbaseWidget() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  /* ── Load ChatBase script, hide their default button ── */
  useEffect(() => {
    window.chatbaseConfig = { chatbotId: CHATBOT_ID };

    if (!document.getElementById(CHATBOT_ID)) {
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.id = CHATBOT_ID;
      script.defer = true;
      document.body.appendChild(script);
    }

    /* Inject CSS to hide ChatBase's own floating button */
    if (!document.getElementById('chatbase-hide-btn')) {
      const style = document.createElement('style');
      style.id = 'chatbase-hide-btn';
      style.textContent = `#chatbase-bubble-button { display: none !important; }`;
      document.head.appendChild(style);
    }
  }, []);

  /* ── Sync open state with ChatBase window ── */
  const toggle = () => {
    const next = !open;
    setOpen(next);
    try {
      if (next) window.chatbase?.('open');
      else window.chatbase?.('close');
    } catch (_) {}
  };

  /* Position: above mobile bottom nav on dashboards, normal on desktop/landing */
  const bottom = isMobile
    ? 'calc(env(safe-area-inset-bottom, 0px) + 88px)'
    : '24px';

  return (
    <>
      {/* Custom trigger button — QuesGen logo */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.88 }}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          bottom,
          right: '1.25rem',
          zIndex: 600,
          width: 56, height: 56,
          borderRadius: '50%',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          overflow: 'hidden',
          background: 'transparent',
          boxShadow: open
            ? '0 8px 32px rgba(35,84,244,0.45), 0 2px 8px rgba(0,0,0,0.18)'
            : '0 6px 24px rgba(35,84,244,0.32), 0 2px 8px rgba(0,0,0,0.14)',
          transition: 'box-shadow 0.25s ease',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0,   opacity: 1, scale: 1 }}
              exit={{    rotate:  90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.22 }}
              style={{
                width: '100%', height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2354F4, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={22} color="#fff" strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0,  opacity: 1, scale: 1 }}
              exit={{    rotate: -90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.22 }}
              style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}
            >
              <img
                src="/logo.png"
                alt="QuesGen chat"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Unread dot — shows when chat is closed */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: 'fixed',
              bottom: `calc(${bottom} + 38px)`,
              right: '1.25rem',
              zIndex: 601,
              width: 12, height: 12,
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid var(--bg)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
