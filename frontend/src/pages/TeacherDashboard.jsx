import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../components/questra/AppNavbar'
import StudioQ from '../components/teacher/StudioQ'
import VariTest from '../components/teacher/VariTest'
import VisionGrade from '../components/teacher/VisionGrade'
import BridgeReports from '../components/teacher/BridgeReports'
import ProfilePage from './ProfilePage'

const tabComponents = {
  studio: StudioQ,
  varitest: VariTest,
  vision: VisionGrade,
  bridge: BridgeReports,
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('studio')
  const [user, setUser] = useState({ name: 'Loading...', initials: '--', subtitle: 'Loading...' })
  const navigate = useNavigate()

  useEffect(() => {
    const data = localStorage.getItem('questra_user')
    if (data) {
      const parsed = JSON.parse(data)
      const name = parsed.name
        || [parsed.firstName, parsed.lastName].filter(Boolean).join(' ')
        || parsed.email?.split('@')[0]
        || 'Teacher'
      const initials = parsed.initials
        || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      setUser({ ...parsed, name, initials })
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('questra_user')
    navigate('/login')
  }

  const handleUserUpdate = (updated) => {
    setUser(updated)
  }

  const ActiveComponent = tabComponents[activeTab]

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
        {activeTab === 'profile'
          ? <ProfilePage user={user} onUpdate={handleUserUpdate} role="teacher" setActiveTab={setActiveTab} />
          : <ActiveComponent user={user} />
        }
      </main>
    </div>
  )
}