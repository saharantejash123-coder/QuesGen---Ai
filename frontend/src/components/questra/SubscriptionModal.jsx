import React, { useState } from 'react';
import { X, CheckCircle, Clock, AlertTriangle, QrCode, Sparkles } from 'lucide-react';

const DEMO_KEY = 'questra_demo_4d';
const DEMO_DAYS = 4;

function getDemoInfo() {
  const raw = localStorage.getItem(DEMO_KEY);
  if (!raw) return null;
  const start = parseInt(raw, 10);
  const elapsed = Date.now() - start;
  const msLeft = DEMO_DAYS * 86400000 - elapsed;
  return {
    start,
    remainingDays: Math.max(0, Math.ceil(msLeft / 86400000)),
    remainingHours: Math.max(0, Math.floor(msLeft / 3600000)),
    expired: msLeft <= 0,
  };
}

function startDemo() {
  localStorage.setItem(DEMO_KEY, String(Date.now()));
}

function DemoQR() {
  const size = 180;
  const cells = [];
  const pattern = [
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
  ];
  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      if (pattern[r][c]) cells.push({ r, c });
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${pattern.length} ${pattern.length}`} style={{ display: 'block', margin: '0 auto' }}>
      <rect width={pattern.length} height={pattern.length} fill="#fff" rx="2"/>
      {cells.map(({ r, c }) => (
        <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#111"/>
      ))}
    </svg>
  );
}

export default function SubscriptionModal({ planName, planPrice, onClose }) {
  const [step, setStep] = useState('choose');
  const [info, setInfo] = useState(getDemoInfo);

  const handleDemo = () => {
    if (!info) {
      startDemo();
      setInfo(getDemoInfo());
    }
    setStep('demo');
  };

  const remainingText = info && !info.expired
    ? info.remainingDays > 0
      ? `${info.remainingDays} day${info.remainingDays > 1 ? 's' : ''} remaining`
      : `${info.remainingHours} hour${info.remainingHours > 1 ? 's' : ''} remaining`
    : '';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      padding: '1rem',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--card-bg)', borderRadius: 24, padding: '2rem',
        maxWidth: 420, width: '100%', position: 'relative',
        border: '1px solid var(--border)', boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12, background: 'var(--bg3)',
          border: 'none', cursor: 'pointer', width: 32, height: 32,
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'var(--text3)',
        }}><X size={16}/></button>

        {step === 'choose' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(35,84,244,.12), rgba(124,58,237,.08))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}><Sparkles size={28} style={{ color: '#7C3AED' }}/></div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.3rem' }}>
                {planName}
              </h3>
              <p style={{ fontSize: '.85rem', color: 'var(--text3)' }}>
                {planPrice} · Choose your access
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              <button onClick={handleDemo} style={{
                display: 'flex', alignItems: 'center', gap: '.85rem',
                padding: '1.1rem', borderRadius: 16, cursor: 'pointer',
                border: '1px solid var(--border)', background: 'var(--bg2)',
                textAlign: 'left', transition: 'all .2s',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(16,185,129,.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}><Clock size={22} style={{ color: '#10B981' }}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.15rem' }}>
                    Free Demo — {DEMO_DAYS} Days
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text3)' }}>
                    {info ? (info.expired ? 'Demo period has ended on this device' : remainingText) : 'Full access, no payment needed'}
                  </div>
                </div>
              </button>

              <button onClick={() => setStep('qr')} style={{
                display: 'flex', alignItems: 'center', gap: '.85rem',
                padding: '1.1rem', borderRadius: 16, cursor: 'pointer',
                border: '1px solid var(--border)', background: 'var(--bg2)',
                textAlign: 'left', transition: 'all .2s',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(35,84,244,.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}><QrCode size={22} style={{ color: '#2354F4' }}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.15rem' }}>
                    Pay Now — {planPrice}
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text3)' }}>
                    Scan & pay via UPI / Card / NetBanking
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'demo' && (
          <div style={{ textAlign: 'center' }}>
            {info && !info.expired ? (
              <>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(16,185,129,.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}><CheckCircle size={32} style={{ color: '#10B981' }}/></div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.3rem' }}>
                  Demo Activated
                </h3>
                <p style={{ fontSize: '.85rem', color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  You have {remainingText} of full {planName} access on this device.
                </p>
                <div style={{
                  background: 'var(--bg3)', borderRadius: 12, padding: '.75rem 1rem',
                  display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                  fontSize: '.75rem', color: 'var(--text3)',
                }}>
                  <Clock size={14}/> One-time {DEMO_DAYS}-day demo per device
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(239,68,68,.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}><AlertTriangle size={32} style={{ color: '#EF4444' }}/></div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.3rem' }}>
                  Demo Ended
                </h3>
                <p style={{ fontSize: '.85rem', color: 'var(--text2)', marginBottom: '1rem' }}>
                  Your 4-day demo has expired on this device. Subscribe to continue.
                </p>
              </>
            )}
            <button onClick={onClose} className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
              Got it
            </button>
          </div>
        )}

        {step === 'qr' && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.3rem' }}>
              Pay {planPrice}
            </h3>
            <p style={{ fontSize: '.85rem', color: 'var(--text3)', marginBottom: '1.5rem' }}>
              Scan with any UPI app to complete payment
            </p>
            <div style={{
              display: 'inline-block', padding: '1rem',
              background: '#fff', borderRadius: 16,
              border: '1px solid var(--border)',
              marginBottom: '1rem',
            }}>
              <DemoQR/>
            </div>
            <p style={{ fontSize: '.72rem', color: 'var(--text3)', marginBottom: '1.5rem' }}>
              Demo QR · No real payment processed
            </p>
            <button onClick={onClose} className="btn-g" style={{ width: '100%', justifyContent: 'center' }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
