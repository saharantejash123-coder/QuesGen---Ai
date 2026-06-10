import { useState } from 'react'
import { Shuffle, RefreshCw, BookOpen, CheckCircle, Lightbulb, ArrowRight } from 'lucide-react'

const originalQuestions = [
  { id: 1, subject: 'Mathematics', chapter: 'Trigonometry', year: 'CBSE 2023', original: 'If sin(A + B) = 1 and cos(A - B) = √3/2, find the values of A and B where 0° ≤ A, B ≤ 90°.', variants: ['If cos(P + Q) = 0 and sin(P - Q) = 1/2, find the values of P and Q where 0° ≤ P, Q ≤ 90°.', 'If tan(X + Y) = √3 and sin(X - Y) = √2/2, find the values of X and Y where 0° ≤ X, Y ≤ 90°.', 'If sin(M + N) = √3/2 and cos(M - N) = 1, find the values of M and N where 0° ≤ M, N ≤ 90°.'], hint: 'Use standard angle values and solve the system of equations.', difficulty: 'Medium' },
  { id: 2, subject: 'Physics', chapter: 'Kinematics', year: 'CBSE 2022', original: 'A ball is thrown vertically upward with a velocity of 20 m/s from the top of a building 25 m high. Find the time it takes to reach the ground. (g = 10 m/s²)', variants: ['A stone is thrown vertically upward with a velocity of 30 m/s from the top of a cliff 45 m high. Calculate the time it takes to reach the base. (g = 10 m/s²)', 'A ball is projected upward at 15 m/s from a tower 20 m tall. Determine when the ball hits the ground. (g = 9.8 m/s²)', 'An object is launched vertically upward at 25 m/s from a platform 30 m above the ground. Find the total time of flight. (g = 10 m/s²)'], hint: 'Use s = ut + ½gt² with appropriate sign conventions.', difficulty: 'Medium' },
  { id: 3, subject: 'Chemistry', chapter: 'Electrochemistry', year: 'CBSE 2023', original: 'Calculate the EMF of the cell: Mg(s) | Mg²⁺(0.001M) || Cu²⁺(0.01M) | Cu(s). Given E°(Mg²⁺/Mg) = -2.37V, E°(Cu²⁺/Cu) = +0.34V.', variants: ['Calculate the EMF of the cell: Zn(s) | Zn²⁺(0.1M) || Ag⁺(0.01M) | Ag(s). Given E°(Zn²⁺/Zn) = -0.76V, E°(Ag⁺/Ag) = +0.80V.', 'Find the cell potential: Fe(s) | Fe²⁺(0.01M) || Cu²⁺(0.1M) | Cu(s). Given E°(Fe²⁺/Fe) = -0.44V, E°(Cu²⁺/Cu) = +0.34V.', 'Determine the EMF: Al(s) | Al³⁺(0.001M) || Ni²⁺(0.1M) | Ni(s). Given E°(Al³⁺/Al) = -1.66V, E°(Ni²⁺/Ni) = -0.25V.'], hint: 'Apply the Nernst equation: E = E° - (RT/nF)lnQ', difficulty: 'Hard' },
]

export default function LogicGen() {
  const [currentQ, setCurrentQ] = useState(0)
  const [variantIndex, setVariantIndex] = useState(-1)
  const [isShuffling, setIsShuffling] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const question = originalQuestions[currentQ]
  const displayedQuestion = variantIndex === -1 ? question.original : question.variants[variantIndex]

  const handleShuffle = () => {
    setIsShuffling(true); setShowHint(false)
    setTimeout(() => { setVariantIndex((variantIndex + 1) % question.variants.length); setIsShuffling(false) }, 800)
  }
  const handleNextQuestion = () => { setCurrentQ((currentQ + 1) % originalQuestions.length); setVariantIndex(-1); setShowHint(false) }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🔄</span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'Instrument Serif',serif" }}>LogicGen AI Shuffler</h1>
        </div>
        <p style={{ color: 'var(--text3)', fontSize: '.88rem', marginTop: '.25rem' }}>Dynamically alter PYQ parameters to combat rote learning</p>
      </div>

      {/* Question Navigator */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        {originalQuestions.map((q, i) => (
          <button key={q.id} onClick={() => { setCurrentQ(i); setVariantIndex(-1); setShowHint(false) }}
            style={{
              padding: '.5rem 1rem', borderRadius: 10, fontSize: '.82rem', fontWeight: currentQ === i ? 700 : 500,
              background: currentQ === i ? 'var(--primary-bg)' : 'var(--bg3)',
              color: currentQ === i ? 'var(--accent)' : 'var(--text3)',
              border: currentQ === i ? '1px solid var(--accent-border)' : '1px solid var(--border)',
              cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .2s',
            }}>
            {q.subject} · {q.chapter}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        {isShuffling && (
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: .9, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <RefreshCw className="animate-spin" style={{ width: 24, height: 24, color: 'var(--accent)' }} />
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Generating variant...</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontSize: '.72rem', padding: '.2rem .6rem', borderRadius: 100, background: 'rgba(35,84,244,.1)', color: '#2354F4', fontWeight: 700 }}>{question.year}</span>
            <span style={{ fontSize: '.72rem', padding: '.2rem .6rem', borderRadius: 100, fontWeight: 700, background: question.difficulty === 'Hard' ? 'rgba(244,63,94,.1)' : 'rgba(245,158,11,.1)', color: question.difficulty === 'Hard' ? '#f43f5e' : '#D97706' }}>{question.difficulty}</span>
          </div>
          {variantIndex !== -1 && <span style={{ fontSize: '.72rem', padding: '.2rem .6rem', borderRadius: 100, background: 'rgba(124,58,237,.1)', color: '#7C3AED', fontWeight: 700 }}>Variant {variantIndex + 1}</span>}
        </div>

        <div style={{ marginBottom: '.4rem' }}>
          <span style={{ fontSize: '.68rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{question.subject} · {question.chapter}</span>
        </div>

        <p style={{ color: 'var(--text)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{displayedQuestion}</p>

        {showHint && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 12, background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.3rem' }}>
              <Lightbulb style={{ width: 16, height: 16, color: '#D97706' }} />
              <span style={{ color: '#D97706', fontSize: '.82rem', fontWeight: 700 }}>Hint</span>
            </div>
            <p style={{ color: 'var(--text2)', fontSize: '.88rem' }}>{question.hint}</p>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem' }}>
          <button onClick={handleShuffle} disabled={isShuffling} className="btn-p" style={{ padding: '.6rem 1.3rem' }}>
            <Shuffle style={{ width: 16, height: 16 }} /> Shuffle Question
          </button>
          <button onClick={() => setShowHint(!showHint)} className="btn-g" style={{ padding: '.6rem 1.3rem' }}>
            <Lightbulb style={{ width: 16, height: 16 }} /> {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <button onClick={handleNextQuestion} className="btn-g" style={{ padding: '.6rem 1.3rem' }}>
            Next Question <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* How it Works */}
      <div className="card" style={{ padding: '1.3rem' }}>
        <h3 style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '1rem' }}>How LogicGen Works</h3>
        <div className="g3">
          {[
            { step: '01', title: 'Select PYQ', desc: 'Pick any past year question from the vault', icon: '📚' },
            { step: '02', title: 'AI Shuffles', desc: 'Parameters are altered while preserving logic', icon: '🔄' },
            { step: '03', title: 'Practice Variants', desc: 'Solve multiple unique versions of the same concept', icon: '✅' },
          ].map((s) => (
            <div key={s.step} style={{ padding: '1rem', borderRadius: 12, background: 'var(--bg3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.5rem' }}>
                <span style={{ color: 'var(--accent)', fontSize: '.72rem', fontWeight: 700 }}>{s.step}</span>
                <span style={{ fontSize: '.9rem' }}>{s.icon}</span>
              </div>
              <h4 style={{ color: 'var(--text)', fontSize: '.88rem', fontWeight: 600, marginBottom: '.2rem' }}>{s.title}</h4>
              <p style={{ color: 'var(--text3)', fontSize: '.78rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
