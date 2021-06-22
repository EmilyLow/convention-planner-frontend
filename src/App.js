import React, { useState, useEffect } from "react";
import '@fontsource/roboto';
import Box from '@material-ui/core/Box';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MUILink from "@material-ui/core/Link";
import ToolBar from "@material-ui/core/Toolbar";

import UserContext from "./components/utils/UserContext";

import axios from "axios";

import { makeStyles } from '@material-ui/core/styles';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";




import Home from "./components/Home";
import Core from "./components/Core";
import Talks from "./components/Talks";
import Games from "./components/Games";
import Shows from "./components/Shows";
import UserSchedule from "./components/UserSchedule";
import AuthBox from "./components/AuthBox";


const useStyles = makeStyles( theme => ({
  headerSpread: props => ({
    display: "flex",
    justifyContent: "space-between",

  })
}));

function App(props) {

  //TODO Check local storage and useContext

  const classes = useStyles();


  const [currentUser, setCurrentUser] = useState({userId: 0, scheduleId: 0, username: 'Guest'});


  //Setting currentUser from localStorage on load
  //Possibly this should be done in useState intializing 
  //TODO, update for context
  useEffect(() => {
    let storedValue = localStorage.getItem("loggedInUserId");
  //  console.log("Use effect Stored value", storedValue);


    if(storedValue != null) {
      confirmCurrentUser(storedValue);
    }

    //Test changing this. If use 'currentUser' it initiates an infinite loops however
  }, []);

  

  //TODO, auth??? Key should still be stored though
  //Should do normal axios or axiosWithAuth though?
  //NOTE! Doing it this way causes a flicker when you refresh. It may be better to store all of this locally to prevent flicker
  function confirmCurrentUser(userId) {


    let parsedId = parseInt(userId);
    if(parsedId === 0) {
     
      setCurrentUser({userId: 0, scheduleId: 0, username: 'Guest'})
    } else {

        //Note, does it matter if I use parsed one here?
        axios.get("http://localhost:3002/users/" + parsedId)
      .then((res) => {
        // console.log("COnfirm current user", res);
        // console.log("confirmCurrentuser res", res.data);
        setCurrentUser({userId: res.data.id, username: res.data.username, scheduleId: res.data.schedule_id})
      })
      .catch((err) => {
        console.log("Error confirming current user", err);
      })
    }
    
  }

  


  


  return (
    <UserContext.Provider value={{currentUser, setCurrentUser}}>
   <Router>
    <Box>
      <Route path="/"
        render={(history) => (
        <AppBar position="static" color="primary" >
          <ToolBar className={classes.headerSpread}>
            <MUILink href="/" variant="h6" color="secondary">NecronomiCon</MUILink>

            {/* Removed currentUser = here */}
            <AuthBox/>
            
          </ToolBar>
    
          <Tabs  centered value={history.location.pathname !== "/" ? history.location.pathname
                      : false} color="secondary">
            <Tab label = "Core" value={"/core"} component = {Link} to={"/core"}/>
            <Tab label = "Talks" value={"/talks"}  component = {Link} to={"/talks"} />
            <Tab label = "Games" value={"/games"} component = {Link} to={"/games"}/>
            <Tab label = "Shows" value={"/shows"} component = {Link} to={"/shows"}/>
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
        <Route path="/shows">
          <Shows />
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
  </UserContext.Provider>
  );
  
}

export default App;
