
import ScheduleHolder from "./scheduleComp/ScheduleHolder";
import {useContext} from "react";
import UserContext from "./utils/UserContext";

import { makeStyles } from '@material-ui/core/styles';

//TODO: Enable side-scrolling if width exceeds page size
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
        
    
}));


export default function Page(props) {
    const userData = useContext(UserContext);
    let scheduleId = props.scheduleId;

    const classes = useStyles();

    if(scheduleId === 0) {
      
        scheduleId = userData.currentUser.scheduleId;
    }

    if(props.sizeMult <= 1) {
        return(
            <div className={classes.mainDivNormal}>
                <ScheduleHolder scheduleId = {scheduleId} sizeMult={props.sizeMult}/>
            </div>
        ) 
    } else {
        return(
            <div className={classes.mainDivLarge}>
                <ScheduleHolder scheduleId = {scheduleId} sizeMult={props.sizeMult}/>
            </div>
        ) 
    }

    
}