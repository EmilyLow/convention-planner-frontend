import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import '@fontsource/roboto';
import Box from '@material-ui/core/Box';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MUILink from "@material-ui/core/Link";
import ToolBar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";

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
import Core from "./components/Core";
import Talks from "./components/Talks";
import Games from "./components/Games";
import UserSchedule from "./components/UserSchedule";
import LogIn from "./components/LogIn";

//Example of using theme in makeStyles
const useStyles = makeStyles( theme => ({
  headerSpread: props => ({
    display: "flex",
    justifyContent: "space-between",

  }),
  logInSpread: props => ({
    display: "flex",
    justifyContent: "center",
    

  }),
  tabSpread: props => ({
    display: "flex",
    justifyContent: "flex-end",

    //Check and this is present

  }),
  divider: props => ({
    background: theme.palette.secondary.main,
  })
}));

function App(props) {

  const classes = useStyles();

  let [logInOpen, setLogInOpen] = useState(false);

  let [tabValue, setTabValue] = new React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  }

  const handleLogInOpen = () => {
    setLogInOpen(true);
  }

  const handleDialogueClose = () => {
    setLogInOpen(false);
  }

  return (
    
   <Router>
    <Box>
      <Route path="/"
        render={(history) => (
        <AppBar position="static" color="primary" >
          <ToolBar className={classes.headerSpread}>
            <MUILink href="/" variant="h6" color="secondary">NecronomiCon</MUILink>
            <Box className={classes.logInSpread}>
              <Button color="secondary" onClick={handleLogInOpen}>Log In</Button>
              <LogIn open = {logInOpen} handleClose = {handleDialogueClose}/>
              {/* Why is this invisible. Why.  */}
              <Divider className={classes.divider}  orientation="vertical" variant = "fullWidth" flexItem />
              <Button color="secondary">Sign Up</Button>
            </Box>
            
          </ToolBar>
    
          <Tabs  centered value={history.location.pathname !== "/" ? history.location.pathname
                      : false} color="secondary">
            <Tab label = "Core" value={"/core"} component = {Link} to={"/core"}/>
            <Tab label = "Talks" value={"/talks"}  component = {Link} to={"/talks"} />
            <Tab label = "Games" value={"/games"} component = {Link} to={"/games"}/>
            <Tab label = "Your Schedule" value={"/your-schedule"} component = {Link} to={"/your-schedule"}/>
          </Tabs>
        </AppBar>
      )}
      />

      <Switch>
        <Route path = "/core">
          <Core/>
        </Route>
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
