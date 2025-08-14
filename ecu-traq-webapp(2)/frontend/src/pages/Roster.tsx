
import React, { useEffect, useState } from 'react'
import api from '../api'

type Player = {
  id?: number
  first_name: string
  last_name: string
  hand?: string
  primary_role?: string
  rotation_day?: string
  status?: string
  email?: string
  phone?: string
  notes?: string
}

const empty: Player = { first_name:'', last_name:'', hand:'RHP', primary_role:'SP', status:'Active' }

const Roster: React.FC = () => {
  const [rows, setRows] = useState<Player[]>([])
  const [draft, setDraft] = useState<Player>(empty)

  async function load(){ const {data} = await api.get('/players'); setRows(data) }
  useEffect(()=>{ load() }, [])

  async function add(){
    if(!draft.first_name || !draft.last_name) return
    await api.post('/players', draft); setDraft(empty); load()
  }
  async function del(id:number){ await api.delete('/players/'+id); load() }

  return (
    <div>
      <h3>Roster</h3>
      <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, marginBottom:12}}>
        <input placeholder="First" value={draft.first_name} onChange={e=>setDraft({...draft, first_name:e.target.value})}/>
        <input placeholder="Last" value={draft.last_name} onChange={e=>setDraft({...draft, last_name:e.target.value})}/>
        <select value={draft.hand} onChange={e=>setDraft({...draft, hand:e.target.value})}><option>RHP</option><option>LHP</option></select>
        <select value={draft.primary_role} onChange={e=>setDraft({...draft, primary_role:e.target.value})}><option>SP</option><option>RP</option><option>Two-Way</option></select>
        <input placeholder="Rotation Day (1-7)" value={draft.rotation_day||''} onChange={e=>setDraft({...draft, rotation_day:e.target.value})}/>
        <button onClick={add}>Add</button>
      </div>
      <table width="100%" border={1} cellPadding={6} style={{borderCollapse:'collapse'}}>
        <thead style={{background:'#592A8A', color:'#fff'}}>
          <tr>
            <th>Name</th><th>Hand</th><th>Role</th><th>Rot</th><th>Status</th><th>Email</th><th>Phone</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.id}>
              <td>{r.first_name} {r.last_name}</td>
              <td>{r.hand}</td>
              <td>{r.primary_role}</td>
              <td>{r.rotation_day}</td>
              <td>{r.status}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td><button onClick={()=>del(r.id!)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Roster
