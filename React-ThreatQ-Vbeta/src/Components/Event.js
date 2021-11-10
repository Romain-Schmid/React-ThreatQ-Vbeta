import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  Fragment,
} from "react";
import { TokenContext } from "./Mycontext";
import { SourceContext } from "./Mycontext";
import EventAttribut from "./Event_attribut";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Event.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { useDropzone } from "react-dropzone";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import SunEditor from "suneditor-react";
import Navbartop from './Navbar/Navbar.js'

const Event = () => {
  //permet le changement de "page"
  let pageEvent = useHistory();

  //Affichage de la PopUp Erreur
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
          <Modal.Body>Erreur veuillez ressayer.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  //Affichage de la PopUp Erreur
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  function PopUpAlert2() {
    return (
      <>
        <Modal show={show2} onHide={handleClose2}>
          <Modal.Header closeButton>
            <Modal.Title>Succée</Modal.Title>
          </Modal.Header>
          <Modal.Body>Upload réussi !</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose2}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  //date par défaut
  const getCurrentDate = (separator = "-") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date < 10 ? `0${date}` : `${date}`}`;
  };

  //heure par défaut
  const getCurrentTime = (separator = ":") => {
    let newDate = new Date();
    let hour = newDate.getHours();
    let minute = newDate.getMinutes();

    return `${hour < 10 ? `0${hour}` : `${hour}`}${separator}${
      minute < 10 ? `0${minute}` : `${minute}`
    }`;
  };

  function saveDescription(description) {
    console.log(description);
    setvalueDescription(description)
  }
  //Affichage de sunEditor pour description
  const Description = () => {
    return (
      <SunEditor
        lang="fr"
        //onChange= {handleChange}
        setOptions={{
          callBackSave: function (contents) {
            alert("Enregistrement du text = " + contents);
            saveDescription(contents);
          },
          buttonList: [
            ["undo", "redo", "font", "fontSize", "formatBlock"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
              "removeFormat",
            ],

            [
              "fontColor",
              "hiliteColor",
              "outdent",
              "indent",
              "align",
              "horizontalRule",
              "list",
              "table",
            ],
            ["link", "fullScreen", "showBlocks", "codeView", "preview", "save"],
          ]
        }}
      />
    );
  };

  // Actualisation de type file et de idevent lors du rendement de la page
  const ctx = useContext(TokenContext);

  useEffect(() => {
    async function fetchvalue(ctx) {
      const GetTypeFile = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url: "https://" + ipadress + "/api/attachments/types",
            method: "GET",
            headers: { Authorization: "Bearer " + token },
          });
          const names = data.data.map((el) => el.name);
          UpdateEvent(names);
        } catch (error) {
          console.log(error);
          handleShow();
        }
      };
      const GetIdEvent = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url: "https://" + ipadress + "/api/event/types",
            method: "GET",
            headers: { Authorization: "Bearer " + token },
          });
          const names = data.data.map((el) => el.id + " : " + el.name);
          UpdateFile(names);
        } catch (error) {
          console.log(error);
          handleShow();
        }
      };
      await GetTypeFile(ctx.Token, ctx.IPadress);
      await GetIdEvent(ctx.Token, ctx.IPadress);
    }
    fetchvalue(ctx);
  }, [ctx]);

  //Info Event
  const [valueTitle, setvalueTitle] = useState("");
  const [valueSource, setvalueSource] = useState("");
  const [valueEvent, setvalueEvent] = useState("");
  const [valueDescription, setvalueDescription] = useState("");
  const [valueIdEvent, setvalueIdEvent] = useState("");
  const [valueDate, setvalueDate] = useState(getCurrentDate());
  const [valueTime, setvalueTime] = useState(getCurrentTime());
  const [valueTagList, setvalueTagList] = useState([{ name: "" }]);
  const [valueAttributList, setvalueAttributList] = useState([]);

  //info file
  const [valueTypeFile, setvalueTypeFile] = useState("");

  //***********------------------ Partie File ------------------***********//

  //Zone DropFile
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);

  const {
    isDragActive,
    getRootProps,
    getInputProps,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    onDrop,
    minSize: 0,
  });
  //Fin de zone

  //Envoyer de fichier
  const uploadFile = (token, ipadress, acceptedFiles, typeFile, idEvent) => {
    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
    var idFile = {};
    async function res() {
      await acceptedFiles.reduce(async (memo, file) => {
        const results = await memo;
        var formData = new FormData();
        await sleep(1000);
        formData.append("resumableChunkNumber", 1);
        formData.append("resumableChunkSize", 1048576);
        formData.append("resumableCurrentChunkSize", file.size);
        formData.append("resumableTotalSize", file.size);
        formData.append("resumableType", file.type);
        formData.append("resumableIdentifier", file.size + "-" + file.name);
        formData.append("resumableFilename", file.name);
        formData.append("resumableRelativePath", file.path);
        formData.append("resumableTotalChunks", 1);
        formData.append(`file`, file);

        const data = {
          name: file.name,
          title: file.name,
          type: typeFile,
          malware_locked: 0,
          sources: [],
        };
        fetch(
          "https://" +
            ipadress +
            "/api/attachments/upload?resumableChunkNumber=1&resumableChunkSize=1048576&resumableCurrentChunkSize=" +
            file.size +
            "&resumableTotalSize=" +
            file.size +
            "&resumableType=" +
            file.type +
            "&resumableIdentifier=" +
            file.size +
            "-" +
            file.name +
            "&resumableFilename=" +
            file.name +
            "&resumableRelativePath=" +
            file.path +
            "&resumableTotalChunks=1",
          {
            headers: { Authorization: "Bearer " + token },
            method: "POST",
            body: formData,
          }
        );
        await sleep(1500);
        fetch("https://" + ipadress + "/api/attachments", {
          headers: {
            Authorization: "Bearer " + token,
            "content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => (idFile = { id: data.data.id }))
          .then(console.log(idFile));
        await sleep(1500);
        const attach = { id: idEvent };
        fetch(
          "https://" + ipadress + "/api/attachments/" + idFile.id + "/events",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
            method: "POST",
            body: JSON.stringify(attach),
          }
        );
        handleShow2();
        return results;
      }, []);
    }
    res();
  };

  //zone actualisation des types d'Event
  const [valuetabFile, setvaluetabFile] = useState([]);

  const UpdateEvent = (names) => {
    setvaluetabFile(names);
  };

  //Affichage des type de fichier dans dans le select qui s'actualise a chaque UpdateTypeFile grace a setvaluetabFile dans le useEffect
  const EventFile = (valuetabFile) => {
    const listItems = valuetabFile.valuetabFile.map((number) => (
      <option key={number.toString()}>{number}</option>
    ));
    return listItems;
  };

  //***********------------------ Partie Event ------------------***********//

  //fonction de la création des attributs de l'event
  const PushAttriibute = async (token, ipadress, idevent, attributList) => {
    const Body = JSON.stringify(attributList);
    try {
      const { data } = await axios({
        url: "https://" + ipadress + "/api/events/" + idevent + "/attributes",
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        data: Body,
      });
      console.log(data);
      handleShow2();
    } catch (error) {
      handleShow();
      console.log(error);
    }
  };

  const PushTag = async (token, ipadress, idevent, tags) => {
    const body = JSON.stringify(tags);
    try {
      const { data } = await axios({
        url: "https://" + ipadress + "/api/events/" + idevent + "/tags",
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        data: body,
      });
      console.log(data);
      handleShow2();
    } catch (error) {
      handleShow();
      console.log(error);
    }
  };

  //fonction de la création de l'event
  const PushEvent = async (
    token,
    ipadress,
    title,
    source,
    description,
    event,
    date,
    time,
    tags,
    attributList
  ) => {
    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
    const regex = /[^0-9]/g;
    var getid = event.replace(regex, "");
    const Body = {
      type_id: getid,
      sources: [{ name: source }],
      happened_at: date + " " + time,
      title: title,
      description: description,
    };
    try {
      const { data } = await axios({
        url: "https://" + ipadress + "/api/events",
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        data: Body,
      });
      await sleep(2000);
      var id = data.data.id;
      setvalueIdEvent(id);
      PushAttriibute(token, ipadress, id, attributList);
      PushTag(token, ipadress, id, tags);
    } catch (error) {
      handleShow();
      console.log(error);
    }
  };

  //zone actualisation des types d'Event
  const [valuetab, setvaluetab] = useState([]);

  const UpdateFile = (names) => {
    setvaluetab(names);
  };

  //Affichage des events dans  le select qui s'actualise a chaque UpdateEvent grace a setvaluetab grace au useEffect
  const Event = (valuetab) => {
    const listItems = valuetab.valuetab.map((number) => (
      <option key={number.toString()}>{number}</option>
    ));
    return listItems;
  };
  //Zone pour les tags

  // handle input change
  const handleInputChange = (f, index2) => {
    const { name, value } = f.target;
    const list = [...valueTagList];
    list[index2][name] = value;
    setvalueTagList(list);
  };

  // handle click event of the Remove button

  const handleRemoveClick = (index2) => {
    const list = [...valueTagList];
    list.splice(index2, 1);
    setvalueTagList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setvalueTagList([...valueTagList, { name: "" }]);
  };

  return (
    <Fragment>
      <Navbartop/>
      <h1>Création d'un Événement</h1>
      <Form className="FormEvent">
        <Form.Group as={Row} controlId="formHorizontalTitre">
          <Col sm={2} />
          <Form.Label className="Label-left" column sm={2}>
            Titre :
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              value={valueTitle}
              onChange={(event) => setvalueTitle(event.target.value)}
            />
          </Col>
          <Col sm={2} />
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalSource">
          <Col sm={2} />
          <Form.Label className="Label-left" column sm={2}>
            Source :
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              value={valueSource}
              onChange={(event) => setvalueSource(event.target.value)}
            />
          </Col>
          <Col sm={2} />
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalDate">
          <Col sm={2} />
          <Form.Label className="Label-left" column sm={2}>
            Date de l'événement:
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type="date"
              value={valueDate}
              onChange={(event) => setvalueDate(event.target.value)}
            />
          </Col>
          <Col sm={3}>
            <Form.Control
              type="time"
              value={valueTime}
              onChange={(event) => setvalueTime(event.target.value)}
            />
          </Col>
          <Col sm={2} />
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalIdEvent">
          <Col sm={2} />
          <Form.Label className="Label-left" column sm={2}>
            Id Event :
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              value={valueEvent}
              onChange={(event) => setvalueEvent(event.target.value)}
              as="select"
            >
              <Event valuetab={valuetab}></Event>
            </Form.Control>
          </Col>
          <Col sm={2} />
        </Form.Group>

        <SourceContext.Provider value={valueSource}>
          <EventAttribut pushToParent={setvalueAttributList} />
        </SourceContext.Provider>

        <Form.Group as={Row} controlId="formHorizontalValue">
          <Col sm={2} />
          <Form.Label className="Label-left" column sm={2}>
            Description :
          </Form.Label>
          <Col sm={6}>
            <Description />
          </Col>
          <Col sm={2} />
        </Form.Group>

        {valueTagList.map((x, i) => {
          return (
            <Form.Group as={Row} controlId="formHorizontalValue">
              <Col sm={2} />
              <Form.Label className="Label-left" column sm={2}>
                Tag :
              </Form.Label>
              <Col sm={4}>
                <Form.Control
                  name="name"
                  value={x.name}
                  onChange={(e) => handleInputChange(e, i)}
                />
              </Col>
              <Col sm={1}>
                {valueTagList.length !== 1 && (
                  <Button
                    variant="light"
                    className="mr10"
                    onClick={() => handleRemoveClick(i)}
                  >
                    Remove
                  </Button>
                )}
              </Col>
              <Col sm={1}>
                {valueTagList.length - 1 === i && (
                  <Button variant="light" onClick={handleAddClick}>
                    Add
                  </Button>
                )}
              </Col>
              <Col sm={2} />
            </Form.Group>
          );
        })}

        <Form.Group>
          <TokenContext.Consumer>
            {(state) => (
              <Form.Group as={Row}>
                <Col sm={{ span: 6, offset: 4 }}>
                  <Button
                    variant="light"
                    onClick={() =>
                      PushEvent(
                        state.Token,
                        state.IPadress,
                        valueTitle,
                        valueSource,
                        valueDescription,
                        valueEvent,
                        valueDate,
                        valueTime,
                        valueTagList,
                        valueAttributList
                      )
                    }
                  >
                    Envoyer event
                  </Button>
                </Col>
              </Form.Group>
            )}
          </TokenContext.Consumer>
        </Form.Group>
      </Form>

      <h2>Envoie de fichier lier à l'Événement</h2>
      <Form className="FormEvent">
        <Form.Group as={Row} controlId="formHorizontalTypeFile">
          <Col sm={2} />
          <Form.Label className="Label-left" column sm={2}>
            Type de fichier :
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              value={valueTypeFile}
              onChange={(event) => setvalueTypeFile(event.target.value)}
              as="select"
            >
              <EventFile valuetabFile={valuetabFile}></EventFile>
            </Form.Control>
            <Form.Text id="passwordHelpBlock" muted>
              Vous pouvez envoyer autant de fichiers que voulut mais cela doit
              être fait avec le mem type de fichier, vous pouvez envoyer un PDF
              et ensuite envoyer un txt en changeant le type de fichier.
            </Form.Text>
          </Col>
          <Col sm={2} />
        </Form.Group>
        <Form.Group as={Row} controlId="formHorizontalFile">
          <Col sm={2} />
          <Form.Label className="Label-left" column sm={2}>
            Fichier :
          </Form.Label>
          <Col sm={6}>
            <div className="container text-center">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {!isDragActive && "Cliqué ici ou glisser un fichier !"}
                {isDragActive && !isDragReject && "Déposer le fichier"}
                {isDragReject && "File type not accepted, sorry!"}
              </div>
              <ul className="list-group mt-2">
                {acceptedFiles.length > 0 &&
                  acceptedFiles.map((acceptedFile, index) => (
                    <li
                      className="list-group-item list-group-item-success"
                      key={index}
                    >
                      {acceptedFile.name}
                    </li>
                  ))}
              </ul>
            </div>
          </Col>
          <Col sm={2} />
        </Form.Group>

        <TokenContext.Consumer>
          {(state) => (
            <Form.Group as={Row}>
              <Col sm={{ span: 6, offset: 4 }}>
                <Button
                  variant="light"
                  onClick={() =>
                    uploadFile(
                      state.Token,
                      state.IPadress,
                      acceptedFiles,
                      valueTypeFile,
                      valueIdEvent
                    )
                  }
                >
                  Envoyer files
                </Button>
              </Col>
            </Form.Group>
          )}
        </TokenContext.Consumer>
      </Form>
      <Col sm={{ span: 1, offset: 6 }}>
          <Button variant="light" style={{marginBottom: '5px'}} onClick={() => pageEvent.push("/ReadPDF")}>
            Page Event
          </Button>
        </Col>
      <PopUpAlert />
      <PopUpAlert2 />
    </Fragment>
  );
};

export default Event;
