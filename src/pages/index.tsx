import React from 'react'

import { NextPage } from 'next'

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/core'

import Overview from '../core/components/overview'
import Track from '../core/components/track'

import { firebase } from '../core/services/firebase'
import { useAuth } from '../core/services/useAuth'

const IndexPage: NextPage = props => {
  const instance = firebase()

  const user = useAuth()

  return (
    <Flex justify='center' py={12}>
      <Box width={[22 / 24, 18 / 24, 16 / 24, 12 / 24]}>
        <Flex align='center' pb={4}>
          <Heading size='xl'>Analytics</Heading>
          <Box mx='auto' />
          {user !== null ? (
            <Box pr={4} display={['none', 'block']}>
              <Text textAlign='right'>{user.displayName}</Text>
              <Text textAlign='right' fontSize='sm' color='gray.500'>
                {user.uid}
              </Text>
            </Box>
          ) : null}
          <Button onClick={() => instance.auth().signOut()}>Logout</Button>
        </Flex>
        <Overview />
        <Track track='developer' title='Developer' />
        <Track track='designer' title='Designer' />
        <Track track='creative' title='Creative' />
      </Box>
    </Flex>
  )
}

export default IndexPage
