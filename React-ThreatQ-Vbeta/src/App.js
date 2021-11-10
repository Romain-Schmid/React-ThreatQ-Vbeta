import React, { Component } from "react";
import Event from "./Components/Event";
import ReadPDF from "./Components/ReadPDF_Components/ReadPDF";
import Connexion from "./Components/Connexion_Components/Connexion";
import { TokenContext } from "./Components/Mycontext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

class App extends Component {
  state = { Token: "", IPadress: "" };
  GetToken = (token, ipadress) => {
    this.setState({ Token: token, IPadress: ipadress });
  };
  render() {
    //Message de prévention si la page est quitter
    window.addEventListener("beforeunload", function (e) {
      // Cancel the event
      e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
      // Chrome requires returnValue to be set
      e.returnValue = "";
    });
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route
              path="/"
              exact
              render={() => <Connexion GetToken={this.GetToken} />}
            />
            <Route exact path="/Event">
              <TokenContext.Provider value={this.state}>
                <Event />
              </TokenContext.Provider>
            </Route>
            <Route exact path="/ReadPDF">
              <TokenContext.Provider value={this.state}>
                <ReadPDF />
              </TokenContext.Provider>
            </Route>
            <Route path="/" component={() => <div>Erreur 404</div>} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
