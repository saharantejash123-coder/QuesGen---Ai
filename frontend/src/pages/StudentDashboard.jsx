import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../components/questra/AppNavbar'
import DashboardOverview from '../components/student/DashboardOverview'
import OracleEnginePage from './questra/OracleEnginePage'
import LogicGen from '../components/student/LogicGen'
import SnapSolve from '../components/student/SnapSolve'
import Vault15Page from './questra/Vault15Page'
import ScriptLabPage from './questra/ScriptLabPage'
import AdaptiveTesting from '../components/student/AdaptiveTesting'

const tabComponents = {
  overview: DashboardOverview,
  oracle: OracleEnginePage,
  logicgen: LogicGen,
  snapsolve: SnapSolve,
  vault15: Vault15Page,
  scriptlab: ScriptLabPage,
  adaptive: AdaptiveTesting,
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
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
        role="student"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <ActiveComponent setActiveTab={setActiveTab} setPage={setActiveTab} user={user} />
      </main>
    </div>
  )
}
