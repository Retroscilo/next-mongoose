/* eslint-disable import/no-extraneous-dependencies */
/** @jsxRuntime classic */
/** @jsx jsx */
/* eslint-disable react/jsx-indent, react/prop-types, react/react-in-jsx-scope */
import { ThemeProvider, jsx } from 'theme-ui'
import theme from '../theme'
import { SWRConfig } from 'swr'
import fetch from '../lib/fetchJson'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Head from 'next/head'
import { ViewportProvider } from '../lib/hooks/useViewport'
import { Global } from '@emotion/core'

function MyApp ({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        onError: err => console.log(err),
      }}
    >
      <ThemeProvider theme={ theme } component={ Component }>
        <div sx={{ minHeight: `calc(100vh - ${theme.sizes.footer}px)` }}>
          <Global styles={theme => ({ '*': { scrollBehavior: 'smooth', listStyle: 'none' }, 'a': { textDecoration: 'none', color: 'inherit' } })} />
          <Head>
            <title>PixMe</title>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet" />
          </Head>
          <Header />
          <ViewportProvider>
            <Component {...pageProps} />
          </ViewportProvider>
        </div>
        <Footer />
      </ThemeProvider>
    </SWRConfig>
  )
}

export default MyApp
