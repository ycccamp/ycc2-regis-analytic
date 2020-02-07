import React, { useEffect, useState } from 'react'

import { useTable } from 'react-table'

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

import { IStepProps } from '../@types/IStepProps'

interface ICamper {
  name: {
    th: string
    en: string
  }
  phone: string
}

const Step: React.FC<IStepProps> = props => {
  const { step, track } = props

  const instance = firebase()

  const [stepOpen, setStepOpen] = useState<boolean>(false)

  const [amount, setAmount] = useState<number | null | undefined>(null)

  const [camper, setCamper] = useState<{
    loading: boolean
    error: boolean
    data: ICamper[]
  }>({ loading: true, error: false, data: [] })

  const stepRef = instance
    .firestore()
    .collection('registration')
    .where('track', '==', track)
    .where('step', '==', step)

  const fetchCampers = async () => {
    const snapshot = await stepRef.get()

    const res = snapshot.docs.map(async doc => {
      const personalDoc = await instance
        .firestore()
        .collection('registration')
        .doc(doc.id)
        .collection('forms')
        .doc('personal')
        .get()

      const data = personalDoc.data()

      if (data === undefined) {
        return undefined
      } else {
        return {
          name: {
            th: `${data.firstname} ${data.lastname}`,
            en: `${data.firstnameEn} ${data.lastnameEn}`,
          },
          phone: `${data.phone}`,
        }
      }
    })

    await Promise.all(res).then(res => {
      setCamper(prev => ({
        ...prev,
        loading: false,
        data: res.filter(o => o !== undefined),
      }))
    })
  }

  useEffect(() => {
    stepRef
      .get()
      .then(snapshot => setAmount(snapshot.size))
      .catch(() => setAmount(undefined))
  }, [])

  useEffect(() => {
    if (stepOpen && camper.data.length === 0) {
      fetchCampers()
    }
  }, [stepOpen])

  return (
    <Box py={2} px={2}>
      <Flex
        align='center'
        cursor='pointer'
        onClick={() => setStepOpen(o => !o)}>
        <Icon name={stepOpen ? 'chevron-down' : 'chevron-right'} />
        <Heading size='sm' pl={2}>
          Step {step} (
          {amount === null ? '--' : amount === undefined ? '!ERR' : amount}{' '}
          people)
        </Heading>
      </Flex>
      <Collapse isOpen={stepOpen} py={2}>
        {camper.error
          ? '!ERR'
          : camper.loading
          ? 'Loading...'
          : JSON.stringify(camper.data)}
      </Collapse>
    </Box>
  )
}

export default Step
