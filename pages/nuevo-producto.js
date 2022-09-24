import React, { useContext, useDeferredValue, useEffect, useState } from "react"
import Layout from "../components/layout/Layout"
import { Formulario, Campo, InputSubmit, Error } from "../components/ui/Formulario"
import { css } from "@emotion/react"
import { db, storage } from "../firebase/firebase"
import { useRouter } from "next/router"

import useValidacion from "../hooks/useValidacion"
import validarCrearProducto from "../validacion/validarCrearProducto"
import { FirebaseContext } from "../firebase"
import { addDoc, collection } from "firebase/firestore"
import FileUploader from "react-firebase-file-uploader";
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import Error404 from "../components/layout/404"

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  // imagen: '',
  url: '',
  descripcion: ''
}

export default function NuevoProducto() {
  const [error, setError] = useState(false);
  const [image, setImage] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [producto, setProducto] = useState({});

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto)

  const router = useRouter()

  const { nombre, empresa, imagen, url, descripcion } = valores

  const { usuarioAutenticado } = useContext(FirebaseContext)

  async function crearProducto() {
    if(!usuarioAutenticado) {
      return router.push('/login')
    }

    // Se obtiene referencia de la ubicación donde se guardará la imagen
    const nombreImagen = Math.random().toString(32).substring(2) + Date.now().toString(32)
    const imageRef = ref(storage, `products/${image.lastModified}${nombreImagen}`);

    // Se inicia la subida
    setSubiendo(true);
    const uploadTask = uploadBytesResumable(imageRef, image);

    // Registra eventos para cuando detecte un cambio en el estado de la subida
    uploadTask.on('state_changed', 
      // Muestra progreso de la subida
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Subiendo imagen: ${progress}% terminado`);
      },
      // En caso de error
      error => {
        setSubiendo(false);
        console.error(error);
        setError(error)
        throw error
      },
      // Subida finalizada correctamente
      async () => {
        setSubiendo(false);
        const urlImagen = await getDownloadURL(uploadTask.snapshot.ref)
        console.log('Imagen disponible en:', urlImagen);
        const producto = {
          nombre,
          empresa,
          url,
          urlImagen,
          descripcion,
          votos: 0,
          comentarios: [],
          creado: Date.now(), 
          creador: {
            id: usuarioAutenticado.uid,
            nombre: usuarioAutenticado.displayName
          },
          haVotado: []
        };
        setImage([])
        await addDoc(collection(db,"productos"), producto);
        console.log("producto creado");
        return router.push('/')
      }
    );
  }

  return (
    <div>
      <Layout>
        { !usuarioAutenticado ? <Error404 msg="No se puede mostrar" /> : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >Nuevo Producto</h1> 
            <Formulario
              onSubmit={handleSubmit}
              noValidate
            >
              <fieldset>
                <legend>Informacion</legend>
              
                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text" 
                    id="nombre"
                    placeholder="Nombre del Producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.nombre && <Error>{errores.nombre}</Error>}
                
                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input 
                    type="text" 
                    id="empresa"
                    placeholder="Tu Empresa"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.empresa && <Error>{errores.empresa}</Error>}
                
                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <input
                    accept="image/*"
                    type="file"
                    id="image"
                    name="image"
                    onChange={e => setImage(e.target.files[0]) }
                  />
                </Campo>

                <Campo>
                  <label htmlFor="url">URL</label>
                  <input 
                    type="url" 
                    id="url"
                    placeholder="URL de tu Producto"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.url && <Error>{errores.url}</Error>}

              </fieldset>

              <fieldset>
                <legend>Sobre tu Producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea 
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>
              {error && <Error>{error}</Error>}

              <InputSubmit 
                type="submit" 
                value="Crear Producto"
              />
            </Formulario>
          </>
        )}
        
      </Layout>
    </div>
  )
}
