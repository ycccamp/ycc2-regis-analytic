import React, { useEffect, useState } from 'react'

import { NextPage } from 'next'

import {
  Box,
  Button,
  Flex,
  Heading,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/core'

import Track from '../core/components/track'

import 'firebase/firestore'
import { firebase } from '../core/services/firebase'

const IndexPage: NextPage = props => {
  const instance = firebase()

  const [overview, setOverview] = useState<{
    total: number | null | undefined
    locked: number | null | undefined
  }>({
    total: null,
    locked: null,
  })

  const fetchOverview = async () => {
    const trackRef = instance.firestore().collection('registration')

    trackRef
      .get()
      .then(totalSnapshot => {
        setOverview(o => ({ ...o, total: totalSnapshot.size }))
      })
      .catch(() => setOverview(o => ({ ...o, total: undefined })))

    trackRef
      .where('isLocked', '==', true)
      .get()
      .then(lockSnapshot => {
        setOverview(o => ({ ...o, locked: lockSnapshot.size }))
      })
      .catch(() => setOverview(o => ({ ...o, locked: undefined })))
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  return (
    <Flex justify='center' pt={8}>
      <Box width={[22 / 24, 18 / 24, 16 / 24, 12 / 24]}>
        <Flex align='center'>
          <Heading size='xl'>Analytics</Heading>
          <Box mx='auto' />
          <Button onClick={() => instance.auth().signOut()}>Logout</Button>
        </Flex>
        <Box py={4}>
          <Heading size='md'>Overview</Heading>
          <StatGroup pt={2}>
            <Stat>
              <StatLabel>Total</StatLabel>
              <StatNumber>
                {overview.total === null
                  ? '--'
                  : overview.total === undefined
                  ? '!ERR'
                  : overview.total}
              </StatNumber>
              <StatHelpText>people</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Registered</StatLabel>
              <StatNumber>
                {overview.locked === null
                  ? '--'
                  : overview.locked === undefined
                  ? '!ERR'
                  : overview.locked}
              </StatNumber>
              <StatHelpText>people</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Leftover</StatLabel>
              <StatNumber>
                {overview.total === undefined || overview.locked === undefined
                  ? '!ERR'
                  : overview.total === null || overview.locked === null
                  ? '--'
                  : overview.total - overview.locked}
              </StatNumber>
              <StatHelpText>people</StatHelpText>
            </Stat>
          </StatGroup>
        </Box>
        <Track track='developer' title='Developer' />
        <Track track='designer' title='Designer' />
        <Track track='creative' title='Creative' />
      </Box>
    </Flex>
  )
}

export default IndexPage
