import React, { useState, Fragment, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ReadPDF.css";
import axios from "axios";
import { TokenContext } from "../Mycontext";
import PDFAttribut from "./PDFAttribut";
import { SourceContext } from "../Mycontext";
//https://material-ui.com/components/autocomplete/
import "fontsource-roboto";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
// https://react-pdf-viewer.dev/
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
//https://www.ag-grid.com/react-grid/
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
// Boostrap
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button2 from "react-bootstrap/Button";
//clicdroit menu => https://github.com/reachtokish/rctx-contextmenu
import {
  ContextMenuTrigger,
  ContextMenu,
  ContextMenuItem,
} from "rctx-contextmenu";
import moment from "moment";
import Navbartop from '../Navbar/Navbar.js'

const ReadPDF = () => {
  const rtx = useContext(TokenContext);
  const [eventEvent, seteventEvent] = useState();
  const [listIndicators, setlistIndicators] = useState();

  //-----------------------------Partie récuération event et pdf---------------------------

  //Récupération des Event avec leur Id au montage de la page
  useEffect(() => {
    async function fetchvalue(rtx) {
      //Récupération et affichag de la list d'Event
      const GetTypeEvent = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url: "https://" + ipadress + "/api/events",
            method: "GET",
            headers: { Authorization: "Bearer " + token },
          });
          const list = data.data.map((el) => el.title + " / id = " + el.id);
          console.log(list);
          seteventEvent(list);
        } catch (error) {
          console.log(error);
        }
      };
      ////Récupération et affichag de la list des indicateurs
      const GetListeIndicators = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url: "https://" + ipadress + "/api/indicator/types/",
            method: "GET",
            headers: { Authorization: "Bearer " + token },
          });
          const names = data.data.map((el) => el.name + " / id = " + el.id);
          console.log(names);
          setlistIndicators(names);
        } catch (error) {
          console.log(error);
        }
      };
      await GetTypeEvent(rtx.Token, rtx.IPadress);
      await GetListeIndicators(rtx.Token, rtx.IPadress);
    }
    fetchvalue(rtx);
  }, [rtx]);

  //Css de l'autocomplétion
  const CssTextField = withStyles({
    root: {
      "& label": {
        color: "white",
      },
      "& label.Mui-focused": {
        color: "white",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "white",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "white",
        },
        "&:hover fieldset": {
          borderColor: "white",
        },
        "&.Mui-focused fieldset": {
          borderColor: "white",
        },
      },
    },
  })(TextField);

  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
      display: "flex",
    },
  }));

  const classes = useStyles();

  //---------------------------- Partie PDF -----------------------------

  const [url, setUrl] = useState("");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  //Mise en format url du pdf téléchargé pour affiché dans le lecteur PDF viewer
  async function Downlaod(blob) {
    await erasePDF();
    var newBlob = new Blob([blob], { type: "application/pdf" });
    const data = URL.createObjectURL(newBlob);
    setUrl(data);
  }

  // function qui vide le PDV viewer avant de charger un nouveau pour évité un conflit de donnée
  function erasePDF() {
    return new Promise((resolve) => {
      setUrl("");
      resolve("url");
    });
  }

  const [EventID, setEventID] = useState();
  const [Id, setId] = useState();
  const [attachement, setattachement] = useState();
  const [filePDF, setfilePDF] = useState();
  const [IdPDF, setIdPDF] = useState();
  //Affichage du bouton de PDF une fois la condition validé
  const [check, setCheck] = useState(false);

  //Récupération de l'id de l'event choisi
  function getId(EventID) {
    setEventID(EventID);
    if (EventID !== null){
    var regex = /=\s*([0-9]+)/;
    var result = EventID.match(regex)[1];
    setId(result);}
  }

  //Réucupération de l'id du PDF choisit
  function getIdPDF(attachement) {
    setfilePDF(attachement);
    if (attachement !== null){
    var regex = /=\s*([0-9]+)/;
    var result = attachement.match(regex)[1];
    setIdPDF(result);}
  }

  //Récupération et affichag de la list de PDF lié a l'event choisit
  function getPDF(Id) {
    async function fetchvaluefile(rtx) {
      const GetEventFile = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url: "https://" + ipadress + "/api/events/" + Id + "/attachments",
            method: "GET",
            headers: { Authorization: "Bearer " + token },
          });
          const attachement = data.data.map(
            (el) => el.title + " / id = " + el.id
          );
          setattachement(attachement);
          setCheck(true);
        } catch (error) {
          console.log(error);
        }
      };
      await GetEventFile(rtx.Token, rtx.IPadress);
    }
    fetchvaluefile(rtx);
  }

  function getIdByString(string) {
    var body = {"criteria":{"+or":[{"mentions": string}]},"filters":{}}
    async function fetchvaluefile(rtx) {
      const GetTypeEvent = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url: "https://" + ipadress + "/api/events/query?limit=25&offset=0&sort=-happened_at",
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            data: body
          });
          const list = data.data.map((el) => el.title + " / id = " + el.id);
          console.log(list);
          seteventEvent(list);
        } catch (error) {
          console.log(error);
        }
      };
      await GetTypeEvent(rtx.Token, rtx.IPadress);
    }
    fetchvaluefile(rtx);
  }

  //Téléchargement et affichage du PDF choisit
  function getFile(Id) {
    async function fetchvaluefile(rtx) {
      const GetEventFile = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url: "https://" + ipadress + "/api/attachments/" + Id + "/download",
            method: "GET",
            headers: { Authorization: "Bearer " + token },
            responseType: "arraybuffer",
          });
          Downlaod(data);
        } catch (error) {
          console.log(error);
        }
      };
      await GetEventFile(rtx.Token, rtx.IPadress);
    }
    fetchvaluefile(rtx);
  }

  // Affichage du deuxième autocomplétion une foit la list des pdf téléchargé
  function RenderLoadFile() {
    if (check === true) {
      return (
        <div className="first-input" style={{ marginTop: "15px" }}>
          <Autocomplete
            id="combo-box-event"
            options={attachement}
            value={filePDF}
            onChange={(event, newValue) => getIdPDF(newValue)}
            style={{
              color: "white",
              width: 400,
              display: "inline-flex",
            }}
            renderInput={(params) => (
              <CssTextField
                {...params}
                className={classes.margin}
                label="PDF file"
                variant="outlined"
                id="custom-css-outlined-input"
              />
            )}
          />
          <Button
            style={{ marginLeft: "15px" }}
            onClick={() => getFile(IdPDF)}
            variant="contained"
          >
            Downlaod
          </Button>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  //-------------------------- Partie Tableau ----------------------------------------
  const [valueTable, setvalueTable] = useState([]);
  const GridExample = () => {
    const [gridApi, setGridApi] = useState(null);

    const onGridReady = (params) => {
      setGridApi(params.api);
    };

    //Effacer élement sélectionner
    const onSelectionChanged = () => {
      var selectedRows = gridApi.getSelectedNodes();
      const list = [...valueTable];
      var i = 0
      const erase = (id) => {
        list.splice(id-i, 1)
        i=i+1
      }
      selectedRows.map( el => erase(el.id))
      setvalueTable(list);
    };

    //Ajout d'une ligne en haut du tableau
    const addRow = () => {
      setvalueTable([{ IOC: "", Type: "" }, ...valueTable]);
    };

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div className="example-wrapper">
          <div
            style={{
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Button2 variant="light" onClick={() => addRow()}>Ajouter une ligne</Button2>
              <Button2 variant="light" style={{'margin-left': '5px'}} onClick={() => onSelectionChanged()}>
                Supprimer ligne séléctionner
              </Button2>
            </div>
            <div>
              <Button2 variant="light" onClick={() => searchIOC()}>Recherche IOC</Button2>
              <RenderLoadioc/>
            </div>
            <div>
              <Button2 variant="light" onClick={() => sendIOC()}>
                Envoyer IOC
              </Button2>
            </div>
          </div>
          <div className="grid-wrapper">
            <div
              id="myGrid"
              style={{
                height: "500px",
                width: "100%",
              }}
              className="ag-theme-alpine"
            >
              <AgGridReact
                rowData={valueTable}
                defaultColDef={{
                  flex: 1,
                  minWidth: 110,
                  editable: true,
                  resizable: true,
                }}
                rowSelection={'multiple'}
                onGridReady={onGridReady}
              >
                <AgGridColumn field="IOC" />
                <AgGridColumn
                  field="Type"
                  cellEditor="agRichSelectCellEditor"
                  cellEditorParams={{ cellHeight: 50, values: listIndicators }}
                />
              </AgGridReact>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //valeur que le formulaire retourne
  const [valueSource, setvalueSource] = useState("");
  const [valueAttributList, setvalueAttributList] = useState([]);

  //---------------------------Partie IOC ---------------------------------
  //RIGHT CLIQUE FUNCTION
  //Liste des mots a surligné
  const [highlightWords, sethighlightWords] = useState([]);

  //Recherche de type D'ioc pour la partie sélectionner
  function getTypeIOC(stringIOC) {
    async function fetchvaluefile(rtx) {
      const Body = {
        content_type_id: 6,
        normalize: "Y",
        derive: "Y",
        text: stringIOC,
      };
      var importID = 0;
      var IOCID = 0;
      var stringTypeIOC = "";
      //Envoie du text selectionner
      const PutString = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url: "https://" + ipadress + "/api/imports/",
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            data: Body,
          });
          importID = data.data.id;
        } catch (error) {
          console.log(error);
        }
      };
      //Récupération du type IOC
      const getIdIOC = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url:
              "https://" +
              ipadress +
              "/api/imports/" +
              importID +
              "/indicators?with=objectlinks",
            method: "GET",
            headers: { Authorization: "Bearer " + token },
          });
          data.data.map((el) => (IOCID = el.type_id));
          stringTypeIOC = listIndicators[IOCID - 1];
        } catch (error) {
          console.log(error);
        }
      };
      //Supression de l'import
      const EraseImport = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url:"https://" + ipadress +"/api/imports/" + importID,
            method: "DELETE",
            headers: { Authorization: "Bearer " + token },
          });
          console.log(data)
        } catch (error) {
          console.log(error);
        }
      };
      await PutString(rtx.Token, rtx.IPadress);
      await getIdIOC(rtx.Token, rtx.IPadress);
      await EraseImport(rtx.Token, rtx.IPadress);
      setvalueTable([{ IOC: stringIOC, Type: stringTypeIOC },...valueTable]);
    }
    fetchvaluefile(rtx);
  }

  //ajout d'un IOC dans la tableau
  function addIOC() {
    var selObj = window.getSelection();
    var stringIOC = selObj.toString();
    if (stringIOC !== "") {
      sethighlightWords([...highlightWords, stringIOC]);
      getTypeIOC(stringIOC);
    } else {
      alert("Rien n'est s'électionner");
    }
  }

  //Boutoun recherche ioc dans le tableau
  function searchIOC() {
    async function fetchvaluefile(rtx) {
      // Envoie du pdf dans imports
      var importID = 0;
      const Body = {
        content_type_id: 6,
        normalize: "Y",
        attachment_id: IdPDF,
      };
      const PostPDF = async (token, ipadress) => {
        try {
          const { data } = await axios({
            method: "POST",
            url:
              "https://" +
              ipadress +
              "/api/imports",
            headers: { Authorization: "Bearer " + token },
            data: Body,
          });
          importID = data.data.id;
        } catch (error) {
          console.log(error);
        }
      };
      // Récupéation des ioc
      const GetPdfIOC = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url:
              "https://" +
              ipadress +
              "/api/imports/" +
              importID +
              "/indicators?with=objectlinks",
            method: "GET",
            headers: { Authorization: "Bearer " + token },
          });
          data.data.map((el) =>
            setvalueTable((v) => [
              ...v,
              { IOC: el.value, Type: listIndicators[el.type_id - 1] },
            ])
          );
          //data.data.map((el) => console.log(el.value + " + " + listIndicators[(el.type_id-1)]))
        } catch (error) {
          console.log(error);
        }
      };
      //Suppression de l'import
      const EraseImport = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url:"https://" + ipadress +"/api/imports/" + importID,
            method: "DELETE",
            headers: { Authorization: "Bearer " + token },
          });
          console.log(data)
        } catch (error) {
          console.log(error);
        }
      };
      setCheck1(true)
      await PostPDF(rtx.Token, rtx.IPadress);
      await GetPdfIOC(rtx.Token, rtx.IPadress);
      await EraseImport(rtx.Token, rtx.IPadress);
      setCheck1(false)
    }
    fetchvaluefile(rtx);
  }

  //Fonction d'envoie des IOC présent de le tableau
  function sendIOC() {
    async function fetchvaluefile(rtx) {
      var idIOC = 0
      //Création d'un IOC dans la BDD
      const PushAllIOC = async (token, ipadress, bodyIoc) => {
        try {
          const { data } = await axios({
            url: "https://" + ipadress + "/api/indicators",
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            data: bodyIoc,
          });
          data.data.map(el=> idIOC = el.id)
        } catch (error) {
          console.log(error);
          alert('Erreur')
        }
      };
      const AttachIOC = async (token, ipadress) => {
        try {
          const { data } = await axios({
            url: "https://" + ipadress + "/api/indicators/" + idIOC + "/events",
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            data: [{"id":Id}],
          });
          console.log(data)
        } catch (error) {
          console.log(error);
          alert('Erreur')
        }
      };
      //Vérification des donnée du tableau
      var badIOC = 0
      var badValue = 0
      const verifyIOC = async () => {
        valueTable.map((el) => {
          if(el.IOC === ''){
            badIOC = badIOC + 1 
          }if (el.Type === ''){
            badValue = badValue + 1
          }
        })
        //Message d'erreur si problème
        if(badIOC > 0 || badValue > 0){
          alert('Il y a '+badIOC+' IOC vide et '+badValue+' Type vide')
        }
      }
      await verifyIOC()
      //Si tous est correcte envoie des Données
      if(badIOC === 0 && badValue === 0) {
        valueTable.map( async (el) =>{
          var regex = /=\s*([0-9]+)/;
          var IDresult = el.Type.match(regex)[1];
          var bodyIoc = [
              {
                "class": "network",
                "value": el.IOC,
                "type_id": IDresult,
                "status_id": 2,
                "sources":
                  {
                    "name": valueSource,
                    "published_at": moment().format('YYYY-MM-DD hh:mm:ss')
                  },
                "attributes": valueAttributList
              },
            ]
            await PushAllIOC(rtx.Token, rtx.IPadress, bodyIoc);
            await AttachIOC(rtx.Token, rtx.IPadress, bodyIoc);
        });
      }
    }
    fetchvaluefile(rtx);
  }

  const [check1, setCheck1] = useState(false);
  //Barre de chargement de la recherche d'IOC dans le PDF
  function RenderLoadioc() {
    if (check1 === true) {
      return (
        <CircularProgress style={{ width: '20PX', height: "20PX", "margin-left": "10px", color:"white"}}/>
      )
    }else {
      return <div></div>;
    }
  }

  //----------------------------------- Partie Return de la page -------------------------------------------------------

  return (
    <Fragment>
      <Navbartop/>
      <div>
        <h1>Page PDF</h1>
      </div>
      <div className="first-input">
        <Autocomplete
          id="combo-box-event"
          options={eventEvent}
          value={EventID}
          onChange={(event, newValue) => getId(newValue)}
          style={{
            color: "white",
            width: 400,
            display: "inline-flex",
          }}
          renderInput={(params) => (
            <CssTextField
              {...params}
              className={classes.margin}
              label="Event name"
              variant="outlined"
              id="custom-css-outlined-input"
              onChange={ev => {
                // dont fire API if the user delete or not entered anything
                if (ev.target.value !== "" || ev.target.value !== null) {
                  //onChangeHandle(ev.target.value);
                  console.log(ev.target.value)
                  getIdByString(ev.target.value)
                }}} 
            />
          )}
        />
        <Button
          style={{ marginLeft: "15px" }}
          onClick={() => getPDF(Id)}
          variant="contained"
        >
          Get
        </Button>
      </div>
      <RenderLoadFile />
      <div>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js">
          <div className="ViewPDF">
            <ContextMenuTrigger
              id="my-context-menu-1"
              animation="zoom"
              className="my-context-menu"
            >
              <div style={{ height: "800px" }}>
                {url ? (
                  <div
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.3)",
                      height: "100%",
                    }}
                  >
                    <Viewer
                      fileUrl={url}
                      plugins={[defaultLayoutPluginInstance]}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      alignItems: "center",
                      border: "2px dashed rgba(0, 0, 0, .3)",
                      display: "flex",
                      fontSize: "2rem",
                      height: "100%",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    Preview area
                  </div>
                )}
              </div>
            </ContextMenuTrigger>
          </div>
          <ContextMenu id="my-context-menu-1">
            <ContextMenuItem onClick={() => addIOC()}>
              Ajouter IOC Sélectionner
            </ContextMenuItem>
            <ContextMenuItem onClick={() => console.log("I'm clicked! 2")}>
              Suppimer IOC Sélectionner
            </ContextMenuItem>
          </ContextMenu>
          <div className="ViewIoc">
            <Form className="FormPDF">
              <Form.Group as={Row} controlId="formHorizontalSource">
                <Col sm={2} />
                <Form.Label column sm={2}>
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
              <SourceContext.Provider value={valueSource}>
                <PDFAttribut pushToParent={setvalueAttributList} />
              </SourceContext.Provider>
            </Form>
            <GridExample />
          </div>
        </Worker>
      </div>
    </Fragment>
  );
};

export default ReadPDF;
