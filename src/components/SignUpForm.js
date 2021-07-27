
import { useContext} from "react";
import UserContext from "./utils/UserContext";

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
 
     
        padding: theme.spacing(2)
      },

    textFieldStyle: props => ({
        padding: theme.spacing(1)

    }),
    buttonStyle: props => ({
        padding: theme.spacing(1)
    }),
    logInSpread: props => ({
        display: "flex",
        justifyContent: "center",
        
    
      })
  }));

export default function SignUpForm(props) {
    

    const classes = useStyles();
    const {setCurrentUser} = useContext(UserContext);
    const {handleSubmit, control, watch } = useForm();

    let watchPassword = watch("password", "");

    const onSubmit = data => {
     

        signUpUser(data);

    };  


    const signUpUser = (values) => {


        let userData = {username: values.username, password: values.password};

        axios.post(props.url + "/users/auth/register", userData) 
        .then((res) => {
          
            axiosWithAuth()
            .post(props.url + "/users/auth/login", userData)
            .then((res) => {

                localStorage.setItem("token", res.data.token);
             
                localStorage.setItem("loggedInUserId", res.data.id);
               
                setCurrentUser({id: res.data.id, username: res.data.username, scheduleId: res.data.schedule_id});
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