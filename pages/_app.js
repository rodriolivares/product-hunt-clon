import React from 'react'
import Head from 'next/head'
import firebase, { FirebaseContext } from "../firebase"
import useAutenticacion from "../hooks/useAutenticacion"
import '../public/styles/app.css'
import 'normalize.css/normalize.css';

function MyApp({ Component, pageProps }) {
  const usuarioAutenticado = useAutenticacion()
  
  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        usuarioAutenticado
      }}
    >
      <Head>
        <title>Product Hunt Firebase y Next.js</title>
      </Head>
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  )
}

export default MyApp
