
import React, { useState } from 'react'
import { AuthProvider, useAuth } from '../auth/AuthContext'
import Login from './Login'
import Roster from './Roster'
import Templates from './Templates'
import Assignments from './Assignments'
import ExportPDF from './ExportPDF'

const Shell: React.FC = () => {
  const { token, logout } = useAuth()
  const [tab, setTab] = useState<'Roster'|'Templates'|'Assignments'|'Export'>('Roster')

  if(!token) return <Login />
  return (
    <div style={{fontFamily:'system-ui', maxWidth:1200, margin:'0 auto', padding:'16px'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{color:'#592A8A'}}>ECU Pitching Program Manager</h1>
        <nav>
          {['Roster','Templates','Assignments','Export'].map(t=> (
            <button key={t} onClick={()=>setTab(t as any)} style={{marginRight:8}}>{t}</button>
          ))}
          <button onClick={logout}>Logout</button>
        </nav>
      </header>
      <main style={{marginTop:16}}>
        {tab==='Roster' && <Roster />}
        {tab==='Templates' && <Templates />}
        {tab==='Assignments' && <Assignments />}
        {tab==='Export' && <ExportPDF />}
      </main>
    </div>
  )
}

const App: React.FC = () => (
  <AuthProvider>
    <Shell />
  </AuthProvider>
)
export default App
