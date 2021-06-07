import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

import {Controller, useForm,} from "react-hook-form";

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
  }));

export default function LogIn(props) {

    const classes = useStyles();
    const {handleSubmit, control, watch } = useForm();

    const onSubmit = data => {
        console.log("Click");
        console.log(data);
        //TODO Log in

    };  

    return(
        <Dialog  open={props.open} onClose = {props.handleClose}>
            <Box className = {classes.dialogStyle}>
                <DialogTitle>Log In</DialogTitle>
                <DialogContent>
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
                    <Link href="#" variant="p" color="secondary">Sign Up</Link>
                    </DialogContent>
               
                
                
            </Box>
            

        </Dialog>
      
    )
}