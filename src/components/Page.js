
import ScheduleHolder from "./scheduleComp/ScheduleHolder";
import {useContext} from "react";
import UserContext from "./utils/UserContext";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles( theme => ({

    mainDivNormal: {
      
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px',
        marginLeft: '30px',
        marginBottom: '40px',
        
        
        overflowX: 'auto',
 
        [theme.breakpoints.down('md')]: {
     
            justifyContent: 'flex-start'
          },
    },
      
    mainDivLarge: {
        
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px',
        marginLeft: '30px',
        marginBottom: '40px',
        
        
        overflowX: 'auto',

        [theme.breakpoints.down('lg')]: {
     
            justifyContent: 'flex-start'
          },
     
      },

      clearButton: {
          maxWidth: '150px',
          maxHeight: '100px',
          padding: '10px',
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.primary.main
      }
        
    
}));


export default function Page(props) {
    const userData = useContext(UserContext);
    let scheduleId = props.scheduleId;

    const classes = useStyles();

    let clearButton = <></>; 

  if(scheduleId === 0) {
      clearButton = <Button  variant="contained" className={classes.clearButton}>Clear Schedule</Button>
  }

    if(scheduleId === 0) {
      
        scheduleId = userData.currentUser.scheduleId;
    }

    if(props.sizeMult <= 1) {
        return(
            <div className={classes.mainDivNormal}>
                <div>
                {clearButton}
                </div>
                
                <ScheduleHolder scheduleId = {scheduleId} sizeMult={props.sizeMult} url={props.url}/>
            </div>
        ) 
    } else {
        return(
            <div className={classes.mainDivLarge}>
               <div>{clearButton}</div> 
                <ScheduleHolder scheduleId = {scheduleId} sizeMult={props.sizeMult} url={props.url}/>
            </div>
        ) 
    }

    
}