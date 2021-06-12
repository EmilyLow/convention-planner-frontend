
import ScheduleHolder from "./scheduleComp/ScheduleHolder";



export default function Shows() {

    let scheduleId = 4; 

    return(
        <div><p>Shows</p>
        <ScheduleHolder scheduleId = {scheduleId}/>
        </div>
    ) 
}