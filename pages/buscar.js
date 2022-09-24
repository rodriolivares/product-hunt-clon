import { useRouter } from "next/router"
import Layout from "../components/layout/Layout"
import DetallesProducto from "../components/layout/DetallesProducto";
import useProductos from "../hooks/useProductos";
import { useEffect, useState } from "react";

export default function Buscar() {
  const router = useRouter()
  const { q } = router.query;
  
  const { productos } = useProductos('creado')
  const [resultado, setResultado] = useState([]);
  
  useEffect(() => {
    if(q) {
      const busqueda = q.toLowerCase()
  
      const filtro = productos.filter(producto => producto.nombre.toLowerCase().includes(busqueda) )
      setResultado(filtro);
    }

  }, [q, productos]);


  return (
    <div>
      <Layout>
      <div className="listado-productos" >
          <div className="contenedor">
            <ul className="bg-white">
              {resultado.map(producto => (
                <DetallesProducto 
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}
