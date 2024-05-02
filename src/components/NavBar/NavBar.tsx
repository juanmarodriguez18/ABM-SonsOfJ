import { Link, useLocation } from "react-router-dom"
import './NavBar.css'

export const NavBar = () => {
  const location = useLocation()
  console.log(location)
  return (
    <div className="NavBar">

      <Link to="" style={{ textDecoration: "none", color: location.pathname === '/' ? 'black' : 'grey' }} className="links">
        Inicio
      </Link>
      <Link to="/contacto" style={{ textDecoration: "none", color: location.pathname === '/contacto' ? 'black' : 'grey' }} className="links">
        Contacto
      </Link>
    </div>

  )
}
