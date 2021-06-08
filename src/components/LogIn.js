import {useState} from "react";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import {Controller, useForm,} from "react-hook-form";

import axiosWithAuth from "./utils/axiosWithAuth";

import LoginForm from "./LoginForm"

const useStyles = makeStyles( theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'center',
        // width: `100%`,
     
        padding: theme.spacing(2)
      },
    dialogStyle: props => ({
    //   background: theme.palette.primary.main,
    //   color: theme.palette.primary.contrastText,
    }),
    textFieldStyle: props => ({
        padding: theme.spacing(1)
        // background: "#FFFFFF", //White
        // padding: theme.spacing(1),
    }),
    buttonStyle: props => ({
        padding: theme.spacing(1)
        // color: "#FFFFFF" //White
    }),
    logInSpread: props => ({
        display: "flex",
        justifyContent: "center",
        
    
      }),
      divider: props => ({
        background: theme.palette.secondary.main,
      })
  }));

export default function LogIn(props) {
    console.log(props);

    const classes = useStyles();
    // const {handleSubmit, control, watch } = useForm();

    //Change location of this or use Context
    // const [currentUser, setCurrentUser] = useState("Guest");
    let [logInOpen, setLogInOpen] = useState(false);

    // const onSubmit = data => {
    //     console.log("Click");
    //     console.log(data);
    //     //TODO Log in
    //     logInUser(data);

    // };  

    // const logInUser = (values) => {

    //     axiosWithAuth()
    //     .post("http://localhost:3002/users/auth/login", values)
    //     .then((res) => {

    //         localStorage.setItem("token", res.data.token);
           
    //         setCurrentUser(res.data.username);
    //         props.handleClose();
    //         //TODO: currently a failed login errors out without informing the user outside of the console
    //         //TODO: Set Log In/ Sign up to change if logged in
    //     })
    //     .catch((err) => {
    //         console.log("Error while logging in", err);
    //     })

        const handleLogInOpen = () => {
            setLogInOpen(true);
          }
        
          const handleDialogueClose = () => {
            setLogInOpen(false);
          }

    //TODO: Make it so that this stays through refresh. Store currentUser in local storage or retrieve it from there initially?
    if(props.currentUser === "Guest") {
        return(
            <Box className={classes.logInSpread}>
            <Button color="secondary" onClick={handleLogInOpen}>Log In</Button>  
            <Dialog  open={logInOpen} onClose = {handleDialogueClose}>
                <Box className = {classes.dialogStyle}>
                    <DialogTitle>Log In</DialogTitle>
                    <DialogContent>
                        <LoginForm setCurrentUser = {props.setCurrentUser} handleClose={handleDialogueClose}/>
                        <Link href="#" variant="p" color="secondary">Sign Up</Link>
                    </DialogContent>
            </Box>
        </Dialog>
        <Divider className={classes.divider}  orientation="vertical" variant = "fullWidth" flexItem />
              <Button color="secondary">Sign Up</Button>
        </Box>
        )
    }  else {
        return (
            <Box className={classes.logInSpread}>
             <Typography variant="h6" color="secondary"> {props.currentUser}   </Typography>
            {/* <Dialog  open={logInOpen} onClose = {handleDialogueClose}>
                <Box className = {classes.dialogStyle}>
                    <DialogTitle>Log In</DialogTitle>
                    <DialogContent>
                        <LoginForm setCurrentUser = {props.setCurrentUser} handleClose={handleDialogueClose}/>
                        <Link href="#" variant="p" color="secondary">Sign Up</Link>
                    </DialogContent>
            </Box>
        </Dialog> */}
        <Divider className={classes.divider}  orientation="vertical" variant = "fullWidth" flexItem />
              <Button color="secondary">Log Out</Button>
        </Box>
        )
    }


}