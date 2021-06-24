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

      }),
      usernameStyle: props => ({
          marginRight: '10px',
      })
  }));

export default function AuthBox(props) {


    const {currentUser, setCurrentUser} = useContext(UserContext);

  


    const classes = useStyles();
   
    let [logInOpen, setLogInOpen] = useState(false);
    let [signUpOpen, setSignUpOpen] = useState(false);
    

        const handleLogOut = () => {
            setCurrentUser({userId: 0, scheduleId: 0, username: 'Guest'});
            localStorage.setItem("token", "");

            localStorage.setItem("loggedInUserId", 0);
        }

        const handleLogInOpen = () => {
            setLogInOpen(true);
            setSignUpOpen(false);
        }

        const handleSignUpOpen = () => {
            setLogInOpen(false);
            setSignUpOpen(true);
           
        }
        
          const handleDialogueClose = () => {
            setLogInOpen(false);
            setSignUpOpen(false);
          }


    if(currentUser.userId === 0) {
        return(
            <Box className={classes.logInSpread}>
            <Button color="secondary" onClick={handleLogInOpen}>Log In</Button>  
            <Dialog  open={logInOpen} onClose = {handleDialogueClose}>
                <Box className = {classes.dialogStyle}>
                    <DialogTitle className = {classes.dialogHeaderStyle}>Log In</DialogTitle>
                    <DialogContent>
                        <LoginForm setCurrentUser = {props.setCurrentUser} handleClose={handleDialogueClose}/>
                        <Button  color="secondary" onClick={handleSignUpOpen}>Sign Up</Button>
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
             <Typography className={classes.usernameStyle} variant="h6" color="secondary">{currentUser.username}   </Typography>
        <Divider className={classes.divider}  orientation="vertical" variant = "fullWidth" flexItem />
              <Button color="secondary" onClick={handleLogOut}>Log Out</Button>
        </Box>
        )
    }


}