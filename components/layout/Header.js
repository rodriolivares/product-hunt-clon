import React, { useContext } from 'react'
import Link from "next/link"
import styled from "@emotion/styled"
import { css } from "@emotion/react"
import Buscar from "../ui/Buscar"
import Navegacion from "./Navegacion"
import Boton from "../ui/Boton"
import { FirebaseContext } from "../../firebase"
import { cerrarSesion } from "../../firebase/firebase"
import { useRouter } from "next/router"


const ContenedroHeader = styled.div`
   max-width: 1200px;
   width: 95%;
   margin: 0 auto;
   @media (min-width: 768px) {
      display: flex;
      justify-content: space-between;
   }
`
const Logo = styled.a`
   color: var(--naranja);
   font-size: 4rem;
   line-height: 0;
   font-weight: 700;
   font-family: 'Roboto Slab', serif;
   margin-right: 2rem;
`;
 
const Header = () => {

   const { usuarioAutenticado } = useContext(FirebaseContext)

  const router = useRouter()

   const usuario = false

   return (
      <header
         css={css`
            border-bottom: 2px solid var(--gris3);
            padding: 1rem 0;
         `}
      >
         <ContenedroHeader>
            <div
               css={css`
                  display: flex;
                  align-items: center;
               `}
            >
               <Link href="/" >
                  <Logo
                     css={css`
                        &:hover {
                           cursor: pointer;
                        }
                     `}
                  >P</Logo>
               </Link>
               
               <Buscar />
               <Navegacion />
            </div>

            <div
               css={css`
                  display: flex;
                  align-items: center;
               `}
            >
               { usuarioAutenticado ? (
                  <>
                     <p
                        css={css`
                           margin-right: 2rem;
                        `}
                     >Hola: {usuarioAutenticado.displayName}</p>
                     <Boton
                        bgColor="true"
                        onClick={() => {
                           cerrarSesion()
                           router.push('/login')
                        }}
                     >Cerrar Sesión</Boton>
                  </>
               ) : (
                  <>
                     <Link href="/login">
                        <Boton
                           bgColor="true"
                        >Login</Boton>
                     </Link>

                     <Link href="/crear-cuenta">
                        <Boton
                           bgColor="true"
                        >Crear Cuenta</Boton>
                     </Link>
                  </>
               ) }
            </div>
         </ContenedroHeader>
      </header>
   )
}

export default Header