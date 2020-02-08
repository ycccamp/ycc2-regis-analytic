import React, { useEffect, useState } from 'react'

import Router from 'next/router'

import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/core'

import { auth } from 'firebase/app'
import 'firebase/auth'
import { firebase } from '../../core/services/firebase'

import { IAuthProps } from '../@types/IAuthProps'

const AuthComponent: React.FC<IAuthProps> = props => {
  const { user } = props

  const instance = firebase()

  const [stage, setStage] = useState<number>(0)

  const [isLoginButtonLoad, setIsLoginButtonLoad] = useState<boolean>(false)

  const loginHandler = (provider: auth.AuthProvider) => {
    setIsLoginButtonLoad(true)

    instance
      .auth()
      .signInWithRedirect(provider)
      .catch(e => {
        if (e === 'auth/popup-closed-by-user') {
          // TODO: Handle auth error
        } else {
          // TODO: Handle auth error
        }
      })
      .finally(() => {
        setIsLoginButtonLoad(false)
      })
  }

  useEffect(() => {
    instance.auth().getRedirectResult()

    if (user === null) {
      setStage(1)
    } else {
      setStage(2)
    }
  }, [user])

  useEffect(() => {
    Router.push('/')
  }, [])

  return (
    <Flex height='100%' justify='center' align='center' pb={10}>
      {stage === 0 ? (
        <Flex flexWrap='wrap' justifyContent='center' py={10}>
          <Spinner size='lg' />
          <Text width='100%' textAlign='center' pt={4}>
            Authenticating...
          </Text>
        </Flex>
      ) : stage === 1 ? (
        <Flex flexWrap='wrap' justifyContent='center' py={10}>
          <Text width='100%' textAlign='center' pb={4}>
            Authentication required
          </Text>
          <Button
            isLoading={isLoginButtonLoad}
            onClick={() => loginHandler(new auth.GoogleAuthProvider())}>
            Sign-in with Google
          </Button>
          <Box width='100%' py={2} />
          <Button
            isLoading={isLoginButtonLoad}
            onClick={() => loginHandler(new auth.FacebookAuthProvider())}
            variantColor='facebook'>
            Sign-in with Facebook
          </Button>
        </Flex>
      ) : (
        <Flex flexWrap='wrap' justifyContent='center' py={10}>
          <Spinner />
        </Flex>
      )}
    </Flex>
  )
}

export default AuthComponent
