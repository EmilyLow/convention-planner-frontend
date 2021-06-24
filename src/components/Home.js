import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Typography  from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'center',
        // width: `100%`,
     
        padding: theme.spacing(2)
      },
    boxStyle: props => ({
        margin: '0 auto',
        
        width: '70%',
        marginTop: '80px',
        textAlign: "center",
        padding: '30px',


        [theme.breakpoints.down('sm')]: {
            width: '90%',
            marginTop: '30px',
          }, 
    }),
    titleStyle: {
        marginBottom: '30px',
    },
    subTitleStyle: {
        marginTop: '60px',
        marginBottom: '30px',
    },
    addendumStyle: {
        marginTop: '80px',
    }
  }));

export default function Home() {
    const classes = useStyles();

    return(
        <Paper outlined className={classes.boxStyle}>
         
            <Typography  className={classes.titleStyle} variant="h3" component="h1"> Welcome to NecronomiCon Providence </Typography>
            <Typography  variant="h6" component="p">A bi-yearly convention celebrating weird fiction.</Typography>

            <Typography className={classes.subTitleStyle}  variant="h4" component="h2">Plan your visit today</Typography>
            <Typography  variant="body1" component="p">View the schedules for each type of event by clicking the tabs above, and then events that interest you to your own personal schedule. Sign up to access your schedule anywhere.</Typography>

           <Typography className = {classes.addendumStyle} variant="body2" component="p"> Go to the NecronomiCon's <Link color='secondary' href='http://necronomicon-providence.com/welcome/'>Official Website</Link> </Typography> 

         
        </Paper>
    ) 
}