import { useState } from 'react'
import { Shield, Layout, Layers, RefreshCw, Check, Copy, Download, Share2 } from 'lucide-react'

const sampleSets = {
  'Set A': [
    { q: 'Q1. Explain the principle of working of a transformer.', marks: 3 },
    { q: 'Q2. Define electric flux. Write its SI unit.', marks: 2 },
    { q: 'Q3. What is the effect of temperature on resistivity?', marks: 2 },
  ],
  'Set B': [
    { q: 'Q1. Define the SI unit of electric current. How is it related to charge?', marks: 3 },
    { q: 'Q2. Explain the working of a photodiode with a diagram.', marks: 2 },
    { q: 'Q3. Explain the term drift velocity of electrons.', marks: 2 },
  ],
  'Set C': [
    { q: 'Q1. What is the magnifying power of a telescope in normal adjustment?', marks: 3 },
    { q: 'Q2. State Huygens’s principle. Use it to prove the laws of reflection.', marks: 2 },
    { q: 'Q3. What is the de Broglie wavelength of an electron?', marks: 2 },
  ]
}

export default function VariTest() {
  const [activeSet, setActiveSet] = useState('Set A')
  const [splitting, setSplitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSplit = () => {
    setSplitting(true)
    setTimeout(() => setSplitting(false), 1500)
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Vari-Test Anti-Cheat</h1>
          </div>
          <p style={{ color: 'var(--text3)' }} className="text-sm mt-1">Generate multi-set variants of your paper to prevent copying</p>
        </div>
        <button 
          onClick={handleSplit}
          disabled={splitting}
          className="btn-p flex items-center gap-2"
        >
          {splitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
          Refresh Variants
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Active Paper Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-5" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
            <h3 style={{ color: 'var(--text)' }} className="font-bold text-sm mb-3">Active Base Paper</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <p style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold">Paper Title</p>
                <p style={{ color: 'var(--text)' }} className="text-sm mt-0.5">Physics Unit Test 4</p>
              </div>
              <div className="p-3 rounded-lg border" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <p style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold">Total Questions</p>
                <p style={{ color: 'var(--text)' }} className="text-sm mt-0.5">25 Questions</p>
              </div>
              <div className="p-3 rounded-lg border" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <p style={{ color: 'var(--text3)' }} className="text-xs uppercase font-bold">Difficulty Profile</p>
                <p style={{ color: 'var(--text)' }} className="text-sm mt-0.5">Mixed (Standard)</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <p className="text-amber-500 text-xs font-bold uppercase mb-2 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Anti-Cheat Strategy
            </p>
            <p style={{ color: 'var(--text2)' }} className="text-xs leading-relaxed">
              Vari-Test shuffles question order AND swaps equivalent logic-questions between sets to make cheating impossible.
            </p>
          </div>
        </div>

        {/* Set Tabs & Preview */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2">
            {Object.keys(sampleSets).map(setName => (
              <button
                key={setName}
                onClick={() => setActiveSet(setName)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  activeSet === setName 
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                    : 'bg-transparent border-transparent'
                }`}
                style={{ 
                  borderColor: activeSet === setName ? 'rgba(245,158,11,0.3)' : 'var(--border)',
                  color: activeSet === setName ? '#f59e0b' : 'var(--text3)',
                  background: activeSet === setName ? 'rgba(245,158,11,0.05)' : 'transparent'
                }}
              >
                {setName}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden min-h-400px flex flex-col p-0">
            <div className={`p-6 flex-1 space-y-6 ${splitting ? 'opacity-30 blur-sm pointer-events-none' : ''} transition-all duration-300`}>
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                <h3 style={{ color: 'var(--text)' }} className="font-bold text-lg">{activeSet} Preview</h3>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="p-2 rounded-lg transition-colors border" style={{ background: 'var(--bg3)', color: 'var(--text3)', borderColor: 'var(--border)' }}>
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button className="p-2 rounded-lg transition-colors border" style={{ background: 'var(--bg3)', color: 'var(--text3)', borderColor: 'var(--border)' }}>
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg transition-colors border" style={{ background: 'var(--bg3)', color: 'var(--text3)', borderColor: 'var(--border)' }}>
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-8 max-w-2xl">
                {sampleSets[activeSet].map((item, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute -left-6 top-0 text-amber-500/10 font-black text-4xl group-hover:text-amber-500/20 transition-colors select-none">
                      0{i+1}
                    </div>
                    <div className="pl-6 space-y-2">
                      <div className="flex justify-between items-start">
                        <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>{item.q}</p>
                        <span className="text-xs px-2 py-1 rounded font-bold shrink-0 ml-4" style={{ background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}>[{item.marks} M]</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-1 flex-1 rounded-full group-hover:bg-amber-500/10 transition-colors" style={{ background: 'var(--bg3)' }}></div>
                      </div>
                    </div>
                  </div>
                ))}

                {[4, 5, 6].map(i => (
                  <div key={i} className="pl-6 pt-4 border-t opacity-40 italic text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                    Additional logic-swapped questions from vault... (Total 25 questions)
                  </div>
                ))}
              </div>
            </div>
            
            {splitting && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
                <p className="text-amber-500 text-sm font-bold uppercase tracking-wider">Syncing Logic Variants...</p>
              </div>
            )}

            <div className="p-4 border-t flex justify-center" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
              <p style={{ color: 'var(--text3)' }} className="text-[10px] font-bold uppercase tracking-widest">Sets are cryptographically unique by student ID clusters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
