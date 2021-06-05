import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles( theme => ({
    main: props => ({
    //   background: "#f2eecb",
    //   color: theme.palette.primary.main,
  
    }),
  }));


export default function Games() {
    const classes = useStyles();

    return(
     <Box class={classes.main}>
            <p>Games</p>
            
       </Box>
    ) 
}