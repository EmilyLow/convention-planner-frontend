import {useState, useEffect, useContext} from "react";
import axios from 'axios';
import styled from "styled-components";

import Schedule from "./Schedule";
import UserContext from "../utils/UserContext";

import organizeEvents from "../utils/organization";

//TODO: Fixed logging in but add/deleting broken

function ScheduleHolder({scheduleId}) {

 console.log("schedule id", scheduleId);


 const userData = useContext(UserContext);
  // console.log(userData);

  const settings = {
    dayNum: 4,
    hourNum: 16,
    startHour: 8,
    startDate: new Date(2019, 7, 22)
  };
 
  const [eventsList, setEventsList] = useState([]);
  const [calendar, setCalendar] = useState({});




  const url = 'http://localhost:3002';


  useEffect( () => {
 
    getCalendar();

  }, [scheduleId]);

 

  const getCalendar = () => {
 
    axios.get(url + "/schedules/"  + scheduleId)
    .then((response) => {

      setCalendar(response.data);
  
    
      
      //!!! Temp changed for seed data testing
      triggerLoadReorder();


      //Real version
      // if (response.data.personal_schedule) {
      //   triggerLoadReorder();
      // } else {
      //   getEvents();
      // }
    })
    .catch((err) => {
      console.log("Error retrieving calendar", err);
    })
  }

 



const getEvents = (personalSchedule) => {
  
  //TODO
  //Check for Guest & Personal Calendar
  //If both, pull events from local storage

  axios.get(url + "/schedules/" + scheduleId + "/events")
  .then((response) => {

    setEventsList(convertToDate(response.data));

  })
  .catch(error => console.error(`Error: ${error}`))
}

 const getWithoutUpdate = async () => {

   let results;

    //TODO
    //Check for Guest & Personal Calendar
    //If both, pull events from local storage

   await axios.get(url + "/schedules/" + scheduleId + "/events")
   .then((response) => {

    results = response.data;
   })
   .catch(error => console.error(`Error: ${error}`))

   return results;
 }



 //This creates a promise to update the event, and does not actually update it directly. 
 const updateEvent = (event) => {
   let id = event.id;
   

  return axios.put(url + "/events/" + id, event)
   .then((response) => {

   })
   .catch(error => console.error(`Error: ${error}`))
 }


 const deleteEvent = (event) => {

   let id = event.id;

   //TODO
   //Check if user is guest user
   //If so, delete from local storage

   axios.delete(url + "/events/" + id)
   .then((response) => {
    triggerDeleteReorder(event);
   })
   .catch(error => console.error(`Error: ${error}`))
 }


 const addEvent = (event) => {
 
  //TODO: Add Guest data to local storage. 
  let personalScheduleId = userData.currentUser.scheduleId;
  // console.log(userData);

  if(personalScheduleId === 0) {
    console.log("Error: Can't add event to guest schedule.");
    //Pull all events from local storage
    //Unstringify into array
    //Add new event
    //Stringify and put back

  } else {
   
    let formEvent = {
      event_name: event.event_name,
      schedule_id: personalScheduleId,
      speaker: event.speaker,
      summary: event.description,
      location: event.location,
      start_time: event.start_time,
      end_time: event.end_time,
      start_col: 0,
      span: 0,
      color: event.color
    };


    axios.post(url + "/events", formEvent)
    .then((res) => {
      console.log("Post res", res);
    })
    .catch(error => console.error(`Error: ${error}`))
  }
}


  //Reorganizes all dates
  function reorganizeAll(unorganizedList) {
   
    let startDate = new Date(settings.startDate);
    let allEvents = [];
    for(let i = 0; i <settings.dayNum; i++) {
      let currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      let eventSubset = getEventsOnDay(unorganizedList, currentDate);
  

      let organizedSubset = organizeEvents(eventSubset, i);

      allEvents = [...allEvents, ...organizedSubset];
    }

    return allEvents;
  }


  async function triggerLoadReorder() {
    
   let allEvents = await getWithoutUpdate();
   let formEvents = convertToDate(allEvents);
   let organized = reorganizeAll(formEvents);

   let  promises = organized.map(async event => {
 
      return await updateEvent(event);;
    });

    Promise.all(promises)
      .then(() => {
        getEvents();
      });

  }

 
  async function triggerDeleteReorder(deletedEvent) {
   
    let remainingEvents =  await getWithoutUpdate();
    let formRemainingEvents = convertToDate(remainingEvents);
    
    let remainingOnDay = getEventsOnDay(formRemainingEvents, deletedEvent.start_time);

    

    let dayNum = dateDiff(settings.startDate, deletedEvent.start_time);

    
    let organized = organizeEvents(remainingOnDay, dayNum);

    let promises = organized.map(async event => {
      return await updateEvent(event);
    })

    Promise.all(promises)
    .then(() => {
      getEvents();
    })
  }


const convertToDate = (rawEvents) => {
  let postEvents = [];

  rawEvents.forEach(event => {

      let newEvent = {...event};
        

        newEvent.start_time = new Date(event.start_time);
        newEvent.end_time = new Date(event.end_time);
  
        postEvents.push(newEvent);
  })
  return postEvents;
}



  function dateDiff(first, second) {
    let firstCopy = new Date(first);
    let secondCopy = new Date(second);

    firstCopy.setMinutes(0);
    firstCopy.setHours(0);
    secondCopy.setMinutes(0);
    secondCopy.setHours(0);


    return Math.round((secondCopy-firstCopy)/(1000*60*60*24));
}

 function getEventsOnDay(rawEvents, targetDate) {
  let month = targetDate.getMonth();
  let date = targetDate.getDate();


 //Currently a promise
  let eventsOnDay = [];

  rawEvents.forEach(event => {
   


      if(event.start_time.getMonth() === month && event.start_time.getDate() === date) {
      
          eventsOnDay.push(event);
      }
  })

  return eventsOnDay;
}




  return (
    <LayoutDiv>
      <ScheduleDiv>
        <Schedule settings = {settings} eventsList = {eventsList} addEvent = {addEvent} deleteEvent={deleteEvent} personalSchedule={calendar.personal_schedule}/>
      </ScheduleDiv>
    </LayoutDiv>
  );
}

export default ScheduleHolder;



const ScheduleDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;



const LayoutDiv = styled.div`
  display: flex;
  flex-direction: row;


`;