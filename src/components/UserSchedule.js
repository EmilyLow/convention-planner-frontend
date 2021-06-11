import ScheduleHolder from "./scheduleComp/ScheduleHolder";


export default function UserSchedule() {
    


    //Get correct schedule id from currently logged in user, and then pass
    //That way the schedule component can do the same thing and not have to know the state of the user itself?
    //Though it might still need to know for adding/removing
    let scheduleId = 0;


    return(
        <div><p>UserSchedule</p>
        <p> Log In to save your schedule </p>
        <ScheduleHolder scheduleId = {scheduleId}/>
        
        </div>
    ) 
}