import React, { useEffect, useState } from 'react';

const useValidacion = (stateInicial, validar, fn) => {
   const [valores, setValores] = useState(stateInicial);
   const [errores, setErrores] = useState({});
   const [submitForm, setSubmitForm] = useState(false);

   useEffect(() => {
      // console.log(errores);
      if(submitForm) {
         const noErrores = Object.keys(errores).length === 0

         if(noErrores) {
            fn()
         } 
         setSubmitForm(false)
      }
   }, [errores]);

   const handleChange = e => {
      setValores({
         ...valores,
         [e.target.name]: e.target.value
      })
   }

   const handleSubmit = e => {
      e.preventDefault()
      const erroresValidacion = validar(valores)
      setErrores(erroresValidacion)
      setSubmitForm(true)
   }

   const handleBlur = () => {
      const erroresValidacion = validar(valores)
      setTimeout(() => {
         setErrores(erroresValidacion)
      }, 100);
   }

   return {
      valores,
      errores,
      handleSubmit,
      handleChange,
      handleBlur
   }
}

export default useValidacion;