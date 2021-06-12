import {useContext} from "react";
import ScheduleHolder from "./scheduleComp/ScheduleHolder";
import UserContext from "./utils/UserContext";

export default function UserSchedule() {
    
    const userData = useContext(UserContext);

    //Get correct schedule id from currently logged in user, and then pass
    //That way the schedule component can do the same thing and not have to know the state of the user itself?
    //Though it might still need to know for adding/removing
    let scheduleId = userData.schedule_id;


    return(
        <div><p>UserSchedule</p>
        <p> Log In to save your schedule </p>
        <ScheduleHolder scheduleId = {scheduleId}/>
        
        </div>
    ) 
}