import React, { useContext } from 'react'
import Link from "next/link"
import styled from "@emotion/styled"
import { FirebaseContext } from "../../firebase"

const Nav = styled.nav`
   padding-left: 2rem;

   a {
      font-size: 2rem;
      margin-left: 2rem;
      color: var(--gris2);
      font-family: 'PT Sans', sans-serif;

      &:last-of-type {
         margin-right: 0;
      }
   }
   @media (prefers-color-scheme: dark) {
      a {
         color: var(--gris3);
      }
   }
`;
const Navegacion = () => {
   const { usuarioAutenticado } = useContext(FirebaseContext)

   return (
      <Nav>
         <Link href="/"><a>Inicio</a></Link>
         <Link href="/populares"><a>Populares</a></Link>
         { usuarioAutenticado && (
            <Link href="/nuevo-producto"><a>Nuevo Producto</a></Link>
         )}
      </Nav>
   )
}

export default Navegacion