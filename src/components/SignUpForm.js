
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import {Controller, useForm,} from "react-hook-form";
import axios from "axios";

import axiosWithAuth from "./utils/axiosWithAuth";

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
        
    
      })
  }));

export default function SignUpForm(props) {

    const classes = useStyles();
    const {handleSubmit, control, watch } = useForm();

    let watchPassword = watch("password", "");

    const onSubmit = data => {
     

        signUpUser(data);

    };  

    //TODO: Alert user if username is taken
    //TODO: Fix formatting on logged in name
    const signUpUser = (values) => {


        let userData = {username: values.username, password: values.password};

        
        
        axios.post("http://localhost:3002/users/auth/register", userData) 
        .then((res) => {
          
            axiosWithAuth()
            .post("http://localhost:3002/users/auth/login", userData)
            .then((res) => {

                localStorage.setItem("token", res.data.token);
                // localStorage.setItem("loggedInUser", res.data.username);
                localStorage.setItem("loggedInUserId", res.data.id);
            
                props.setCurrentUser({id: res.data.id, username: res.data.username, schedule_id: res.data.schedule_id});
                props.handleClose();
               
                
            })
            .catch((err) => {
                console.log("Error while logging in", err);
            })


        })
        .catch((err) => {
            console.log("Error while signing up", err);
        })
        

       
    }

    let checkForMatch = (pass2) => {
        if(watchPassword === pass2) {
            return true;
        } else {
            return false;
        }
    }

    return(

                <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="username"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Username"
                                className = {classes.textFieldStyle}
                                // variant="filled"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                            />
                        )}
                        rules={{ required: 'Username required'}}
                    />
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Password"
                                className = {classes.textFieldStyle}
                                // variant="filled"
                                type="password"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                            />
                        )}
                        rules={{ required: 'Password required'}}
                    />
                    <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Confirm Password"
                                className = {classes.textFieldStyle}
                                // variant="filled"
                                type="password"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                            />
                        )}
                        rules={{ validate: {match: v => checkForMatch(v) || "Passwords must match"}}}
                    />
                    <Button type="submit" className = {classes.buttonStyle}>
                    Submit
                    </Button>

            </form>
   
    )
}