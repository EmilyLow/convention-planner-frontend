import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import React from "react";
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Location from '@material-ui/icons/LocationOn';
import PeopleAlt from '@material-ui/icons/PeopleAlt';
import Subject from '@material-ui/icons/Subject';
import Button from "@material-ui/core/Button";



function ContentPane({details, addEvent, deleteEvent, handleClose, personalSchedule}) {
  
    

   
    
    function militaryToStan (milHour, minutes) {
        let minString = minutes;
        if(minString === 0) {
            minString = "00";
        }
        if (milHour <= 12) {
            return "" + milHour + ":" + minString + " AM";
        }
        else {
            return "" + (milHour - 12) + ":" + minString +  " PM";
        }
    }

    const days = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];

    let formattedStart;
    let formattedEnd;
    let formattedDate;
    let formattedTime;

    if(Object.keys(details).length !== 0) {

        let startTimeValue = details.start_time;
        let endTimeValue = details.end_time;

        formattedStart = militaryToStan(startTimeValue.getHours(), startTimeValue.getMinutes());
        formattedEnd = militaryToStan(endTimeValue.getHours(), endTimeValue.getMinutes());
        formattedDate = "" + days[startTimeValue.getDay()] + ", " +(startTimeValue.getMonth() + 1) + "/" + startTimeValue.getDate() + "/" + startTimeValue.getFullYear();
        formattedTime = formattedStart + " to " + formattedEnd + ", " + formattedDate;
    }

    //TODO Change
    function deleteAction() {
  
        handleClose();
        deleteEvent(details);
        
    }

    //TODO Add addEvent;
    function addAction() {

        handleClose();
        addEvent(details);
    }


    function getButton(userCal) {

        if(userCal) {
            return <Button  xs = {4} variant="outlined" onClick={() => {deleteAction()}}>Remove</Button>;
        } else {
            return <Button  xs = {4} variant="outlined" onClick={() => {addAction()}}>Add</Button>;
        }
    }

    return(<EventDiv>
        <Grid container>
            {/* Note: Temporary for testing */}
            {/* <Grid><p>{details.id}</p></Grid> */}
             <Grid item xs={12}> <Typography variant={'h5'}>{details.event_name}</Typography> </Grid>
             <Grid item xs={12}><Typography variant={'subtitle1'}> {formattedTime}</Typography> </Grid>

             <Grid item xs={12}> <Divider style={{marginBottom:'8px'}} /> </Grid>
             
     

            { details.location !== "" && <Grid item xs = {2}><Location/> </Grid>}
            { details.location !== "" && <Grid item xs = {10}><Typography variant = {'body1'}>{details.location}</Typography></Grid>}

            { details.speaker !== "" && <Grid item xs = {2}><PeopleAlt/> </Grid>}
            { details.speaker !== "" && <Grid item xs = {10}><Typography variant = {'body1'}>{details.speaker}</Typography></Grid>}

            { details.summary !== "" && <Grid item xs = {2}><Subject/> </Grid>}
            { details.summary !== "" && <Grid item xs = {10}><Typography variant = {'body1'}>{details.summary}</Typography></Grid>}
            {/* ToDo: Switch to remove button if event is added to a user schedule  */}
           <Grid>
               
               {getButton(personalSchedule)}
           
           </Grid> 
           
        </Grid>
            
    </EventDiv>)
}



const EventDiv = styled.div`
    margin: 8px;

`;



export default ContentPane;