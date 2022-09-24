import React, { useState } from "react"
import { Formulario, Campo, InputSubmit, Error } from "../components/ui/Formulario"
import { css } from "@emotion/react"
import useValidacion from "../hooks/useValidacion"
import validarIniciarSesion from "../validacion/validarIniciarSesion"
import { login } from "../firebase/firebase"
import { useRouter } from "next/router"

import Layout from "../components/layout/Layout"

const STATE_INICIAL = {
  email: '',
  password: ''
}

export default function Login() {
  const [error, setError] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion)

  const router = useRouter()

  const { email, password } = valores

  async function iniciarSesion() {
    console.log('Iniciando');
    try {
      const usuario = await login(email, password)
      router.push('/')
    } catch (error) {
      console.log('error.message');
      setError(error.message)
    }
  }

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Iniciar Sesión</h1> 
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
            <Campo>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                placeholder="Tu Email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>

            {errores.email && <Error>{errores.email}</Error>}

            <Campo>
              <label htmlFor="password">Password</label>
              <input 
                type="password"
                id="password"
                placeholder="Tu Password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>

            {errores.password && <Error>{errores.password}</Error>}

            {error && <Error>{error}</Error>}

            <InputSubmit 
              type="submit" 
              value="Iniciar Sesión"
            />
          </Formulario>
        </>
      </Layout>
    </div>
  )
}
