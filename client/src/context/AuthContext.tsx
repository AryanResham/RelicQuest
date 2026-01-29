import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { AuthContext, type AuthContextType } from './useAuthContext'
import type { User, Session, Provider } from '@supabase/supabase-js'

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUpUser = async (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: {
          data: {
            given_name: metadata?.firstName || '',
            family_name: metadata?.lastName || '',
          }
        }
      })
      if (error) {
        console.error(error)
        return { success: false, error: error.message }
      }
      console.log("Sign up successful")
      return { success: true, data }
    } catch (error) {
      console.error(error)
      return { success: false, error: error }
    }
  }

  const loginUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password
      })
      if (error) {
        console.error(error)
        return { success: false, error: error.message }
      }
      console.log("Login successful")
      return { success: true, data }
    } catch (error) {
      console.error(error)
      return { success: false, error: error }
    }
  }

  const logoutUser = async () => {
    try {
      setLoading(true)
      return await supabase.auth.signOut()
    } catch (error) {
      console.error(error)
      return { success: false, error: error }
    } finally {
      setLoading(false)
    }
  }

  const signInWithOAuth = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) {
        console.error(error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false, error: error }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUpUser,
    loginUser,
    logoutUser,
    signInWithOAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
