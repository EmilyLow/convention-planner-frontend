import ScheduleHolder from "./scheduleComp/ScheduleHolder";


export default function UserSchedule() {
    let scheduleId = 0;
    //TODO: Change temp value
    //Maybe instead of passing, a scheduleId of zero should prompt it to check general user value? 
    //Add context? 
    let userId = 1;

    return(
        <div><p>UserSchedule</p>
        <p> Log In to save your schedule </p>
        <ScheduleHolder scheduleId = {scheduleId} userId = {userId} />
        
        </div>
    ) 
}