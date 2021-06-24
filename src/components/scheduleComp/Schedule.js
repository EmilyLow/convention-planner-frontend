import styled from "styled-components";
import Popover from '@material-ui/core/Popover';
import React from "react";
import ContentPane from "./ContentPane";


import Event from "./Event";

function Schedule(props) {

    let {settings, eventsList, addEvent, deleteEvent, personalSchedule} = props;

    // const eventRef = useRef();
    // console.log("Schedule ref", eventRef);
 

const [anchorEl, setAnchorEl] = React.useState(null);
 const [popContents, setPopContents] = React.useState({});

const handleClick = (event, pDetails) => {

    setAnchorEl(event.currentTarget);
    setPopContents(pDetails);
};

const handleClose = () => {
    setAnchorEl(null);
    setPopContents({});
};

const open = Boolean(anchorEl);
const id = open ? "simple-popover" : undefined;

    const days = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];

    let gridBoxWidth = Math.round(20 * props.sizeMult) + 'px';
  
    let hours = [];

   
    for (let i = 0; i < settings.dayNum; i++) {
       for (let j = 0; j < settings.hourNum; j++) {
           //Note! Changing from 0 start to 1 start here.
        hours.push(<Hour  key = {"hour" + i + j} day={i} hour={j}/>)
     }
    }

    let hourLabels = [];
    for (let i = 0; i < settings.hourNum; i++) { 
        hourLabels.push(<HourLabel key = {"hourlabel" + i} hour = {i}> {militaryToStan(i + settings.startHour)}</HourLabel>);
    }

    function militaryToStan (milHour) {
        if (milHour <= 12) {
            return "" + milHour + " AM";
        }
        else {
            return "" + (milHour - 12) + " PM";
        }
    }


    let dayLabels = [];
    
    
    let labelDate = new Date(settings.startDate.getTime());

    for(let i = 0; i < settings.dayNum; i++) {

        

        if (i > 0) {
            const currentDate = labelDate.getDate();
            labelDate.setDate(currentDate + 1);
        }

        
        let  dayNum = labelDate.getDate();
        let  dayString = days[labelDate.getDay()];

       dayLabels[i] = <DayLabel key = {"dl" + i} day = {i}>

            <DayH>{dayString}</DayH>
            <DayH>{dayNum}</DayH>
            </DayLabel>
    }  
    return(
        
        <ScheduleContainer settings={settings} width = {gridBoxWidth} num={3}> 
           
           
            {dayLabels}
            {hourLabels}
            {hours}
             {eventsList.map(listing => { 
                    return <Event  handleClick = {handleClick} key = {listing.id} details = {listing} settings={settings}/>;
                 })}
                 <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          PaperProps={{
            style: { width: '300px' },
          }}
        >
           
            <ContentPane details = {popContents} addEvent={addEvent} deleteEvent={deleteEvent} handleClose={handleClose} personalSchedule={personalSchedule}/>
            
         
        </Popover>
                
        </ScheduleContainer>
    );
}

export default Schedule;


const ScheduleContainer = styled.div`
    display: grid;
    grid-template-columns: 50px repeat(calc(12 * ${(props) => props.settings.dayNum}), ${(props) => props.width});
    //grid-template-columns: 50px repeat(calc(12 * ${(props) => props.settings.dayNum}), 20px);
    grid-template-rows: 80px repeat(${(props) => props.settings.hourNum * 4}, 10px);
  
    padding-right: 30px;
    
   

  

`;

const Hour = styled.div`

    grid-column-start: ${(props) => props.day * 12 + 2};
    grid-column-end: span 12;
    grid-row-start: ${(props) => props.hour *4 + 2};
    grid-row-end: span 4;

    outline: 1px solid gray;
    margin-top: 1px;
    margin-left: 1px;

`

const HourLabel = styled.div`

    grid-column-start: 1;
    grid-column-end: span 1;
    grid-row-start: ${(props) => props.hour *4 + 2};
    grid-row-end: span 4;

    
    display: flex;
    justify-content: center;
    align-items: center;

    background: 
    linear-gradient(grey, grey) top right / 50% 1px ;
    background-repeat:no-repeat;

`;

const DayLabel = styled.div`

    grid-column-start: ${(props) => props.day * 12 + 2};
    grid-column-end: span 12;
    grid-row-start: 1;
    grid-row-end: span 1;

    

    background: 
    linear-gradient(grey, grey)  bottom left / 1px 65% ;
   background-repeat:no-repeat;

   display: flex;
   flex-direction: column;
  justify-content: space-evenly;
   align-items: center;

 
`

const DayH = styled.h3`

    margin: 0;
`;