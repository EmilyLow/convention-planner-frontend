
import { useContext} from "react";
import UserContext from "./utils/UserContext";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import {Controller, useForm,} from "react-hook-form";

import axiosWithAuth from "./utils/axiosWithAuth";

const useStyles = makeStyles( theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
  
     
        padding: theme.spacing(2)
      },
    textFieldStyle:{
        padding: theme.spacing(1)
 
    },
    buttonStyle:{
        padding: theme.spacing(1)

    }
  }));

export default function LoginForm(props) {

    const classes = useStyles();
    const {handleSubmit, control } = useForm();

    const { setCurrentUser} = useContext(UserContext);


    const onSubmit = data => {
 
        logInUser(data);

    };  

    const logInUser = (values) => {

        axiosWithAuth()
        .post("http://localhost:3002/users/auth/login", values)
        .then((res) => {
       

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("loggedInUserId", res.data.id);
           
            setCurrentUser({userId: res.data.id, username: res.data.username, scheduleId: res.data.schedule_id});
           
            props.handleClose();
           
        })
        .catch((err) => {
            console.log("Error while logging in", err);
        })

       
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
                    <Button type="submit" className = {classes.buttonStyle}>
                    Submit
                    </Button>

            </form>
   
    )
}