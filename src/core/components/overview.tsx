import React, { useEffect, useState } from 'react'

import {
  Box,
  Heading,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/core'

import 'firebase/firestore'
import { firebase } from '../services/firebase'

const Overview: React.FC = props => {
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
  )
}

export default Overview
