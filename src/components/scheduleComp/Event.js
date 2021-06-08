import styled from "styled-components";
import React from "react";


import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2)
    }
  }));
  

function Event({details, settings, deleteEvent, handleClick}) {



    let startTimeValue = details.start_time.getHours() +(details.start_time.getMinutes() /60);
    let endTimeValue = details.end_time.getHours() + (details.end_time.getMinutes() / 60);
    let length = endTimeValue - startTimeValue;

    const classes = useStyles();
 

    return(
      
        <EventStyle onClick={ e => handleClick(e, details)} details={details} startTimeValue = {startTimeValue} endTimeValue = {endTimeValue} length = {length} startHour = {settings.startHour}>

            <Label>{details.event_name}</Label>
        </EventStyle>
    );
}


const EventStyle = styled.div`
    grid-column: ${(props) => props.details.start_col} / span ${(props) => props.details.span};
    grid-row: ${(props) => (props.startTimeValue - props.startHour) * 4 + 2} / span ${(props) => (props.length * 4)};
    background-color: ${(props) => props.details.color};

    display: flex;
    justify-content: center;

   // margin-left: 1px;
   //border: 1px solid black;
   margin: 1px;
   
  
`;


const Label = styled.p`
  margin: 0px;
  padding-top: 4px;
  //display: flex;
  //justify-content: center;
  //align-items: center;


  font-size: 14px;
  text-align: center;
  width: 100%;
  //height: 100%;

  overflow: hidden;
  //overflow-y: hidden
  

`;



export default Event;