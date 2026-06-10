import { useState } from 'react'
import { Users, Search, Shield, BookOpen, MoreVertical, ChevronDown, UserPlus, Mail, Filter } from 'lucide-react'

const mockUsers = [
  { id: 1, name: 'Aarav Rajput', email: 'student@gmail.com', role: 'Student', class: 'Class 12', board: 'CBSE', status: 'Active', lastActive: '2 min ago', avatar: 'AR' },
  { id: 2, name: 'Priya Mehta', email: 'priya.mehta@gmail.com', role: 'Student', class: 'Class 11', board: 'RBSE', status: 'Active', lastActive: '15 min ago', avatar: 'PM' },
  { id: 3, name: 'Prof. Sharma', email: 'teacher@gmail.com', role: 'Teacher', class: 'Physics', board: 'CBSE', status: 'Active', lastActive: '1 hr ago', avatar: 'PS' },
  { id: 4, name: 'Dr. Verma', email: 'dr.verma@gmail.com', role: 'Teacher', class: 'Mathematics', board: 'JEE', status: 'Active', lastActive: '3 hrs ago', avatar: 'DV' },
  { id: 5, name: 'Rohit Kumar', email: 'rohit.k@gmail.com', role: 'Student', class: 'Class 12', board: 'ICSE', status: 'Inactive', lastActive: '3 days ago', avatar: 'RK' },
  { id: 6, name: 'Sneha Gupta', email: 'sneha.g@gmail.com', role: 'Student', class: 'Class 10', board: 'CBSE', status: 'Active', lastActive: '30 min ago', avatar: 'SG' },
  { id: 7, name: 'Mrs. Patel', email: 'mrs.patel@gmail.com', role: 'Teacher', class: 'Chemistry', board: 'NEET', status: 'Active', lastActive: '45 min ago', avatar: 'MP' },
  { id: 8, name: 'System Admin', email: 'admin@gmail.com', role: 'Admin', class: 'N/A', board: 'All', status: 'Active', lastActive: 'Now', avatar: 'AD' },
]

export default function UserManagement() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const roleColor = (role) => {
    if (role === 'Admin') return 'text-red-500 bg-red-500/10 border-red-500/20'
    if (role === 'Teacher') return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    return 'text-purple-500 bg-purple-500/10 border-purple-500/20'
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text)' }}>
             <Users className="w-7 h-7 text-blue-500" /> 
             User Management
          </h1>
          <p style={{ color: 'var(--text3)' }} className="text-sm">{mockUsers.length} total registered users across the platform</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 shrink-0">
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Filters Area */}
      <div className="card p-5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
            className="w-full pl-11 pr-4 py-3 border rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 p-1.5 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <div className="px-3 text-[10px] font-bold uppercase tracking-widest border-r hidden sm:block" style={{ color: 'var(--text3)', borderColor: 'var(--border)' }}>Filter</div>
          {['All', 'Student', 'Teacher', 'Admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                roleFilter === r
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-blue-500'
              }`}
              style={roleFilter !== r ? { color: 'var(--text3)' } : {}}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* User Table Card */}
      <div className="card shadow-sm overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                <th className="text-left px-6 py-4 text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--text3)' }}>Identify</th>
                <th className="text-left px-6 py-4 text-[10px] uppercase font-bold tracking-widest hidden sm:table-cell" style={{ color: 'var(--text3)' }}>Privileges</th>
                <th className="text-left px-6 py-4 text-[10px] uppercase font-bold tracking-widest hidden md:table-cell" style={{ color: 'var(--text3)' }}>Specialization</th>
                <th className="text-left px-6 py-4 text-[10px] uppercase font-bold tracking-widest hidden lg:table-cell" style={{ color: 'var(--text3)' }}>Affiliation</th>
                <th className="text-left px-6 py-4 text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--text3)' }}>Pulse</th>
                <th className="text-right px-6 py-4 text-[10px] uppercase font-bold tracking-widest hidden sm:table-cell" style={{ color: 'var(--text3)' }}>Last Access</th>
                <th className="text-right px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b transition-all group" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                        u.role === 'Admin' ? 'bg-gradient-to-br from-red-500 to-orange-500' : u.role === 'Teacher' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gradient-to-br from-purple-500 to-blue-500'
                      } text-white group-hover:scale-105 transition-transform`}>
                        {u.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{u.name}</p>
                        <p className="text-[11px] font-medium truncate mt-0.5" style={{ color: 'var(--text3)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${roleColor(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-sm font-medium" style={{ color: 'var(--text2)' }}>{u.class}</td>
                  <td className="px-6 py-4 hidden lg:table-cell text-sm font-medium" style={{ color: 'var(--text2)' }}>{u.board}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40 animate-pulse' : ''}`} style={u.status !== 'Active' ? { background: 'var(--bg3)' } : {}} />
                       <span className={`text-xs font-bold uppercase tracking-tight ${u.status === 'Active' ? 'text-emerald-500' : ''}`} style={u.status !== 'Active' ? { color: 'var(--text3)' } : {}}>
                        {u.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-bold hidden sm:table-cell uppercase" style={{ color: 'var(--text3)' }}>{u.lastActive}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ color: 'var(--text3)' }}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
               <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p style={{ color: 'var(--text2)' }} className="text-sm font-bold uppercase tracking-widest">No users found</p>
            <p style={{ color: 'var(--text3)' }} className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
