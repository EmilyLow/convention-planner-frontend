
import ScheduleHolder from "./scheduleComp/ScheduleHolder";
import {useContext} from "react";
import UserContext from "./utils/UserContext";


export default function Home(props) {
    const userData = useContext(UserContext);
    let scheduleId = props.scheduleId;

    if(scheduleId === 0) {
      
        scheduleId = userData.currentUser.scheduleId;
    }


    return(
        <div>
        <ScheduleHolder scheduleId = {scheduleId}/>
        </div>
    ) 
}