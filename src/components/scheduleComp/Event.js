import styled from "styled-components";
import React from "react";


import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2)
    },
    label: {
      color: "#FFFAFA",
      margin: '0px',
      padding: '4px 2px 1px 2px',
    
    
      fontSize: '14px',
      textAlign: 'center',
      width: '100%',
    
      wordBreak: 'break-word',
      overflow: 'hidden',
      
    
    },
    eventStyle: props => ({
      backgroundColor: props.backgroundColor,


    }),
  }));
  

function Event({details, settings, handleClick}) {


    let startTimeValue = details.start_time.getHours() +(details.start_time.getMinutes() /60);
    let endTimeValue = details.end_time.getHours() + (details.end_time.getMinutes() / 60);
    let length = endTimeValue - startTimeValue;

    const classes = useStyles();
 

    return(
      
        <EventStyle  onClick={ e => handleClick(e, details)} details={details} startTimeValue = {startTimeValue} endTimeValue = {endTimeValue} length = {length} startHour = {settings.startHour}>

            <p className={classes.label}>{details.event_name}</p>

        </EventStyle>
    );
}


const EventStyle = styled.div`
    grid-column: ${(props) => props.details.start_col} / span ${(props) => props.details.span};
    grid-row: ${(props) => (props.startTimeValue - props.startHour) * 4 + 2} / span ${(props) => (props.length * 4)};
    background-color: ${(props) => props.details.color};

    display: flex;
    justify-content: center;
    margin: 1px;
   
  
`;





export default Event;