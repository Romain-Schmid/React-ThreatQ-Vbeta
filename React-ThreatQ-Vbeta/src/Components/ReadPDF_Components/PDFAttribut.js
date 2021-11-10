import React, { useState, Fragment, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SourceContext } from "../Mycontext";

const PDFAttribut = (params) => {
  const valueSource = useContext(SourceContext);

  useEffect(() => {
    async function setParam() {
      UpdateFileEvent();
    }
    setParam();
  }, []);

  //zone actualisation des types file event
  const [valuetabfile, setvaluetabfile] = useState([]);

  //Récupération de la liste de préconfiguration des attributs ( a écrire le titre des nouvelles configuration ici)
  const UpdateFileEvent = (params) => {
    setvaluetabfile([
        "Défaut", "Profile 1", "Profile 2", "Profile test"
    ]);};

  //Si le titre de la configuration match avec un des if actuelle la valeur valueAttributList avec son set et remplie donc les atttribut
  const SetFileEvent = (nameSet) => {
    console.log(nameSet);
    if (nameSet === "Défaut") {
      setvalueAttributList([
        { name: "", value: "", sources: [{ name: valueSource }] },
      ]);
      params.pushToParent(valueAttributList);
    } else if (nameSet === "Profile 1") {
      setvalueAttributList([
        { name: "Niveau de confiance", value: "1", sources: [{ name: valueSource }],},
        { name: "Classification", value: "2", sources: [{ name: valueSource }],},
        { name: "TLP", value: "3", sources: [{ name: valueSource }] },
        { name: "Communauté de diffusion", value: "4", sources: [{ name: valueSource }],},
        { name: "Producteur", value: "5", sources: [{ name: valueSource }] },
        { name: "Emetteur", value: "6", sources: [{ name: valueSource }] },
      ]);
      params.pushToParent(valueAttributList);
    } else if (nameSet === "Profile 2") {
      setvalueAttributList([
        { name: "Niveau de confiance", value: "1", sources: [{ name: valueSource }],},
        { name: "Classification", value: "2", sources: [{ name: valueSource }],},
        { name: "TLP", value: "3", sources: [{ name: valueSource }] },
        { name: "Communauté de diffusion", value: "4", sources: [{ name: valueSource }],},
        { name: "Producteur", value: "5", sources: [{ name: valueSource }] },
        { name: "Emetteur", value: "6", sources: [{ name: valueSource }] },
        { name: "Pastille", value: "7", sources: [{ name: valueSource }] },
      ]);
      params.pushToParent(valueAttributList);
    }else if (nameSet === "Profile test") {
      setvalueAttributList([
        { name: "Niveau de confiance", value: "1", sources: [{ name: valueSource }],},
        { name: "Classification", value: "2", sources: [{ name: valueSource }],},
        { name: "TLP", value: "3", sources: [{ name: valueSource }] },
        { name: "Communauté de diffusion", value: "4", sources: [{ name: valueSource }],},
        { name: "Producteur", value: "5", sources: [{ name: valueSource }] },
        { name: "Emetteur", value: "6", sources: [{ name: valueSource }] },
        { name: "Niveau de mencase", value: "fort", sources: [{ name: valueSource }] },
      ]);
      params.pushToParent(valueAttributList); 
    }
      else {
      console.log("erreur de préliste");
    }
  };

  //zone attribut
  const [valueAttributList, setvalueAttributList] = useState([
    { name: "", value: "", sources: [{ name: valueSource }] },
  ]);
  const [valueTypeEvent, setvalueTypeEvent] = useState("");

  const handleInputChangeValue = (e, index) => {
    const { name, value } = e.target;
    const list = [...valueAttributList];
    list[index][name] = value;
    setvalueAttributList(list);
    params.pushToParent(list);
  };

  // handle click event of the Remove button
  const handleRemoveClickValue = (index) => {
    const list = [...valueAttributList];
    list.splice(index, 1);
    setvalueAttributList(list);
    params.pushToParent(list);
  };

  // handle click event of the Add button
  const handleAddClickValue = () => {
    setvalueAttributList([
      ...valueAttributList,
      { name: "", value: "", sources: [{ name: valueSource }] },
    ]);
    params.pushToParent(valueAttributList);
  };

  //Affichage des set d'attribut dans  le select qui s'actualise a chaque UpdateEvent grace a setvaluetab grace au useEffect
  const Fileliste = (valuetabfile) => {
    const listItems = valuetabfile.valuetabfile.map((number) => (
      <option key={number.toString()}>{number}</option>
    ));
    return listItems;
  };

  return (
    <Fragment>
      <Form.Group as={Row} controlId="formHorizontalIdA">
        <Col sm={2} />
        <Form.Label column sm={2}>
          Pre-type pdf :
        </Form.Label>
        <Col sm={6}>
          <Form.Control
            value={valueTypeEvent}
            onChange={(event) => {
              setvalueTypeEvent(event.target.value);
              SetFileEvent(event.target.value);
            }}
            as="select"
          >
            <Fileliste valuetabfile={valuetabfile}></Fileliste>
          </Form.Control>
        </Col>
        <Col sm={2} />
      </Form.Group>

      {valueAttributList.map((y, t) => {
        return (
          <Form.Group as={Row} controlId="formHorizontalValue">
            <Col sm={2} />
            <Form.Label column sm={2}>
              Attribut {t} :
            </Form.Label>
            <Col sm={2}>
              <Form.Control
                name="name"
                value={y.name}
                onChange={(e) => handleInputChangeValue(e, t)}
              />
            </Col>
            <Col sm={2}>
              <Form.Control
                name="value"
                value={y.value}
                onChange={(e) => handleInputChangeValue(e, t)}
              />
            </Col>
            <Col sm={1}>
              {valueAttributList.length !== 1 && (
                <Button
                  variant="light"
                  className="mr10"
                  onClick={() => handleRemoveClickValue(t)}
                >
                  Remove
                </Button>
              )}
            </Col>
            <Col sm={1}>
              {valueAttributList.length - 1 === t && (
                <Button variant="light" onClick={handleAddClickValue}>
                  Add
                </Button>
              )}
            </Col>
            <Col sm={2} />
          </Form.Group>
        );
      })}
    </Fragment>
  );
};
export default PDFAttribut;
