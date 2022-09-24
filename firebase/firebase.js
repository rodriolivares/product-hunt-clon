import { createUserWithEmailAndPassword, getAuth, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

import firebaseConfig from './config'

const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase)
export const storage = getStorage(firebase)

export const registrar = async (nombre, email, password) => {
   const auth = getAuth();

   try {
      const nuevoUsuario = await createUserWithEmailAndPassword( auth, email, password );
      await updateProfile(auth.currentUser, {
         displayName: nombre
      })
   } catch (error) {
      throw error
   }
}

export const login = async (email, password) => {
   const auth = getAuth();

   try {
      const nuevoUsuario = await signInWithEmailAndPassword( auth, email, password ); 
      return nuevoUsuario
   } catch (error) {
      throw error
   }
}

export const cerrarSesion = async () => {
   const auth = getAuth();
   
   try {
      await auth.signOut();
   } catch (error) {
      throw error
   }
}

export default firebase