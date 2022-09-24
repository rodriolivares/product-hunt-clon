import { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from "../firebase";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";


const useProductos = orden => {
   const [productos, setProductos] = useState([]);
   const { firebase } = useContext(FirebaseContext)
   useEffect(() => {
     const obtenerProductos = () => {
       const q = query(collection(db, "productos"), orderBy(orden, "desc"));
 
       const unsuscribe = onSnapshot(q, manejarSnapshot)
     }
     obtenerProductos()
   }, []);
   
   const manejarSnapshot = querySnapshot => {
     const productos = querySnapshot.docs.map(doc => {
       return {
         id: doc.id,
         ...doc.data()
       }
     })
     setProductos(productos);
   }
   
   return {
      productos
   }
}

export default useProductos