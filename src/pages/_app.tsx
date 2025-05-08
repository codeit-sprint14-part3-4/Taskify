import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

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
      {' '}
      <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
    </>
  )
}
