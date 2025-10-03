import React, { createContext, useContext, useEffect, useState } from 'react'
import { type User } from 'firebase/auth'
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logout,
  resetPassword,
  onAuthStateChange,
  handleGoogleRedirectResult
} from '../services/auth'

type FnResult<T = User | null> = Promise<{ user: T; error: string | null }>

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => FnResult
  signUp: (email: string, password: string, displayName?: string) => FnResult
  googleSignIn: () => FnResult
  signOut: () => Promise<{ error: string | null }>
  resetUserPassword: (email: string) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChange((fbUser: User | null) => {
      setUser(fbUser ?? null)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // Optional: if you ever used redirect flow earlier, this safely no-ops for popup users
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await handleGoogleRedirectResult()
        if (result?.user) {
          const { default: toast } = await import('react-hot-toast')
          toast.success('Welcome! Signed in with Google.')
        }
      } catch (e) {
        console.error('Error checking redirect result:', e)
      }
    }
    checkRedirect()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await signInWithEmail(email, password)
      return { user: result.user, error: result.error }
    } catch (e: any) {
      return { user: null, error: e?.message ?? 'Failed to sign in' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true)
    try {
      const result = await signUpWithEmail(email, password, displayName)
      return { user: result.user, error: result.error }
    } catch (e: any) {
      return { user: null, error: e?.message ?? 'Failed to sign up' }
    } finally {
      setLoading(false)
    }
  }

 const googleSignIn = async () => {
  setLoading(true)
  try {
    const result = await signInWithGoogle()
    return { user: result.user, error: result.error }
  } catch (e: any) {
    // 🚨 RETHROW instead of returning so the Login component catch runs
    throw e
  } finally {
    setLoading(false)
  }
}

  const signOutFn = async () => {
    setLoading(true)
    try {
      const result = await logout()
      return { error: result.error }
    } catch (e: any) {
      return { error: e?.message ?? 'Failed to sign out' }
    } finally {
      setLoading(false)
    }
  }

  const resetUserPassword = async (email: string) => {
    try {
      const result = await resetPassword(email)
      return { error: result.error }
    } catch (e: any) {
      return { error: e?.message ?? 'Failed to send reset email' }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    googleSignIn,
    signOut: signOutFn,
    resetUserPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
