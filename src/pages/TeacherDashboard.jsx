import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../components/questra/AppNavbar'
import StudioQ from '../components/teacher/StudioQ'
import VariTest from '../components/teacher/VariTest'
import VisionGrade from '../components/teacher/VisionGrade'
import BridgeReports from '../components/teacher/BridgeReports'

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
      setUser(JSON.parse(data))
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
        role="teacher"
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