import { useState } from 'react'
import { Brain, ChevronDown, TrendingUp, TrendingDown, Minus, Sparkles, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const subjects = {
  'Physics': { chapters: ['Kinematics', 'Laws of Motion', 'Work & Energy', 'Rotational Motion', 'Gravitation', 'Oscillations', 'Waves', 'Electrostatics'] },
  'Chemistry': { chapters: ['Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'P-Block Elements', 'D-Block Elements', 'Coordination Compounds'] },
  'Mathematics': { chapters: ['Relations & Functions', 'Trigonometry', 'Matrices & Determinants', 'Continuity & Differentiability', 'Integrals', 'Probability', 'Vectors', '3D Geometry'] },
}

const predictions = {
  'Physics': [
    { topic: 'Kinematics', probability: 87, weightage: 'High', trend: 'up', marks: '8-10' },
    { topic: 'Electrostatics', probability: 82, weightage: 'High', trend: 'up', marks: '6-8' },
    { topic: 'Waves', probability: 74, weightage: 'Medium', trend: 'stable', marks: '4-6' },
    { topic: 'Laws of Motion', probability: 71, weightage: 'Medium', trend: 'up', marks: '6-8' },
    { topic: 'Oscillations', probability: 65, weightage: 'Medium', trend: 'down', marks: '2-4' },
    { topic: 'Gravitation', probability: 52, weightage: 'Low', trend: 'stable', marks: '2-4' },
    { topic: 'Rotational Motion', probability: 45, weightage: 'Low', trend: 'down', marks: '2-4' },
    { topic: 'Work & Energy', probability: 38, weightage: 'Low', trend: 'stable', marks: '2-4' },
  ],
  'Chemistry': [
    { topic: 'Electrochemistry', probability: 91, weightage: 'High', trend: 'up', marks: '6-8' },
    { topic: 'Chemical Kinetics', probability: 85, weightage: 'High', trend: 'up', marks: '4-6' },
    { topic: 'P-Block Elements', probability: 78, weightage: 'Medium', trend: 'stable', marks: '6-8' },
    { topic: 'Coordination Compounds', probability: 72, weightage: 'Medium', trend: 'up', marks: '4-6' },
    { topic: 'Solutions', probability: 64, weightage: 'Medium', trend: 'down', marks: '4-6' },
    { topic: 'D-Block Elements', probability: 55, weightage: 'Low', trend: 'stable', marks: '2-4' },
    { topic: 'Solid State', probability: 42, weightage: 'Low', trend: 'down', marks: '2-4' },
    { topic: 'Surface Chemistry', probability: 35, weightage: 'Low', trend: 'stable', marks: '2-4' },
  ],
  'Mathematics': [
    { topic: 'Trigonometry', probability: 87, weightage: 'High', trend: 'up', marks: '8-10' },
    { topic: 'Integrals', probability: 84, weightage: 'High', trend: 'up', marks: '8-10' },
    { topic: 'Probability', probability: 79, weightage: 'High', trend: 'stable', marks: '6-8' },
    { topic: 'Continuity & Diff.', probability: 73, weightage: 'Medium', trend: 'up', marks: '6-8' },
    { topic: '3D Geometry', probability: 67, weightage: 'Medium', trend: 'stable', marks: '4-6' },
    { topic: 'Matrices & Det.', probability: 58, weightage: 'Medium', trend: 'down', marks: '4-6' },
    { topic: 'Relations & Func.', probability: 44, weightage: 'Low', trend: 'stable', marks: '2-4' },
    { topic: 'Vectors', probability: 39, weightage: 'Low', trend: 'down', marks: '2-4' },
  ],
}

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '.5rem .75rem' }}>
        <p style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--accent)' }}>{payload[0].payload.full || payload[0].payload.topic}</p>
        <p style={{ fontSize: '.75rem', color: 'var(--text3)' }}>{payload[0].value}% probability</p>
      </div>
    )
  }
  return null
}

export default function OracleEngine() {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [subjectOpen, setSubjectOpen] = useState(false)

  const currentPredictions = predictions[selectedSubject]
  const chartData = currentPredictions.map(p => ({ topic: p.topic.substring(0, 8), probability: p.probability, full: p.topic }))

  const getBarColor = (prob) => {
    if (prob >= 80) return '#10b981'
    if (prob >= 60) return '#f59e0b'
    return '#94a3b8'
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp style={{ width: 14, height: 14, color: '#10b981' }} />
    if (trend === 'down') return <TrendingDown style={{ width: 14, height: 14, color: '#f43f5e' }} />
    return <Minus style={{ width: 14, height: 14, color: 'var(--text3)' }} />
  }

  const getWeightageStyle = (w) => {
    if (w === 'High') return { background: 'rgba(16,185,129,.1)', color: '#059669' }
    if (w === 'Medium') return { background: 'rgba(245,158,11,.1)', color: '#D97706' }
    return { background: 'var(--bg3)', color: 'var(--text3)' }
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔮</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'Instrument Serif',serif" }}>Exam Generator</h1>
          </div>
          <p style={{ color: 'var(--text3)', fontSize: '.88rem', marginTop: '.25rem' }}>AI-powered exam predictions based on 15 years of PYQ analysis</p>
        </div>

        {/* Subject Selector */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setSubjectOpen(!subjectOpen)} style={{
            display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.55rem 1rem',
            borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)',
            color: 'var(--text)', fontSize: '.88rem', cursor: 'pointer', minWidth: 180,
            fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
          }}>
            <span>{selectedSubject}</span>
            <ChevronDown style={{ width: 16, height: 16, color: 'var(--text3)', marginLeft: 'auto', transition: 'transform .2s', transform: subjectOpen ? 'rotate(180deg)' : 'none' }} />
          </button>
          {subjectOpen && (
            <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: '100%', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 25px var(--card-hover-shadow)', zIndex: 10 }}>
              {Object.keys(subjects).map((subj) => (
                <button key={subj} onClick={() => { setSelectedSubject(subj); setSubjectOpen(false); }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '.6rem 1rem', fontSize: '.88rem',
                    border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                    background: selectedSubject === subj ? 'var(--primary-bg)' : 'transparent',
                    color: selectedSubject === subj ? 'var(--accent)' : 'var(--text2)',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => { if (selectedSubject !== subj) e.currentTarget.style.background = 'var(--bg3)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = selectedSubject === subj ? 'var(--primary-bg)' : 'transparent' }}
                >{subj}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '.75rem', borderColor: 'rgba(124,58,237,.2)' }}>
        <span style={{ fontSize: '1.2rem', marginTop: '.1rem' }}>✨</span>
        <p style={{ color: 'var(--text2)', fontSize: '.88rem' }}>Oracle has analyzed <strong style={{ color: 'var(--text)' }}>15 years of {selectedSubject}</strong> PYQ data across CBSE, RBSE, and competitive exams to generate these confidence predictions.</p>
      </div>

      <div className="g2" style={{ alignItems: 'start' }}>
        {/* Chart */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <h3 style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '.25rem' }}>Probability Distribution</h3>
          <p style={{ color: 'var(--text3)', fontSize: '.75rem', marginBottom: '1rem' }}>Topic-wise appearance probability</p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} stroke="var(--text3)" tick={{ fill: 'var(--text3)', fontSize: 11 }} />
                <YAxis type="category" dataKey="topic" width={70} stroke="var(--text3)" tick={{ fill: 'var(--text2)', fontSize: 11 }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="probability" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={getBarColor(entry.probability)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictions List */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <h3 style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '.25rem' }}>Confidence Predictions</h3>
          <p style={{ color: 'var(--text3)', fontSize: '.75rem', marginBottom: '1rem' }}>Topic-wise weightage for upcoming exams</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
            {currentPredictions.map((pred, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.7rem', borderRadius: 10, background: 'var(--bg3)', transition: 'all .2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flex: 1, minWidth: 0 }}>
                  <div style={{ width: 40, textAlign: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: pred.probability >= 80 ? '#10b981' : pred.probability >= 60 ? '#D97706' : 'var(--text3)' }}>
                      {pred.probability}%
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--text)', fontSize: '.88rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pred.topic}</p>
                    <p style={{ color: 'var(--text3)', fontSize: '.72rem' }}>Expected: {pred.marks} marks</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', flexShrink: 0 }}>
                  <span style={{ padding: '.15rem .5rem', borderRadius: 100, fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', ...getWeightageStyle(pred.weightage) }}>{pred.weightage}</span>
                  {getTrendIcon(pred.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="card" style={{ padding: '1.3rem', borderColor: 'rgba(217,119,6,.2)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem' }}>
          <AlertTriangle style={{ width: 20, height: 20, color: '#D97706', flexShrink: 0, marginTop: '.1rem' }} />
          <div>
            <h4 style={{ color: 'var(--text)', fontWeight: 600, fontSize: '.9rem' }}>Oracle Insight</h4>
            <p style={{ color: 'var(--text3)', fontSize: '.88rem', marginTop: '.25rem' }}>
              Based on recent trends, <span style={{ color: '#D97706', fontWeight: 600 }}>{currentPredictions[0].topic}</span> and <span style={{ color: '#D97706', fontWeight: 600 }}>{currentPredictions[1].topic}</span> have the highest probability of appearing in the upcoming board exam.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
