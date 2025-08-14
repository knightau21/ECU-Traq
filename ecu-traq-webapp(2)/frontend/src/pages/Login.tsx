
import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

const Login: React.FC = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@ecu.local')
  const [password, setPassword] = useState('admin123')
  const [err, setErr] = useState<string|null>(null)

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setErr(null)
    try { await login(email, password) } catch(e:any){ setErr(e?.response?.data?.detail || 'Login failed') }
  }

  return (
    <form onSubmit={submit} style={{maxWidth:360, margin:'15vh auto', padding:24, border:'1px solid #eee', borderRadius:8}}>
      <h2>Coach Login</h2>
      <label>Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',marginBottom:8}}/>
      <label>Password</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',marginBottom:8}}/>
      {err && <div style={{color:'red', marginBottom:8}}>{err}</div>}
      <button type="submit" style={{width:'100%'}}>Sign In</button>
      <p style={{fontSize:12,opacity:.7,marginTop:8}}>Default admin is <code>admin@ecu.local / admin123</code>. Change it in production.</p>
    </form>
  )
}
export default Login
