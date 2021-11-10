import React from "react";
import { useHistory } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Picture from '../Picture/Anticipation_picture.png'

const Navbartop = () => {
    
    let pageEvent = useHistory();

    return (
        <Navbar bg="light" variant="light">
        <Navbar.Brand>
            <img
            alt=""
            src={Picture}
            width="30"
            height="30"
            className="d-inline-block align-top"
            />
            TQ PUSH
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link onClick={()=> pageEvent.push("/")} >Connexion</Nav.Link>
          <Nav.Link onClick={()=> pageEvent.push("/Event")}>Event</Nav.Link>
          <Nav.Link onClick={()=> pageEvent.push("/ReadPDF")}>PDF IOC</Nav.Link>
        </Nav>
    </Navbar>
    )
}

export default Navbartop;