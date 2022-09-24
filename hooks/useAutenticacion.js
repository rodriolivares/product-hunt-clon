import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from 'react';

function useAutenticacion() {
   const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

   useEffect(() => {
      const auth = getAuth()
      
      const unsuscribe = auth.onAuthStateChanged( usuario => {
         if (usuario) {
            setUsuarioAutenticado(usuario)
         } else {
            setUsuarioAutenticado(null)
         }
      })
      return () => unsuscribe()
   }, []);

   return usuarioAutenticado
}

export default useAutenticacion