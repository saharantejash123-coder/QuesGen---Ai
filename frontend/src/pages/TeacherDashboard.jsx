import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../components/questra/AppNavbar'
import StudioQ from '../components/teacher/StudioQ'
import VariTest from '../components/teacher/VariTest'
import VisionGrade from '../components/teacher/VisionGrade'
import BridgeReports from '../components/teacher/BridgeReports'
import ClassManager from '../components/teacher/ClassManager'
import ProfilePage from './ProfilePage'

function loadTeacherUser() {
  try {
    const data = localStorage.getItem('questra_user')
    if (!data) return null
    const parsed = JSON.parse(data)
    const name = parsed.name
      || [parsed.firstName, parsed.lastName].filter(Boolean).join(' ')
      || parsed.email?.split('@')[0]
      || 'Teacher'
    const initials = parsed.initials
      || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    return { ...parsed, name, initials }
  } catch { return null }
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('studio')
  const [user, setUser] = useState(loadTeacherUser)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const handleLogout = () => {
    localStorage.removeItem('questra_user')
    localStorage.removeItem('questra_token')
    window.location.replace('/login')
  }

  const handleUserUpdate = (updated) => setUser(updated)

  const renderTab = () => {
    switch (activeTab) {
      case 'studio':   return <StudioQ user={user} />
      case 'varitest': return <VariTest user={user} />
      case 'vision':   return <VisionGrade user={user} />
      case 'bridge':   return <BridgeReports user={user} />
      case 'classes':  return <ClassManager user={user} />
      case 'profile':  return <ProfilePage user={user} onUpdate={handleUserUpdate} role="teacher" setActiveTab={setActiveTab} />
      default:         return <StudioQ user={user} />
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)' }}>
      <AppNavbar
        role="teacher"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onProfile={() => setActiveTab('profile')}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {renderTab()}
      </main>
    </div>
  )
}
