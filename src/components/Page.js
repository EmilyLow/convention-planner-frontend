
import ScheduleHolder from "./scheduleComp/ScheduleHolder";
import {useContext} from "react";
import UserContext from "./utils/UserContext";

import { makeStyles } from '@material-ui/core/styles';

//TODO: Enable side-scrolling if width exceeds page size
const useStyles = makeStyles( theme => ({

    mainDiv: props => ({

        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px',
        marginLeft: '30px',
        marginBottom: '40px',
        
        
        overflowX: 'auto',
     
        //TODO: Make conditional on sizeMult
        //Probably two differnet styles and which one is conditional?

      [theme.breakpoints.down('md')]: {
     
        justifyContent: 'flex-start'
      },


        
    }),
}));


export default function Page(props) {
    const userData = useContext(UserContext);
    let scheduleId = props.scheduleId;

    const classes = useStyles();

    if(scheduleId === 0) {
      
        scheduleId = userData.currentUser.scheduleId;
    }


    return(
        <div className={classes.mainDiv}>
            <ScheduleHolder scheduleId = {scheduleId} sizeMult={props.sizeMult}/>
        </div>
    ) 
}