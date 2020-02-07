import React from 'react'

import App from 'next/app'
import Head from 'next/head'

import 'firebase/analytics'
import { firebase } from '../core/services/firebase'

import AppShell from '../app/components'

class NextApp extends App {
  public componentDidMount() {
    const instance = firebase()

    instance.analytics()
  }

  public render() {
    const { Component, pageProps } = this.props

    return (
      <React.Fragment>
        <Head>
          <title>Young Creator's Camp</title>
          <link rel='shortcut icon' href='/static/favicon-2020.ico' />
          <link
            rel='apple-touch-icon-precomposed'
            href='/static/favicon-2020.ico'
          />
        </Head>
        <AppShell>
          <Component {...pageProps} />
        </AppShell>
      </React.Fragment>
    )
  }
}

export default NextApp
