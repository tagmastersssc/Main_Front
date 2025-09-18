import React from 'react'
import Imagen from '../../assets/logo.jpeg'
import servicio from '../../assets/trato.png'
const Hero = () => {
  return (
    <section className='mt-36'>

      <div className='grid grid-cols-1 md:grid-cols-2'>

        {/*Textos*/}
        <div className='p-10 sm:p-10 md:p-15 lg:p-30 xl:p-36'>
          <img src={Imagen} alt='Imagen de servicio'/>
          <p className='text-white py-12'>
            Impulsamos el crecimiento de las PYMES a través de soluciones tecnológicas
            innovadoras y adaptadas a sus necesidades. Desde optimización de procesos hasta 
            implementación de herramientas digitales, nuestra misión es simplificar la gestión empresarial, mejorar 
            la eficiencia y potenciar la competitividad de cada cliente en un entorno digital en 
            constante evolución.
          </p>
          <div className='flex justify-center gap-4'>
            <a className='bg-gray-600 py-2 px-12 rounded-3xl text-white hover:bg-gray-800 transition-all duration-300 items-center cursor-pointer'>
              Quiero dar el siguiente paso 
              <i className='bi bi-person-hearts text-xl m1-2'></i>
            </a>
            <a className='text-white flex items-center cursor-pointer'>
              Cuentame más 
              <i className='bi bi-youtube text-xl m1-2'></i> 
            </a>
          </div>
        </div>


        {/*Imagenes*/}
        <div className='p-10 sm:p-10 md:p-15 lg:p-30 xl:p-36'>
          <img src={servicio} alt='Imagen corporativa'/>
        </div>

      </div>
    </section>
  )
}

export default Hero
