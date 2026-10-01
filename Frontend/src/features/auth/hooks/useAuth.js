import { useContext,useEffect } from "react"
import { AuthContext } from "../auth.context.jsx"
import { login, register, logout, getMe } from "../services/auth.api.js"

export const useAuth = ()=>{
    const context= useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    const { user,setUser,loading,setLoading } = context
    

    const handleLogin = async ({email, password})=>{
        setLoading(true)

        try{
            const data= await login({email,password})
            setUser(data.user)
            return data.user

        }catch(err){
            console.error(err)
            throw err
        }finally{
            setLoading(false)

        }

    }

    const handleRegister = async ({username,email,password})=>{
        setLoading(true)
        try{
            const data= await register({username,email,password})
            setUser(data.user)
            return data.user

        }catch(err){
            console.error(err)
            throw err

        }finally{
            setLoading(false)

        }

    }

    const handleLogout = async ()=>{
        setLoading(true)
        try{
            await logout()
            setUser(null)
            return true

        }catch(err){
            console.error(err)
            throw err
        }finally{
            setLoading(false)

        }
    }

    useEffect(()=>{

        const getAndSetUser= async()=>{
            try{
                const data= await getMe()
                setUser(data.user)
            }catch{
                setUser(null)
            }
            finally{
                setLoading(false)
            }
        }
        getAndSetUser()

    }, [setLoading, setUser])

    return {user, loading, handleLogin, handleRegister, handleLogout}
}
