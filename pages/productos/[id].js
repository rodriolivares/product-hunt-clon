import { collection, deleteDoc, doc, documentId, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../../firebase'
import { db, storage } from "../../firebase/firebase";
import Error404 from "../../components/layout/404";
import Layout from "../../components/layout/Layout";
import { css } from '@emotion/react'
import Cargando from "../../components/layout/Cargando";
import styled from "@emotion/styled";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";
import Image from "next/image";
// import { deleteObject, ref } from "firebase/storage";

const ContenedorProducto = styled.div`
   @media (min-width:768px) {
      display: grid;
      grid-template-columns: 2fr 1fr;
      column-gap: 2rem;
   }
`;

const CreadorProducto = styled.p`
   padding: 0.5rem 2rem;
   background-color: #DA552F;
   color: #fff;
   text-transform: uppercase;
   font-weight: bold;
   display: inline-block;
   text-align: center;
`;

const Producto = () => {
   const [cargando, setCargando] = useState(true);
   const [producto, setProducto] = useState({});
   const [error, setError] = useState(false);
   const [comentarioMensaje, setComentarioMensaje] = useState("");
   const [consultarDB, setConsultarDB] = useState(true);

   const router = useRouter()
   const { id } = router.query

   const { usuarioAutenticado } = useContext(FirebaseContext)

   useEffect(() => {
      if(id && consultarDB){
         const obtenerProducto = async () => {
            const q = query(collection(db, `productos`), where(documentId(), '==', id));
            const querySnapshot = await getDocs(q);
            (querySnapshot.empty);
            if (!querySnapshot.empty) {
               const unsuscribe = onSnapshot(q, manejarSnapshot)
               setConsultarDB(false)
            } else {
               setError(true);
               setCargando(false)
               setConsultarDB(false)
            }
         }
         const manejarSnapshot = querySnapshot => {
            const producto = querySnapshot.docs.map(doc => { return {
                  id: doc.id,
                  ...doc.data()
               }
            })
            setProducto(producto[0]);
            setConsultarDB(false)
            setCargando(false)
         }
         obtenerProducto()
      }
   }, [id, consultarDB]);

   const { comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos, creador, haVotado } = producto

   const votarProducto = () => {
      if(!usuarioAutenticado) return router.push('/login')
      if(haVotado.includes(usuarioAutenticado.uid)) return   

      const nuevoHaVotado = [...haVotado, usuarioAutenticado.uid]
      const nuevoTotal = votos + 1
      
      updateDoc( doc(db, 'productos/' + id), { 
         votos: nuevoTotal, 
         haVotado: nuevoHaVotado 
      } )

      setProducto({
         ...producto,
         votos: nuevoTotal
      })
      setConsultarDB(true)
   }

   const handleChangeComentario = e => {
      setComentarioMensaje(e.target.value)
   }

   const esCreador = id => {
      if(creador.id === id) return true
   }

   const agregarComentario = e => {
      e.preventDefault()

      if(!usuarioAutenticado) return router.push('/login')

      const comentarioObj = {
         mensaje: comentarioMensaje,
         usuarioId: usuarioAutenticado.uid,
         usuarioNombre: usuarioAutenticado.displayName
      }
      const nuevosComentarios = [ ...comentarios, comentarioObj ];

      updateDoc( doc(db, 'productos/' + id), { comentarios: nuevosComentarios } )
      
      setProducto({
         ...producto,
         comentarios: nuevosComentarios
      })
      setComentarioMensaje("")
      setConsultarDB(true)
   }

   // ToDo: borrar causa que se renderice todo de vuelta, lo cual da error en el detructuring de linea 76
   // const puedeBorrar = () => {
   //    if(!usuarioAutenticado || creador.id !== usuarioAutenticado.uid) return false 
   //    else return true
   // }


   // const eliminarProducto = async () => {
   //    if(!usuarioAutenticado) return router.push('/login')
   //    if(creador.id !== usuarioAutenticado.uid) return router.push('/')

   //    // setCargando(true)
   //    const deleteRef = ref(storage, urlImagen);

   //    try {
   //       await deleteObject(deleteRef)
   //       console.log('img');
   //       await deleteDoc( doc(db, `productos/${id}`) )
   //       console.log('prod');
   //       setProducto({})
   //       // setCargando(false)
   //       setEliminarProducto(false)
   //       // router.push('/')
   //       console.log('eliminado');
   //    } catch (error) {
   //       console.log(error);
   //    }
   // }
   
   return (
      <Layout>
         {cargando ? (
            <Cargando />
         ) : error ? (
            <Error404 msg="Producto no existente" /> 
            ) : creado && (
               <div className="contenedor">
                  <h1 css={css`
                     text-align: center;
                     margin-top: 5rem;
                  `} >{nombre}</h1>

                  <ContenedorProducto>
                     <div>
                        <p>Publicado hace: { formatDistanceToNow(new Date(creado), {locale: es} ) }</p>
                        <p>Por {creador.nombre}, de la Empresa {empresa}</p>
                        <Image 
                           src={urlImagen} 
                           alt={`Imagen Producto ${nombre}`} 
                           layout="responsive"
                           width={800}
                           height={600}
                        />
                        <p>{descripcion}</p>

                        {usuarioAutenticado && (
                           <>
                              <h2>Agrega tu comentario</h2>
                              <form
                                 onSubmit={agregarComentario}
                              >
                                 <Campo>
                                    <input 
                                       type="text" 
                                       name="mensaje"
                                       value={comentarioMensaje}
                                       onChange={handleChangeComentario}
                                    />
                                 </Campo>
                                 <InputSubmit 
                                    type="submit"
                                    value="Agregar Comentario"
                                 />
                              </form>
                           </>
                        )}

                        <h2 css={css`
                           margin: 2rem;
                        `} >Comentarios</h2>
                        {comentarios.length === 0 
                           ? "Aun no hay comentarios" 
                           : ( <ul>
                              {comentarios.map( (comentario, i)=> (
                                 <li
                                    key={`${comentario.usuarioId}-${i}`}
                                    css={css`
                                       
                                       border: 1px solid var(--gris3);
                                       padding: 2rem;
                                    `}
                                 >
                                    <p>{comentario.mensaje}</p>
                                    <p>Escrito por: 
                                       <span
                                          css={css`
                                             font-weight: bold;
                                          `}
                                       >
                                          {' ' + comentario.usuarioNombre}
                                       </span>
                                    </p>
                                    { esCreador(comentario.usuarioId) && ( <CreadorProducto>Es Creador</CreadorProducto>) }
                                 </li>
                              ))}
                           </ul>
                        )}
                     </div>
                     <aside>
                        <Boton
                           target='_blank'
                           bgColor='true'
                           href={url}
                        >Visitar URL</Boton>
                        <div css={css`
                           margin-top: 5rem;
                        `}>

                           {usuarioAutenticado && (
                              <Boton
                                 onClick={votarProducto}
                              >Votar</Boton>
                           )}
                           
                           <p css={css`
                              text-align: center;
                           `}>{votos} Votos</p>
                        </div>
                     </aside>
                  </ContenedorProducto>

                  {/* { puedeBorrar() && 
                     <Boton onClick={() => setEliminarProducto(true)} >Eliminar Producto</Boton>
                  } */}
               </div>
         ) }
      </Layout>
   )
}

export default Producto