import { useEffect, useState } from 'react'
import { auth, IS_FIREBASE_CONFIGURED } from '../lib/firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!IS_FIREBASE_CONFIGURED || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const displayName =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Guest'

  const initials = displayName !== 'Guest' 
    ? displayName.split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('')
    : 'G'

  const hour = new Date().getHours()
  const greeting =
    hour >= 5  && hour < 12 ? `Good morning, ${displayName}.` :
    hour >= 12 && hour < 17 ? `Good afternoon, ${displayName}.` :
    hour >= 17 && hour < 21 ? `Good evening, ${displayName}.` :
                               `Good night, ${displayName}.`

  return {
    user,
    loading,
    displayName,
    initials,
    greeting,
    avatarUrl: user?.photoURL ?? null,
  }
}
