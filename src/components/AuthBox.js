import {useState, useContext} from "react";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import UserContext from "./utils/UserContext";

import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const useStyles = makeStyles( theme => ({


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
      }),
      dialogHeaderStyle: props => ({
          background: theme.palette.primary.main,
          color: theme.palette.secondary.main

      })
  }));

export default function AuthBox(props) {

    //TODO : Fix
    const userData = useContext(UserContext);



    const classes = useStyles();
   
    let [logInOpen, setLogInOpen] = useState(false);
    let [signUpOpen, setSignUpOpen] = useState(false);
    

        const handleLogOut = () => {
            props.setCurrentUser({userId: 0, username: 'Guest'});
            localStorage.setItem("token", "");
            // localStorage.setItem("loggedInUser", "Guest");
            localStorage.setItem("loggedInUserId", 0);
        }

        const handleLogInOpen = () => {
            setLogInOpen(true);
            setSignUpOpen(false);
        }

        const handleSignUpOpen = () => {
            setSignUpOpen(true);
            setLogInOpen(false);
        }
        
          const handleDialogueClose = () => {
            setLogInOpen(false);
            setSignUpOpen(false);
          }

          //TODO switch to context
    if(userData.userId === 0) {
        return(
            <Box className={classes.logInSpread}>
            <Button color="secondary" onClick={handleLogInOpen}>Log In</Button>  
            <Dialog  open={logInOpen} onClose = {handleDialogueClose}>
                <Box className = {classes.dialogStyle}>
                    <DialogTitle className = {classes.dialogHeaderStyle}>Log In</DialogTitle>
                    <DialogContent>
                        <LoginForm setCurrentUser = {props.setCurrentUser} handleClose={handleDialogueClose}/>
                        {/* Todo: Make this functional */}
                        <Link href="#" variant="p" color="secondary">Sign Up</Link>
                    </DialogContent>
                </Box>
            </Dialog>
            <Dialog  open={signUpOpen} onClose = {handleDialogueClose}>
                <Box className = {classes.dialogStyle}>
                    <DialogTitle className = {classes.dialogHeaderStyle}>Sign Up</DialogTitle>
                    <DialogContent>
                        <SignUpForm setCurrentUser = {props.setCurrentUser} handleClose={handleDialogueClose}/>
                        
                    </DialogContent>
                </Box>
            </Dialog>
        <Divider className={classes.divider}  orientation="vertical" variant = "fullWidth" flexItem />
              <Button color="secondary" onClick={handleSignUpOpen}>Sign Up</Button>
        </Box>
        )
    }  else {
        return (
            <Box className={classes.logInSpread}>
             <Typography variant="h6" color="secondary"> {userData.username}   </Typography>
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
              <Button color="secondary" onClick={handleLogOut}>Log Out</Button>
        </Box>
        )
    }


}