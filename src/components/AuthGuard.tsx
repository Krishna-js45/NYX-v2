import { useAuth } from '../hooks/useAuth'
import AuthScreen from './AuthScreen'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  // Bypassing auth check and directly going inside the app
  return <>{children}</>
}
