import React, { useEffect, useState } from 'react'

import 'firebase/firestore'
import { firebase } from '../services/firebase'

import {
  Box,
  Collapse,
  Flex,
  Heading,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/core'

import Step from './step'

import { ITrackProps } from '../@types/ITrackProps'

type IStat = number | null | undefined

const Track: React.FC<ITrackProps> = props => {
  const { track, title } = props

  const instance = firebase()

  const [trackOpen, setTrackOpen] = useState<boolean>(false)

  const [overview, setOverview] = useState<{
    total: IStat
    locked: IStat
  }>({
    total: null,
    locked: null,
  })

  const trackRef = instance
    .firestore()
    .collection('registration')
    .where('track', '==', track)

  const fetchOverview = async () => {
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
    if (
      trackOpen &&
      (typeof overview.total !== 'number' ||
        typeof overview.locked !== 'number')
    ) {
      fetchOverview()
    }
  }, [trackOpen])

  return (
    <Box py={4}>
      <Flex
        align='center'
        cursor='pointer'
        onClick={() => setTrackOpen(o => !o)}>
        <Icon size='28px' name={trackOpen ? 'chevron-down' : 'chevron-right'} />
        <Heading size='lg' pl={2}>
          Track: {title}
        </Heading>
      </Flex>
      <Collapse isOpen={trackOpen} py={2}>
        <Box py={4}>
          <Heading size='md' pb={2}>
            Overview
          </Heading>
          <Flex>
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
          </Flex>
        </Box>
        <Box py={4}>
          <Heading size='md' pb={2}>
            Leftover steps
          </Heading>
          {[1, 2, 3, 4, 5].map(step => (
            <Step
              key={`analytic-${track}-step-${step}`}
              track={track}
              step={step}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  )
}

export default Track
