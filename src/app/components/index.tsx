import React, { useEffect } from 'react'

import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import { css, Global } from '@emotion/core'

import { useAuth } from '../../core/services/useAuth'

import Auth from './auth'

const App: React.FC = props => {
  const { children } = props

  const auth = useAuth()

  return (
    <React.Fragment>
      <Global
        styles={css`
          html,
          body,
          #__next {
            height: 100%;
          }
        `}
      />
      <ThemeProvider>
        <CSSReset />
        {auth === null ? (
          <Auth user={auth} />
        ) : (
          <React.Fragment>{children}</React.Fragment>
        )}
      </ThemeProvider>
    </React.Fragment>
  )
}

export default App
