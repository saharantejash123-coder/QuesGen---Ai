import { useState } from 'react'
import { Send, CheckCircle, Clock, AlertCircle, MessageSquare, Phone, Bell, Search, Filter, ShieldCheck } from 'lucide-react'

const initialStudents = [
  { id: 1, name: 'Amit Kumar', parent: 'Mr. Rajesh Kumar', phone: '+91 98XXX XXX01', status: 'Delivered', time: 'Mon, 10:30 AM', score: '82%' },
  { id: 2, name: 'Sneha Rao', parent: 'Mrs. Kavita Rao', phone: '+91 98XXX XXX02', status: 'Pending', time: 'Processing...', score: '75%' },
  { id: 3, name: 'Rohan Shah', parent: 'Mr. Vipul Shah', phone: '+91 98XXX XXX03', status: 'Failed', time: '3 attempts failed', score: '42%' },
  { id: 4, name: 'Isha Gupta', parent: 'Mrs. Suman Gupta', phone: '+91 98XXX XXX04', status: 'Delivered', time: 'Mon, 10:45 AM', score: '91%' },
  { id: 5, name: 'Priya Singh', parent: 'Mr. Arvind Singh', phone: '+91 98XXX XXX05', status: 'Delivered', time: 'Mon, 11:00 AM', score: '88%' },
  { id: 6, name: 'Varun Joshi', parent: 'Mrs. Meera Joshi', phone: '+91 98XXX XXX06', status: 'Pending', time: 'Scheduled for 12:00 PM', score: '64%' },
]

export default function BridgeReports() {
  const [automated, setAutomated] = useState(true)
  const [channels, setChannels] = useState({ whatsapp: true, sms: false, email: true })
  const [search, setSearch] = useState('')

  const filteredStudents = initialStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.parent.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Bridge-Reports</h1>
          </div>
          <p style={{ color: 'var(--text3)' }} className="text-sm mt-1">Automate performance log delivery to parents via WhatsApp and SMS</p>
        </div>
        
        <div className="flex items-center gap-3 p-1.5 rounded-2xl border" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
           <span className="text-[10px] font-black uppercase tracking-widest ml-2" style={{ color: 'var(--text3)' }}>Automation</span>
           <button 
            onClick={() => setAutomated(!automated)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              automated ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-transparent border-transparent'
            }`}
            style={{ 
              borderColor: automated ? 'rgba(16,185,129,0.3)' : 'var(--border)',
              color: automated ? '#10B981' : 'var(--text3)',
              background: automated ? 'rgba(16,185,129,0.05)' : 'transparent'
            }}
           >
            {automated ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {automated ? 'ACTIVE' : 'PAUSED'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Bridge Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-6">
             <h3 style={{ color: 'var(--text)' }} className="font-bold text-sm mb-5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Delivery Channels
             </h3>
             <div className="space-y-3">
                {[
                  { id: 'whatsapp', name: 'WhatsApp Business', icon: MessageSquare, color: 'text-emerald-500' },
                  { id: 'sms', name: 'Direct SMS', icon: Phone, color: 'text-blue-500' },
                  { id: 'email', name: 'Cloud Email', icon: Bell, color: 'text-purple-500' },
                ].map(channel => (
                  <button 
                    key={channel.id}
                    onClick={() => setChannels({...channels, [channel.id]: !channels[channel.id]})}
                    className="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                    style={{ 
                        background: channels[channel.id] ? 'var(--bg3)' : 'transparent', 
                        borderColor: channels[channel.id] ? 'var(--border)' : 'transparent',
                        opacity: channels[channel.id] ? 1 : 0.6
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <channel.icon className={`w-4 h-4 ${channel.color}`} />
                      <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{channel.name}</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${channels[channel.id] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                       <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${channels[channel.id] ? 'left-4.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>
                ))}
             </div>

             <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <p style={{ color: 'var(--text3)' }} className="text-[10px] font-black uppercase mb-3 tracking-widest">Report Frequency</p>
                <div className="grid grid-cols-2 gap-2">
                   {['Weekly', 'Daily', 'Monthly', 'On-Demand'].map(f => (
                     <button key={f} className="py-2 rounded-lg border text-[10px] font-bold transition-colors" style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text3)' }}>{f}</button>
                   ))}
                </div>
             </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
             <p style={{ color: 'var(--text)' }} className="text-xs font-bold mb-2">Bridge Insight</p>
             <p style={{ color: 'var(--text2)' }} className="text-[11px] leading-relaxed">
                Parents are 3.5x more likely to respond to 1-page "Briefs" sent via WhatsApp than via standard email reports.
             </p>
          </div>
        </div>

        {/* Student Delivery Status */}
        <div className="card p-0 overflow-hidden flex flex-col lg:col-span-3">
          <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
             <div className="flex items-center gap-3 border rounded-xl px-4 py-2 w-full sm:max-w-xs" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                <Search className="w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search students or parents..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ color: 'var(--text)' }}
                  className="bg-transparent border-none outline-none text-xs placeholder-slate-500 w-full"
                />
             </div>
             <div className="flex gap-2">
                <button className="p-2 rounded-xl transition-colors border" style={{ background: 'var(--bg2)', color: 'var(--text3)', borderColor: 'var(--border)' }}><Filter className="w-4 h-4" /></button>
                <button className="btn-p !py-2 !px-4 text-[10px] uppercase font-black tracking-widest">Send Now (Manual)</button>
             </div>
          </div>

          <div className="flex-1 overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="border-b" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                      <th style={{ color: 'var(--text3)' }} className="p-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Student</th>
                      <th style={{ color: 'var(--text3)' }} className="p-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Primary Contact</th>
                      <th style={{ color: 'var(--text3)' }} className="p-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap text-center">Score</th>
                      <th style={{ color: 'var(--text3)' }} className="p-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Status</th>
                      <th style={{ color: 'var(--text3)' }} className="p-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Last Signal</th>
                   </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                   {filteredStudents.map(student => (
                     <tr key={student.id} className="transition-colors hover:bg-slate-500/5">
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>
                                 {student.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span style={{ color: 'var(--text)' }} className="text-xs font-bold">{student.name}</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <p style={{ color: 'var(--text)' }} className="text-xs font-medium">{student.parent}</p>
                           <p style={{ color: 'var(--text3)' }} className="text-[10px]">{student.phone}</p>
                        </td>
                        <td className="p-4 text-center">
                           <span className={`text-xs font-black ${parseInt(student.score) > 80 ? 'text-emerald-500' : parseInt(student.score) > 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                               {student.score}
                           </span>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-2">
                              {student.status === 'Delivered' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                              {student.status === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                              {student.status === 'Failed' && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                              <span className={`text-[10px] font-bold ${
                                 student.status === 'Delivered' ? 'text-emerald-500' : 
                                 student.status === 'Pending' ? 'text-amber-400' : 'text-rose-500'
                               }`}>{student.status}</span>
                           </div>
                        </td>
                        <td style={{ color: 'var(--text3)' }} className="p-4 text-[10px] font-medium">
                           {student.time}
                        </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          <div className="p-4 border-t flex items-center justify-between" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
             <p style={{ color: 'var(--text3)' }} className="text-[10px] font-bold">Showing {filteredStudents.length} of 42 students in Physics Group 1</p>
             <div className="flex gap-1">
                <button className="w-6 h-6 rounded flex items-center justify-center text-[10px] border" style={{ background: 'var(--bg2)', color: 'var(--text)', borderColor: 'var(--border)' }}>1</button>
                <button style={{ color: 'var(--text3)' }} className="w-6 h-6 rounded flex items-center justify-center text-[10px]">2</button>
                <button style={{ color: 'var(--text3)' }} className="w-6 h-6 rounded flex items-center justify-center text-[10px]">3</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
