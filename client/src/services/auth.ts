import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from './firebase'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName })
    }
    
    return {
      user: userCredential.user,
      error: null
    }
  } catch (error: any) {
    console.error('Sign up error:', error)
    return {
      user: null,
      error: error.code || error.message
    }
  }
}

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return {
      user: userCredential.user,
      error: null
    }
  } catch (error: any) {
    console.error('Sign in error:', error)
    return {
      user: null,
      error: error.code || error.message
    }
  }
}

// Sign in with Google - Enhanced with popup fallback
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    
    // Add scopes for basic profile info
    provider.addScope('email')
    provider.addScope('profile')
    
    console.log('🟡 Attempting Google sign-in with popup...')
    
    try {
      // First try popup method (faster when it works)
      const result = await signInWithPopup(auth, provider)
      console.log('🟢 Google popup sign-in successful!')
      
      return {
        user: result.user,
        error: null
      }
    } catch (popupError: any) {
      console.warn('🟡 Popup failed, trying redirect...', popupError.code)
      
      // If popup fails due to blocking or other issues, try redirect
      if (popupError.code === 'auth/popup-blocked' || 
          popupError.code === 'auth/cancelled-popup-request' ||
          popupError.message?.includes('popup')) {
        
        console.log('🔄 Using redirect method...')
        await signInWithRedirect(auth, provider)
        
        // Redirect initiated, return null (result handled on return)
        return {
          user: null,
          error: null
        }
      }
      
      // Handle user cancellation gracefully
      if (popupError.code === 'auth/popup-closed-by-user') {
        console.log('🔴 User cancelled Google sign-in')
        return {
          user: null,
          error: 'cancelled'
        }
      }
      
      // Re-throw other errors
      throw popupError
    }
    
  } catch (error: any) {
    console.error('🔴 Google sign-in failed:', error)
    return {
      user: null,
      error: error.code || error.message
    }
  }
}

// Check for redirect result on page load
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth)
    if (result) {
      console.log('� Google redirect sign-in successful!')
      return {
        user: result.user,
        error: null
      }
    }
    return {
      user: null,
      error: null
    }
  } catch (error: any) {
    console.error('🔴 Google redirect result error:', error)
    return {
      user: null,
      error: error.code || error.message
    }
  }
}

// Sign out
export const logout = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Convert Firebase User to AuthUser
export const convertFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  }
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Helper function to get user-friendly error messages
export const getAuthErrorMessage = (errorCode: string): string => {
  console.log('Error code received:', errorCode)
  
  switch (errorCode) {
    case 'Firebase: Error (auth/user-not-found).':
      return 'No user found with this email address.'
    case 'Firebase: Error (auth/wrong-password).':
      return 'Incorrect password.'
    case 'Firebase: Error (auth/invalid-credential).':
      return 'Invalid credentials. Please check your email and password.'
    case 'Firebase: Error (auth/email-already-in-use).':
      return 'An account with this email already exists.'
    case 'Firebase: Error (auth/weak-password).':
      return 'Password should be at least 6 characters.'
    case 'Firebase: Error (auth/invalid-email).':
      return 'Please enter a valid email address.'
    case 'Firebase: Error (auth/user-disabled).':
      return 'This account has been disabled.'
    case 'Firebase: Error (auth/too-many-requests).':
      return 'Too many failed attempts. Please try again later.'
    case 'Firebase: Error (auth/network-request-failed).':
      return 'Network error. Please check your connection.'
    case 'Firebase: Error (auth/popup-closed-by-user).':
      return 'Sign-in popup was closed before completion.'
    case 'Firebase: Error (auth/cancelled-popup-request).':
      return 'Sign-in was cancelled.'
    case 'Firebase: Error (auth/popup-blocked).':
      return 'Popup blocked by browser. Please allow popups for this site.'
    case 'Firebase: Error (auth/operation-not-allowed).':
      return 'Email/password authentication is not enabled. Please contact support.'
    case 'Firebase: Error (auth/invalid-login-credentials).':
      return 'Invalid login credentials. Please check your email and password.'
    case 'Firebase: Error (auth/email-already-in-use).':
        return 'An account with this email already exists.'
    default:
      console.warn('Unhandled auth error code:', errorCode)
      return `Authentication error: ${errorCode}`
  }
}