import styled from "@emotion/styled";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

const Producto = styled.li`
   padding: 4rem;
   display: flex;
   justify-content: space-between;
   align-items: center;
   border-bottom: 1px solid #e1e1e1;
   &:last-of-type {
      border-bottom: 0px;
   }
`;

const DescripcionProducto = styled.div`
   flex: 0 1 600px;
   display: grid;
   grid-template-columns: 1fr 3fr;
   column-gap: 2rem;
`;

const Titulo = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin: 0;

  :hover {
   cursor: pointer;
  }
`;

const TextoDescripcion = styled.p`
   font-size: 1.6rem;
   margin: 0;
   color: #888;
   @media (prefers-color-scheme: dark) {
      color: var(--gris3);
   }
`;

const Comentarios = styled.div`
   margin-top: 2rem;
   display: flex;
   align-items: center;
   div {
      display: flex;
      align-items: center;
      padding: .3rem 1rem;
      margin-right: 2rem;
      border: 1px solid #e1e1e1;
      @media (prefers-color-scheme: dark) {
         border: 1px solid var(--gris2);
      }
   }
   img {
      width: 2rem;
      margin-right: 2rem;
      @media (prefers-color-scheme: dark) {
         filter: invert(100%);
      }
   }
   p {
      font-size: 1.6rem;
      margin: 0 0 0 1rem;
      font-weight: 700;
   }
`;

const Imagen = styled.img`
   width: 200px;
`;

const Votos = styled.div`
   flex: 00 auto;
   text-align: center;
   border: 1px solid #e1e1e1;
   padding: 1rem 3rem;
   div {
      font-size: 2rem;
   }
   p {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
   }
`;

const DetallesProducto = ({producto}) => {
   
   const { id, comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos } = producto
   
   return (
      <Producto>
         <DescripcionProducto>
            <div>
               <Imagen src={urlImagen} alt="" />
            </div>
            <div>
               <Link href="/productos/[id]" as={`/productos/${id}`}>
                  <Titulo>{nombre}</Titulo>
               </Link>
               <TextoDescripcion>{descripcion}</TextoDescripcion>
               <Comentarios>
                  <div>
                     {/* <img src="img/comentario.png" alt="imagen comentario" /> */}
                     <Image 
                        src='/img/comentario.png'
                        alt='Imagen comentario'
                        layout="fixed"
                        width='20'
                        height='20'
                        
                     />
                     <p>{comentarios.length} Comentarios</p>
                  </div>
               </Comentarios>

               <p>Publicado hace: { formatDistanceToNow(new Date(creado), {locale: es} ) }</p>
            </div>
         </DescripcionProducto>
         <Votos>
            <div> &#9650; </div>
            <p>{votos}</p>
         </Votos>
      </Producto>
   )
}

export default DetallesProducto