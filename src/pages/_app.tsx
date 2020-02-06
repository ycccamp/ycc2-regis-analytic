import React, { useEffect } from 'react'

import App from 'next/app'
import Head from 'next/head'

import { CSSReset, ThemeProvider } from '@chakra-ui/core'

import 'firebase/analytics'
import { firebase } from '../core/services/firebase'

class NextApp extends App {
  public render() {
    const { Component, pageProps } = this.props

    useEffect(() => {
      const instance = firebase()

      instance.analytics()
    }, [])

    return (
      <React.Fragment>
        <Head>
          <title>Young Creator's Camp</title>
        </Head>
        <ThemeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ThemeProvider>
      </React.Fragment>
    )
  }
}

export default NextApp
