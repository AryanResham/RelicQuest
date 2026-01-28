import { createContext, useContext } from "react"
import type { User, Session, Provider } from "@supabase/supabase-js"

// Types
type AuthResult = {
  success: boolean;
  data?: { user: User | null; session: Session | null };
  error?: string | unknown;
}

type OAuthResult = {
  success: boolean;
  error?: string | unknown;
}

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUpUser: (email: string, password: string) => Promise<AuthResult>;
  loginUser: (email: string, password: string) => Promise<AuthResult>;
  logoutUser: () => Promise<{ error: Error | null } | AuthResult>;
  signInWithOAuth: (provider: Provider) => Promise<OAuthResult>;
}

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthContextProvider')
  }
  return context
}