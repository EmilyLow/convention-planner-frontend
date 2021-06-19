import {useState, useEffect, useContext} from "react";
import axios from 'axios';
import styled from "styled-components";

import Schedule from "./Schedule";
import UserContext from "../utils/UserContext";

import organizeEvents from "../utils/organization";

//TODO: DATE FORMAT CONVERSIONS OR LACK THEREOF when stringifying
//Messing with it seems to show that date details are preserved when going back and forth between stringifying and not
//NOTE! For Get and Update, cannot assume schedule is a personal schedule, need to check that. 


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
  


  // if(userData.currentUser.scheduleId === 0) {
  //   setEventsList(JSON.parse(localStorage.guestEvents));

  // } else {
    axios.get(url + "/schedules/" + scheduleId + "/events")
    .then((response) => {

      setEventsList(convertToDate(response.data));

    })
    .catch(error => console.error(`Error: ${error}`))

  // }

  
}

 const getWithoutUpdate = async () => {

   let results;


    // if(userData.currentUser.scheduleId === 0) {
    //   results = JSON.parse(localStorage.guestEvents);
  
    // } else {

      await axios.get(url + "/schedules/" + scheduleId + "/events")
      .then((response) => {

        results = response.data;
      })
      .catch(error => console.error(`Error: ${error}`))

    // }

    return results;
 }


 //TODO: ALTER FOR GUEST USER
 //This creates a promise to update the event, and does not actually update it directly. 
 const updateEvent = (event) => {
   let id = event.id;
   console.log("Update event", event);

   if(userData.currentUser.scheduleId === 0) {
   
    //TODO: Check if this works fine
      return () => {for(var i in eventsList) {
        if(eventsList[i].id === event.id) {
          eventsList[i] = event;
          break;
        }
      }};

   } else {
      return axios.put(url + "/events/" + id, event)
      .then((response) => {
  
      })
      .catch(error => console.error(`Error: ${error}`))
   }


 }


 const deleteEvent = (event) => {

   let eventId = event.id;

   let personalScheduleId = userData.currentUser.scheduleId;

  //  if(personalScheduleId === 0) {
    

  
  //   let indexOfEvent = eventsList.findIndex(i => i.id === event.id);
  //   console.log("in delete", indexOfEvent);
  //   let shortenedEvents = [...eventsList].splice(indexOfEvent, 1);
  //   localStorage.setItem("guestEvents", JSON.stringify(shortenedEvents));

  //   triggerDeleteReorder(event);

  // } else {


    axios.delete(url + "/events/" + eventId)
    .then((response) => {
      triggerDeleteReorder(event);
    })
    .catch(error => console.error(`Error: ${error}`))

  // }
 }


 const addEvent = (event) => {
 
  //TODO: Add Guest data to local storage. 
  let personalScheduleId = userData.currentUser.scheduleId;
  // console.log(userData);

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

  if(personalScheduleId === 0) {
   

    let allEvents = [...eventsList, formEvent];
    //TODO Check if this being a shallow copy is a problem
    localStorage.setItem("guestEvents", JSON.stringify([...allEvents]));
  //   console.log(allEvents);
  //  let stringOf = JSON.stringify([...allEvents]);
  //  let unStringed = JSON.parse(stringOf);
  //  console.log("Unstringed", unStringed);
   
  //  console.log(allEvents[0].start_time);
  //  console.log(new Date(unStringed[0].start_time));

  } else {
   
    


    axios.post(url + "/events", formEvent)
    .then((res) => {
      // console.log("Post res", res);
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