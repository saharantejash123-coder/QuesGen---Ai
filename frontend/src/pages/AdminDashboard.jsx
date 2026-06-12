import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../components/questra/AppNavbar'
import AdminOverview from '../components/admin/AdminOverview'
import UserManagement from '../components/admin/UserManagement'
import PlatformAnalytics from '../components/admin/PlatformAnalytics'
import SystemSettings from '../components/admin/SystemSettings'

const tabComponents = {
  overview: AdminOverview,
  users: UserManagement,
  analytics: PlatformAnalytics,
  settings: SystemSettings,
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState({ name: 'Loading...', initials: '--', subtitle: 'Loading...' })
  const navigate = useNavigate()

  useEffect(() => {
    const data = localStorage.getItem('questra_user')
    if (data) {
      const parsed = JSON.parse(data)
      const name = parsed.name
        || [parsed.firstName, parsed.lastName].filter(Boolean).join(' ')
        || parsed.email?.split('@')[0]
        || 'Admin'
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

  const ActiveComponent = tabComponents[activeTab]

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)' }}>
      <AppNavbar
        role="admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <ActiveComponent user={user} />
      </main>
    </div>
  )
}
