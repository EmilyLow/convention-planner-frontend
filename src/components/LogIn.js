import {useState} from "react";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


import LoginForm from "./LoginForm"

const useStyles = makeStyles( theme => ({
    //Todo, logout
    //Logout might be a frontend only thing

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


    const classes = useStyles();
   
    let [logInOpen, setLogInOpen] = useState(false);

    

        const handleLogOut = () => {
            props.setCurrentUser("Guest");
            localStorage.setItem("token", "");
            localStorage.setItem("loggedInUser", "Guest");
        }

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
              <Button color="secondary" onClick={handleLogOut}>Log Out</Button>
        </Box>
        )
    }


}