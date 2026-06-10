import { useState } from 'react'
import { Settings, Bell, Shield, Database, Globe, Save, Check, Server, Lock, Cpu, Globe2, ShieldCheck } from 'lucide-react'

export default function SystemSettings() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'QuesGen',
    supportEmail: 'support@quesgen.com',
    maxUploadSize: '10',
    maintenanceMode: false,
    autoBackup: true,
    emailNotifications: true,
    pushNotifications: false,
    aiWorkerCount: '4',
    cacheExpiry: '24',
    debugMode: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Toggle = ({ checked, onChange, label, desc }) => (
    <div className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{label}</span>
        {desc && <span className="text-[10px] font-medium uppercase tracking-tight" style={{ color: 'var(--text3)' }}>{desc}</span>}
      </div>
      <button onClick={() => onChange(!checked)} className={`relative w-12 h-6.5 rounded-full transition-all duration-300 ${checked ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm shadow-blue-500/20' : ''}`} style={{ background: checked ? '' : 'var(--bg3)' }}>
        <div className={`absolute top-1 w-4.5 h-4.5 rounded-full bg-white shadow-md transition-all duration-300 ${checked ? 'left-[24px]' : 'left-1'}`} />
      </button>
    </div>
  )

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text)' }}>
             <Settings className="w-7 h-7 text-slate-400" /> System Configuration
          </h1>
          <p style={{ color: 'var(--text3)' }} className="text-sm">Fine-tune platform parameters and security protocols</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all transform hover:-translate-y-0.5 shrink-0 ${saved ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' : 'btn-primary'}`}>
          {saved ? <><ShieldCheck className="w-4 h-4" /> Policy Updated</> : <><Save className="w-4 h-4" /> Persist Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="card p-6">
          <h3 style={{ color: 'var(--text)' }} className="font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest"><Globe2 className="w-4 h-4 text-blue-500" /> Identity & Access</h3>
          <div className="space-y-5">
            <div>
              <label style={{ color: 'var(--text3)' }} className="text-[10px] uppercase font-bold mb-2 block tracking-wider">Public Platform Title</label>
              <input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" />
            </div>
            <div>
              <label style={{ color: 'var(--text3)' }} className="text-[10px] uppercase font-bold mb-2 block tracking-wider">Global Support Interface</label>
              <input type="email" value={settings.supportEmail} onChange={(e) => setSettings({...settings, supportEmail: e.target.value})} style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" />
            </div>
            <div>
              <label style={{ color: 'var(--text3)' }} className="text-[10px] uppercase font-bold mb-2 block tracking-wider">Payload Segment Limit (MB)</label>
              <input type="number" value={settings.maxUploadSize} onChange={(e) => setSettings({...settings, maxUploadSize: e.target.value})} style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card p-6">
          <h3 style={{ color: 'var(--text)' }} className="font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest"><Bell className="w-4 h-4 text-amber-500" /> Notifications & Continuity</h3>
          <Toggle label="SMTP Relay" desc="Send automated system emails" checked={settings.emailNotifications} onChange={(v) => setSettings({...settings, emailNotifications: v})} />
          <Toggle label="Real-time WebSockets" desc="Push alerts to active sessions" checked={settings.pushNotifications} onChange={(v) => setSettings({...settings, pushNotifications: v})} />
          <Toggle label="Isolation Mode" desc="Disable platform access for maintenance" checked={settings.maintenanceMode} onChange={(v) => setSettings({...settings, maintenanceMode: v})} />
          {settings.maintenanceMode && (
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-600 font-bold leading-relaxed">
              ⚠️ ISOLATION MODE ACTIVE: Global traffic will be diverted to the maintenance interface. Administrative override remains active.
            </div>
          )}
        </div>

        {/* Infrastructure */}
        <div className="card p-6">
          <h3 style={{ color: 'var(--text)' }} className="font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest"><Cpu className="w-4 h-4 text-emerald-500" /> Core Infrastructure</h3>
          <div className="space-y-5">
            <div>
              <label style={{ color: 'var(--text3)' }} className="text-[10px] uppercase font-bold mb-2 block tracking-wider">AI Inference Workers</label>
              <input type="number" value={settings.aiWorkerCount} onChange={(e) => setSettings({...settings, aiWorkerCount: e.target.value})} style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" />
            </div>
            <div>
              <label style={{ color: 'var(--text3)' }} className="text-[10px] uppercase font-bold mb-2 block tracking-wider">TTL Cache Buffer (Hours)</label>
              <input type="number" value={settings.cacheExpiry} onChange={(e) => setSettings({...settings, cacheExpiry: e.target.value})} style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" />
            </div>
            <Toggle label="Automated DB Archival" desc="Daily snapshots at 00:00 UTC" checked={settings.autoBackup} onChange={(v) => setSettings({...settings, autoBackup: v})} />
          </div>
        </div>

        {/* Security */}
        <div className="card p-6">
          <h3 style={{ color: 'var(--text)' }} className="font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest"><Lock className="w-4 h-4 text-red-500" /> Security Matrix</h3>
          <Toggle label="In-Depth Debugging" desc="Expose verbose kernels logs" checked={settings.debugMode} onChange={(v) => setSettings({...settings, debugMode: v})} />
          {settings.debugMode && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 font-bold leading-relaxed">
              🔴 DATA LEAK WARNING: Debug mode exposes internal stack traces. Do not persist in production environments.
            </div>
          )}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text2)' }} className="py-3 px-4 rounded-xl border text-xs font-bold hover:bg-opacity-80 transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
              <Shield className="w-3.5 h-3.5" /> Cycle API Keys
            </button>
            <button style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text2)' }} className="py-3 px-4 rounded-xl border text-xs font-bold hover:bg-opacity-80 transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
              <Database className="w-3.5 h-3.5" /> Manual Snapshot
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
