
import ScheduleHolder from "./scheduleComp/ScheduleHolder";



export default function Home() {

    let scheduleId = 1; 

    return(
        <div><p>Core</p>
        <ScheduleHolder scheduleId = {scheduleId}/>
        </div>
    ) 
}