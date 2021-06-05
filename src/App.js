import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import '@fontsource/roboto';
import Box from '@material-ui/core/Box';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { makeStyles } from '@material-ui/core/styles';

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

//Example of using theme in makeStyles
const useStyles = makeStyles( theme => ({
  test: props => ({
    background: theme.palette.secondary.main,
    color: theme.palette.primary.main,

  }),
}));

function App(props) {

  const classes = useStyles();
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
      <Route path="/"
        render={(history) => (
        <AppBar position="static" color="primary">
          <Tabs value={history.location.pathname !== "/" ? history.location.pathname
                      : false} color="secondary">
            <Tab label = "Core" value={"/"} component = {Link} to={"/"}/>
            <Tab label = "Talks" value={"/talks"}  component = {Link} to={"/talks"} />
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
