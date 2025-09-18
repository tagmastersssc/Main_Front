import React, {useState} from 'react'
import logo from "../../assets/logo.jpeg"

const navbarlinks = [
  {
    id:1,
    title: "Inicio",
    link: "#"
  },
  {
    id:2,
    title: "Nosotros",
    link: "#"
  },
  {
    id:3,
    title: "Contacto",
    link: "#"
  },
  {
    id:4,
    title: "Soporte",
    link: "#"
  }
]

const navbarredes =[
  {
    id:1,
    title: "Instagram",
    link: "https://www.instagram.com/",
    icon: "bi bi-instagram"
  },
  {
    id:2,
    title: "Tiktok",
    link: "https://www.tiktok.com/es/",
    icon: "bi bi-tiktok"
  }
]


const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false)

  const toogleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className='fixed top-0 left-0 w-full bg-opacity-30 backdrop-blur-md z-50'>
      <div className='flex justify-between items-center sm:px-12 sm:py-6 px-4 py-3'>
      {/*Logo principal BILIA*/}  
        <div>
          <img src= {logo} alt='Logo del sitio' className='w-[100px]'/>
        </div>
      {/*Icono para la versión mobile*/}
        <button onClick={toogleMenu} className='md:hidden text-white'>
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >

          {isOpen ? (
            <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />) : (
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />)}  
          
           
          </svg>
        </button>
{/*sección de navegación en escritorio*/}
        <div className='hidden md:block'>
          <ul className='flex sm:space-x-8 space-x-4'>
           {navbarlinks.map((link)=>(
            <li key={link.id}>
                <a 
                className='text-white sm:text-lg text-sm hover:text-sky-100 transition-transform hover:scale-110 transform inline-block duration-300' 
                href={link.link}>{link.title}</a>
            </li>
           ))}
          </ul>
        </div>
        {/*sección de redes sociales en escritorio*/}
        <div className='hidden md:block'>
          <ul className='flex space-x-4'>
              {navbarredes.map((link)=>(
                <li key={link.id}>
                  <a 
                  target='_blank'
                  rel='noopener noreference'
                  className='inline-block transition-transform duration-300 transform hover:scale-125'
                  href={link.link}>
                    <i
                    className={`${link.icon} sm:text-2xl text-lg text-white hover:text-sky-200 transition-all duration-300`}
                    >

                    </i>
                  </a>
                </li>
           ))}
          </ul>
        </div>
      </div>
      {/*Menu mobile navegación*/}

           <div className={`md:hidden absolute w-full bg-gray-500 transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
            <ul className='felx flex-col px-4 py-2'>
              {navbarlinks.map((link)=>(
                <li key={link.id} className='py-2 text-center'>
                 <a 
                className='text-white hover:text-sky-200' 
                href={link.link}
                onClick={()=>setIsOpen(false)}
                
                >{link.title}</a>
                </li>
           ))}
            </ul>
            {/*Menu mobile redes sociales*/}
            <ul className='flex space-x-4 px-4 py-2 border-t border-gray-500 justify-center'>
              {navbarredes.map((link)=>(
                <li key={link.id}>
                  <a 
                  target='_blank'
                  rel='noopener noreference'
                  className='inline-block'
                  href={link.link}
                  onClick={()=>setIsOpen(false)}>
                    <i
                    className={`${link.icon} text-lg text-white hover:text-sky-200`}
                    >

                    </i>
                  </a>
                </li>
           ))}
          </ul>
           </div>



    </nav>
  )
}

export default Navbar
