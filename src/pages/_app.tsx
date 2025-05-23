import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import Head from 'next/head'

import { ToastProvider } from '@/context/ToastContext'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <>
      <Head>
        <title>Taskify</title>
      </Head>
      <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
    </>
  )
}
