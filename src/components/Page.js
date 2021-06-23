
import ScheduleHolder from "./scheduleComp/ScheduleHolder";
import {useContext} from "react";
import UserContext from "./utils/UserContext";

import { makeStyles } from '@material-ui/core/styles';

//TODO: Enable side-scrolling if width exceeds page size
const useStyles = makeStyles( theme => ({

    mainDiv: props => ({

        //My current thinking is that flexbox forcing it over the left side is the source of this problem.
        //And this use case doesn't fit flexbox well.
        //So I'm probably better off figuring out how to center it without flexbox
        //I might be better off figuring out refs first though, if I can
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px',
        // border: '1px solid blue',

        overflowX: 'auto',
        //May need fixed width for this to work?
        // margin: 'auto'

        //Currently, scrolling allows elements to be visible on right but not on left. Centering it means some things are pushed out to left passed visibility
        //Can I change the layout rules? So that it stops being centered in the middle when scrolling?
        //The problem occurs with both center and space around

        // flexWrap: 'nowrap',
        // overflowX: 'auto',
        // overflowX: 'visible',


        //doing this instead of flexbox normalizes horizontal scrolling
        //margin: '40px 100px 0px 100px',
        //Or this
        //     padding: '40px',
        //    margin: 'auto',
        //    width: '80%'


        //This half works for a horizontal scroll bar
        // overflowX: 'auto'
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