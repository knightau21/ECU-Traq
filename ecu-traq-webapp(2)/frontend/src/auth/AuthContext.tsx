
import React, {createContext, useContext, useState} from 'react'
import api from '../api'

type AuthCtx = {
  token: string|null
  login: (email:string, password:string)=>Promise<void>
  logout: ()=>void
}
const Ctx = createContext<AuthCtx>({token:null, login: async()=>{}, logout: ()=>{}})
export const useAuth = ()=> useContext(Ctx)

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [token, setToken] = useState<string|null>(null)

  async function login(email:string, password:string){
    const {data} = await api.post('/auth/token', {email, password})
    setToken(data.access_token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
  }
  function logout(){ setToken(null); delete api.defaults.headers.common['Authorization'] }
  return <Ctx.Provider value={{token, login, logout}}>{children}</Ctx.Provider>
}
