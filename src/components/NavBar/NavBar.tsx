import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

export const NavBar: React.FC = () => {
  return (
    <Navbar className="navBar" bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">Mi App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Inicio</Nav.Link>
          <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
          <Nav.Link as={Link} to="/articulos">Artículos</Nav.Link> {/* Nueva ruta */}
          <Nav.Link as={Link} to="/insumos">Insumos</Nav.Link> {/* Nueva ruta */}
          <Nav.Link as={Link} to="/unidades-medida">Unidades Medida</Nav.Link> {/* Nueva ruta */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

