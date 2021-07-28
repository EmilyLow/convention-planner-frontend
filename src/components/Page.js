
import ScheduleHolder from "./scheduleComp/ScheduleHolder";
import {useContext} from "react";
import UserContext from "./utils/UserContext";
import axios from 'axios';

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
          maxWidth: '100px',
          maxHeight: '100px',
          padding: '10px',
          marginRight: '50px',
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.primary.main
      }
        
    
}));


export default function Page(props) {
    const userData = useContext(UserContext);
    let scheduleId = props.scheduleId;

    if(scheduleId === 0) {
      
        scheduleId = userData.currentUser.scheduleId;
    }

    let personalSchedule = false;

    if(props.scheduleId === 0) {
        personalSchedule = true;
    }

    const classes = useStyles();

  

    //Works but needs to trigger visual reload. 
    const clearData = () => {
       
        console.log(scheduleId);
        if(scheduleId === 0) {
            //Guest user, local storage
            localStorage.setItem("guestEvents", JSON.stringify([]));
        } else {
            //Logged in user, backend
            
            axios.delete(props.url + "/schedules/" + scheduleId + "/events")
            .then((response) => {
                
            })
            .catch(error => console.error(`Error: ${error}`))
        }
    }

    let clearButton = <></>; 

  if(personalSchedule) {
      clearButton = <Button onClick={clearData}  variant="contained" className={classes.clearButton}>Clear Schedule</Button>
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