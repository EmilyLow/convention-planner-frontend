import React, { useState, useEffect} from "react";
import UserContext from "./components/utils/UserContext";

import '@fontsource/roboto';
import Box from '@material-ui/core/Box';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MUILink from "@material-ui/core/Link";
import ToolBar from "@material-ui/core/Toolbar";
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import Home from "./components/Home";
import Page from "./components/Page";
import AuthBox from "./components/AuthBox";


const useStyles = makeStyles( theme => ({
  headerSpread: props => ({
    display: "flex",
    justifyContent: "space-between",
     [theme.breakpoints.down("xs")]: {
   
      padding: '10px',
      flexDirection: "column",
    }
  }),

  tabs: {
    
    [theme.breakpoints.down("xs")]: {
      marginLeft: "auto",
      marginRight: "auto",
    }
   
  },
 
}));

function App(props) {



  const classes = useStyles();
  const mediumViewport = useMediaQuery('(min-width:600px)');


  const [currentUser, setCurrentUser] = useState({userId: 0, scheduleId: 0, username: 'Guest'});

  
  useEffect(() => {
    let storedValue = localStorage.getItem("loggedInUserId");
  


    if(storedValue != null) {
      confirmCurrentUser(storedValue);
    }

    if(localStorage.guestEvents === undefined) {
      localStorage.setItem("guestEvents", JSON.stringify([]));
    }
    

  }, []);

  

  function confirmCurrentUser(userId) {


    let parsedId = parseInt(userId);
    if(parsedId === 0) {
     
      setCurrentUser({userId: 0, scheduleId: 0, username: 'Guest'})
    } else {


        axios.get("http://localhost:3002/users/" + parsedId)
      .then((res) => {
  
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
    <Box >
      <Route path="/"
        render={(history) => (
        <AppBar position="static" color="primary" >
          <ToolBar className={classes.headerSpread}>
            <MUILink href="/" variant="h4" color="secondary">NecronomiCon</MUILink>

           
            <AuthBox/>
            
          </ToolBar>
          
          <Tabs   className={classes.tabs} orientation={mediumViewport ? "horizontal" : "vertical"} centered value={history.location.pathname !== "/" ? history.location.pathname
                      : false} color="secondary">
            <Tab label = "Core" value={"/core"} component = {Link} to={"/core"}/>
            <Tab label = "Shows" value={"/shows"} component = {Link} to={"/shows"}/>
            <Tab label = "Talks" value={"/talks"}  component = {Link} to={"/talks"} />
            <Tab label = "Games" value={"/games"} component = {Link} to={"/games"}/> 
            <Tab label = "Your Schedule" value={"/your-schedule"} component = {Link} to={"/your-schedule"}/>
          </Tabs>
        </AppBar>
      )}
      />

      <Switch>
        <Route path = "/core">
          <Page scheduleId={1} sizeMult={1}/>
        </Route>
        <Route path="/talks">
          <Page scheduleId={2} sizeMult={2}/>
        </Route>
        <Route path="/games">
          <Page scheduleId={3} sizeMult={2}/>
        </Route>
        <Route path="/shows">
          <Page scheduleId={4} sizeMult={1}/>
        </Route>
        <Route path = "/your-schedule">
          <Page scheduleId ={0} sizeMult={1}/>
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
