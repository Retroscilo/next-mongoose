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
import { Global } from '@emotion/core'
import { useRouter } from 'next/router'
import { ViewportProvider } from '../lib/hooks/useViewport'
import '../globalStyles.css'

function MyApp ({ Component, pageProps }) {
  const router = useRouter()

  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        onError: err => console.log(err),
      }}
    >
      <ThemeProvider theme={ theme } component={ Component }>
        <div sx={{ minHeight: 'minGlobal' }}>
          <Head>
            <title>Qarte</title>
            <link rel="stylesheet" href="/fonts/fonts.css" />
            <link
              rel="preload"
              href="/fonts/Ubuntu/Ubuntu-Regular.ttf"
              as="font"
              crossOrigin=""
            />
            <link
              rel="preload"
              href="/fonts/Ubuntu/Ubuntu-Medium.ttf"
              as="font"
              crossOrigin=""
            />
            <link
              rel="preload"
              href="/fonts/Ubuntu/Ubuntu-Bold.ttf"
              as="font"
              crossOrigin=""
            />
            <link
              rel="preload"
              href="/fonts/Ubuntu/Ubuntu-Light.ttf"
              as="font"
              crossOrigin=""
            />
          </Head>
          {router.route.toString().indexOf('client') === -1 && <Header />}
          <ViewportProvider>
            <Component {...pageProps} />
          </ViewportProvider>
        </div>
        {router.route.toString().indexOf('client') === -1 && <Footer />}
      </ThemeProvider>
    </SWRConfig>
  )
}

export default MyApp
