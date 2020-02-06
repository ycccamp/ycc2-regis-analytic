import firebaseApp from 'firebase/app'

interface IConfig {
  apiKey: string
  appId: string
  authDomain: string
  databaseURL: string
  measurementId: string
  messagingSenderId: string
  projectId: string
  storageBucket: string
}

export const firebase = () => {
  if (!firebaseApp.apps.length) {
    const config: IConfig = {
      apiKey: 'AIzaSyBoT3SIWbgGNf7QEqMIL8p3mHUWe7y-HuI',
      authDomain: 'ycc2020.firebaseapp.com',
      databaseURL: 'https://ycc2020.firebaseio.com',
      projectId: 'ycc2020',
      storageBucket: 'ycc2020.appspot.com',
      messagingSenderId: '959291668430',
      appId: '1:959291668430:web:70e6d3d683c52b71879d9f',
      measurementId: 'G-6GR44EQ40G',
    }

    return firebaseApp.initializeApp(config)
  } else {
    return firebaseApp.app()
  }
}
