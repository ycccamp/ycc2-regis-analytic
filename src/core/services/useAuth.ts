import { useEffect, useState } from 'react'

import { User } from 'firebase/app'

import 'firebase/auth'
import { firebase } from './firebase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const instance = firebase()

    const listener = instance.auth().onAuthStateChanged(res => {
      setUser(res)
    })

    return listener
  }, [])

  return user
}
