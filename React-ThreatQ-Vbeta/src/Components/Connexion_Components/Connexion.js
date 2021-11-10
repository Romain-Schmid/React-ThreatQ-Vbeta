import React, { useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Connexion.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Picture from '../Picture/Anticipation_picture.png'
import Navbartop from '../Navbar/Navbar.js'

//Récupération du token et envoie vers composant parant App.js via la fonction parent {GetToken}
//Utilisation de useHistory pour le renvoie sur la page Event
const Connexion = ({ GetToken }) => {

  let pageEvent = useHistory();

  //Affichage de la PopUp
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function PopUpAlert() {  
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Erreur de connexion !</Modal.Title>
          </Modal.Header>
          <Modal.Body> 
            Erreur de connexion veuillez ressayer.
            Vous pouvez trouver votre IDclient dans cotre compte utilisateur dans ThreatQ.
            Détail de l'erreur dans la console.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  //Utilisation de useHistory (pageEvent.push) pour le renvoie sur la page Event et utilisason de axios pour récupération du Token
  let pushID = async (Id, Mdp, Client, Ip) => {
    const Apinfo = {
      email: Id,
      password: Mdp,
      grant_type: "password",
      client_id: Client,
    };
    try {
      const { data } = await axios.post("https://" + Ip + "/api/token", Apinfo);
      const { access_token } = data;
      GetToken(access_token, Ip);
      pageEvent.push("/Event");
    } catch (error) {
      //alert(error + "\nConnexion échouée veuillez ressayer");
      console.log(error);
      handleShow();
    }
  };

  //Récupération des informations de connexions
  const [valueId, setvalueId] = useState("romain");
  const [valueMdp, setvalueMdp] = useState("Azertyuiop123456!");
  const [valueClient, setvalueClient] = useState(
    "4adaa1a29b20176876f4d357783b072a"
  );
  const [valueIp, setvalueIp] = useState("192.168.56.101");


  return (
    <Fragment>
      <Navbartop />
      <div className="BorderConnexion">
      <div>
        <h1>Page de Connexion</h1>
      </div>

      <Form className="FormConnexion">
        <Form.Group as={Row} controlId="formHorizontalId">
        <Col sm={2}/>
          <Form.Label column sm={2}>
            Identifiant :
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              value={valueId}
              onChange={(event) => setvalueId(event.target.value)}
              placeholder="Identifiant"
            />
          </Col>
          <Col sm={2}/>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalPassword">
        <Col sm={2}/>
          <Form.Label column sm={2}>
            Password :
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              value={valueMdp}
              onChange={(event) => setvalueMdp(event.target.value)}
              placeholder="Mot de passe"
              type="password"
            />
          </Col>
          <Col sm={2}/>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalCliendId">
        <Col sm={2}/>
          <Form.Label column sm={2}>
            ClientId :
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              value={valueClient}
              onChange={(event) => setvalueClient(event.target.value)}
              placeholder="Client Id - exemple : 40a65ef084..."
            />
          </Col>
          <Col sm={2}/>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalIP">
        <Col sm={2}/>
          <Form.Label column sm={2}>
            Ip adress :
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              value={valueIp}
              onChange={(event) => setvalueIp(event.target.value)}
              placeholder="Adresse IP ThreatQ"
            />
          </Col>
          <Col sm={2}/>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={{ span: 8, offset: 2 }}>
            <Button
              variant="light"
              onClick={() => pushID(valueId, valueMdp, valueClient, valueIp)}
            >
              Connexion
            </Button>
          </Col>
        </Form.Group>
      </Form>
      <PopUpAlert/>
      </div>
      <Image className="Picture-anticipation" src={Picture} roundedCircle />
    </Fragment>
  );
};

export default Connexion;

      
      
