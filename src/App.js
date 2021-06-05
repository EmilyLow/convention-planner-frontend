import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import '@fontsource/roboto';
import Box from '@material-ui/core/Box';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
// import TabPanel from "@material-ui/core/TabP"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useRouteMatch,
  useParams
} from "react-router-dom";



import Home from "./components/Home";
import Talks from "./components/Talks";
import Games from "./components/Games";
import UserSchedule from "./components/UserSchedule"

function App() {

  //Alt
  // const match = useRouteMatch();
  // const location = useLocation();

  // let location = useLocation();


  let [tabValue, setTabValue] = new React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  }

  return (
    
      <Router>
      <Box>
      {/* <AppBar position="static">
        <Tabs value = {tabValue} onChange={handleTabChange}>
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three"/>
        </Tabs>
     </AppBar> */}
     
    
      {/* <ul>
        <li>
          <Link to="/">Core</Link>
        </li>
        <li>
          <Link to="/talks">Talks</Link>
        </li>
        <li>
          <Link to="/games">Games</Link>
        </li>
        <li>
          <Link to="/your-schedule">Your Schedule</Link>
        </li>
      </ul> */}
      <Route path="/"
        render={(history) => (



        
      <AppBar position="static" color="default">
        <Tabs value={history.location.pathname !== "/" ? history.location.pathname
                    : false}>
          <Tab label = "Core" value={""} component = {Link} to={"/"}/>
          <Tab label = "Talks" value={"/talks"}  component = {Link} to={"/talks"}/>
          <Tab label = "Games" value={"/games"} component = {Link} to={"/games"}/>
        </Tabs>
      </AppBar>
      )}
      />

      <Switch>
        <Route path="/talks">
          <Talks />
        </Route>
        <Route path="/games">
          <Games />
        </Route>
        <Route path = "/your-schedule">
          <UserSchedule/>
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Box>
  </Router>
  );
}

export default App;
