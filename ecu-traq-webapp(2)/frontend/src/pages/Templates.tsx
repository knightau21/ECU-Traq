
import React, { useEffect, useState } from 'react'
import api from '../api'

type TemplateRow = {
  id?: number
  template_name: string
  day_of_week: string
  throwing?: string
  bullpen?: string
  plyo_meds?: string
  lifts?: string
  recovery?: string
  conditioning?: string
  notes?: string
}

const order = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const Templates: React.FC = () => {
  const [rows, setRows] = useState<TemplateRow[]>([])
  const [draft, setDraft] = useState<TemplateRow>({template_name:'SP-7Day-Standard', day_of_week:'Mon'})

  async function load(){ const {data} = await api.get('/templates'); setRows(data) }
  useEffect(()=>{ load() }, [])

  async function add(){ await api.post('/templates', draft); setDraft({template_name:draft.template_name, day_of_week:'Mon'}); load() }
  async function del(id:number){ await api.delete('/templates/'+id); load() }

  return (
    <div>
      <h3>Week Templates</h3>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8}}>
        <input placeholder="Template Name" value={draft.template_name} onChange={e=>setDraft({...draft, template_name:e.target.value})}/>
        <select value={draft.day_of_week} onChange={e=>setDraft({...draft, day_of_week:e.target.value})}>{order.map(d=> <option key={d}>{d}</option>)}</select>
        <input placeholder="Throwing" value={draft.throwing||''} onChange={e=>setDraft({...draft, throwing:e.target.value})}/>
        <input placeholder="Bullpen" value={draft.bullpen||''} onChange={e=>setDraft({...draft, bullpen:e.target.value})}/>
        <input placeholder="Plyo/Meds" value={draft.plyo_meds||''} onChange={e=>setDraft({...draft, plyo_meds:e.target.value})}/>
        <input placeholder="Lifts" value={draft.lifts||''} onChange={e=>setDraft({...draft, lifts:e.target.value})}/>
        <input placeholder="Recovery" value={draft.recovery||''} onChange={e=>setDraft({...draft, recovery:e.target.value})}/>
        <input placeholder="Conditioning" value={draft.conditioning||''} onChange={e=>setDraft({...draft, conditioning:e.target.value})}/>
        <input placeholder="Notes" value={draft.notes||''} onChange={e=>setDraft({...draft, notes:e.target.value})}/>
        <button onClick={add}>Add Row</button>
      </div>

      <h4 style={{marginTop:16}}>Existing Rows</h4>
      <table width="100%" border={1} cellPadding={6} style={{borderCollapse:'collapse'}}>
        <thead style={{background:'#592A8A', color:'#fff'}}>
          <tr><th>Template</th><th>DOW</th><th>Throwing</th><th>Bullpen</th><th>Plyo/Meds</th><th>Lifts</th><th>Recovery</th><th>Cond.</th><th>Notes</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {rows.sort((a,b)=> (a.template_name.localeCompare(b.template_name) || order.indexOf(a.day_of_week)-order.indexOf(b.day_of_week))).map(r=> (
            <tr key={r.id}>
              <td>{r.template_name}</td><td>{r.day_of_week}</td><td>{r.throwing}</td><td>{r.bullpen}</td><td>{r.plyo_meds}</td><td>{r.lifts}</td><td>{r.recovery}</td><td>{r.conditioning}</td><td>{r.notes}</td>
              <td><button onClick={()=>del(r.id!)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Templates
