
import React, { useEffect, useState } from 'react'
import api from '../api'
import jsPDF from 'jspdf'

type Player = { id:number, first_name:string, last_name:string }
type TemplateRow = { template_name:string, day_of_week:string, throwing?:string, bullpen?:string, plyo_meds?:string, lifts?:string, recovery?:string, conditioning?:string, notes?:string }

const order = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const ExportPDF: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([])
  const [templates, setTemplates] = useState<TemplateRow[]>([])
  const [playerId, setPlayerId] = useState<number>(0)
  const [template, setTemplate] = useState<string>('SP-7Day-Standard')

  useEffect(()=>{
    (async()=>{
      setPlayers((await api.get('/players')).data)
      setTemplates((await api.get('/templates')).data)
    })()
  }, [])

  function exportPdf(){
    const p = players.find(p=>p.id===playerId)
    if(!p) return
    const rows = templates.filter(t=> t.template_name===template).sort((a,b)=> order.indexOf(a.day_of_week)-order.indexOf(b.day_of_week))
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(`ECU Weekly Plan — ${p.first_name} ${p.last_name} — ${template}`, 14, 18)
    doc.setFontSize(10)
    let y = 28
    rows.forEach((r)=>{
      doc.text(`${r.day_of_week}:`, 14, y)
      y += 5
      doc.text(`Throwing: ${r.throwing||'—'}`, 20, y); y+=5
      doc.text(`Bullpen: ${r.bullpen||'—'}`, 20, y); y+=5
      doc.text(`Plyo/Meds: ${r.plyo_meds||'—'}`, 20, y); y+=5
      doc.text(`Lifts: ${r.lifts||'—'}`, 20, y); y+=5
      doc.text(`Recovery: ${r.recovery||'—'}`, 20, y); y+=5
      doc.text(`Conditioning: ${r.conditioning||'—'}`, 20, y); y+=5
      doc.text(`Notes: ${r.notes||'—'}`, 20, y); y+=8
      if(y>270){ doc.addPage(); y=20 }
    })
    doc.save(`${p.first_name}_${p.last_name}_${template}.pdf`)
  }

  return (
    <div>
      <h3>Export Weekly Plan PDF</h3>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <select value={playerId} onChange={e=>setPlayerId(Number(e.target.value))}>
          <option value={0}>Select Player</option>
          {players.map(p=> <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
        </select>
        <input value={template} onChange={e=>setTemplate(e.target.value)} />
        <button onClick={exportPdf} disabled={!playerId}>Export</button>
      </div>
    </div>
  )
}
export default ExportPDF
