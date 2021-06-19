
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
        // justifyContent: 'center',
        // width: `100%`,
     
        padding: theme.spacing(2)
      },
    textFieldStyle: props => ({
        padding: theme.spacing(1)
        // background: "#FFFFFF", //White
        // padding: theme.spacing(1),
    }),
    buttonStyle: props => ({
        padding: theme.spacing(1)
        // color: "#FFFFFF" //White
    })
  }));

export default function LoginForm(props) {

    const classes = useStyles();
    const {handleSubmit, control } = useForm();

    // const {setUserDataContext, userData} = useContext(UserContext);

    //Change location of this or use Context
    const {currentUser, setCurrentUser} = useContext(UserContext);


    const onSubmit = data => {
        console.log("Click");
        console.log(data);
        //TODO Log in
        logInUser(data);

    };  

    const logInUser = (values) => {
        //TODO Figure out why id is not being passed
        console.log("Log in results");
        axiosWithAuth()
        .post("http://localhost:3002/users/auth/login", values)
        .then((res) => {
            console.log("Log in res", res);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("loggedInUserId", res.data.id);
           
            setCurrentUser({userId: res.data.id, username: res.data.username, scheduleId: res.data.schedule_id});
            // setUserDataContext({userId: res.data.id, username: res.data.username, scheduleId: res.data.scheduleId});
            props.handleClose();
            //TODO: currently a failed login errors out without informing the user outside of the console
            //TODO: Set Log In/ Sign up to change if logged in
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
                    <Button type="submit" className = {classes.buttonStyle}>
                    Submit
                    </Button>

            </form>
   
    )
}