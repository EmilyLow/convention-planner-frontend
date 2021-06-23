
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
        
        
        overflowX: 'auto',
      //Breakpoint: When < breakpoint, switch to justifyContent: flexStart
      [theme.breakpoints.down('md')]: {
        //backgroundColor: theme.palette.secondary.main,
        justifyContent: 'flex-start'
      },


        
    }),
}));


export default function Home(props) {
    const userData = useContext(UserContext);
    let scheduleId = props.scheduleId;

    const classes = useStyles();

    if(scheduleId === 0) {
      
        scheduleId = userData.currentUser.scheduleId;
    }


    return(
        <div className={classes.mainDiv}>
            <ScheduleHolder scheduleId = {scheduleId} sizeMult={2}/>
        </div>
    ) 
}