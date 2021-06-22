import {useState, useEffect, useContext} from "react";
import axios from 'axios';
import styled from "styled-components";

import Schedule from "./Schedule";
import UserContext from "../utils/UserContext";

import organizeEvents from "../utils/organization";



function ScheduleHolder({scheduleId}) {



  //TODO: Some of this code was written before guest schedule was always zero, and thus can probably be simplified. 



 const userData = useContext(UserContext);

  

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
   

    if(scheduleId === 0) {
      // setCalendar
      setCalendar({id: 0, schedule_name: "", personal_schedule: 1});


      // Temp, put this somewhere else conditional on it being undefined.
      // localStorage.setItem("guestEvents", JSON.stringify([]));

      triggerLoadReorder(true);
    
      
    } else {
    axios.get(url + "/schedules/"  + scheduleId)
    .then((response) => {

      setCalendar(response.data);
  

      //!!! Temp changed for seed data testing
      // triggerLoadReorder(response.data.personal_schedule);


      //Real version
      if (response.data.personal_schedule) {
        triggerLoadReorder(response.data.personal_schedule);
      } else {
        getEvents(response.data.personal_schedule);
      }
    })
    .catch((err) => {
      console.log("Error retrieving calendar", err);
    })}
  }

 



const getEvents = (personalSchedule) => {
  

  if(userData.currentUser.scheduleId === 0 && personalSchedule) {

    setEventsList(convertToDate(JSON.parse(localStorage.guestEvents)));

  } else {

    axios.get(url + "/schedules/" + scheduleId + "/events")
    .then((response) => {

      setEventsList(convertToDate(response.data));

    })
    .catch(error => console.error(`Error: ${error}`))

  }

  
}

 const getWithoutUpdate = async (personalSchedule) => {

   let results;

    if(userData.currentUser.scheduleId === 0 && personalSchedule) {
      
      results = JSON.parse(localStorage.guestEvents);
      
    } else {

      await axios.get(url + "/schedules/" + scheduleId + "/events")
      .then((response) => {

        results = response.data;
    
      })
      .catch(error => console.error(`Error: ${error}`))

    }

    return results;
 }


 const updateEvent = (event) => {
   let id = event.id;



      return axios.put(url + "/events/" + id, event)
      .then((response) => {
  
      })
      .catch(error => console.error(`Error: ${error}`))
   


 }


 const deleteEvent = (event) => {

   let eventId = event.id;

   let personalScheduleId = userData.currentUser.scheduleId;

   if(personalScheduleId === 0) {

    let indexOfEvent = eventsList.findIndex((i) => {
     return i.id === event.id
    
    });
    

    let copyList = [...eventsList];

    copyList.splice(indexOfEvent, 1);

    localStorage.setItem("guestEvents", JSON.stringify(copyList));
  

    triggerDeleteReorder(event);

  } else {


    axios.delete(url + "/events/" + eventId)
    .then((response) => {
      triggerDeleteReorder(event);
    })
    .catch(error => console.error(`Error: ${error}`))

  }
 }


 const addEvent = (event) => {
 


  let personalScheduleId = userData.currentUser.scheduleId;
  console.log("personalScheduleId", personalScheduleId);

 
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
 
    formEvent = {...formEvent, id: event.id};

    let allEvents = JSON.parse(localStorage.guestEvents);
  
    localStorage.setItem("guestEvents", JSON.stringify([...allEvents, formEvent]));


  } else {
   



    axios.post(url + "/events", formEvent)
    .then((res) => {
      console.log(res);
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


  async function triggerLoadReorder(personalSchedule) {
    
    
   let allEvents = await getWithoutUpdate(personalSchedule);
  
   let formEvents = convertToDate(allEvents);

   let organized = reorganizeAll(formEvents);


   if(scheduleId === 0 && personalSchedule) {

    localStorage.setItem("guestEvents", JSON.stringify(organized));
    getEvents(personalSchedule);


   } else {

    let  promises = organized.map(async event => {
 
      return await updateEvent(event);;
    });

    

    Promise.all(promises)
      .then(() => {
        getEvents(personalSchedule);
      });
   }


  }


  async function triggerDeleteReorder(deletedEvent) {
  
  
    if(scheduleId === 0)  {

      
      let remainingEvents = JSON.parse(localStorage.guestEvents);
 
      let formRemainingEvents = convertToDate(remainingEvents);

      let remainingOnDay = getEventsOnDay(formRemainingEvents, deletedEvent.start_time);

      let dayNum = dateDiff(settings.startDate, deletedEvent.start_time);
      let organized = organizeEvents(remainingOnDay, dayNum);



 
      for(let i = 0; i < organized.length; i++) {
        for(let j = 0; j < formRemainingEvents.length; j++) {
        

          if(formRemainingEvents[j].id === organized[i].id) {
           
            formRemainingEvents[j] = organized[i];
            break;
          }
        }
      }

      localStorage.setItem("guestEvents", JSON.stringify(formRemainingEvents));
   
      getEvents(calendar.personal_schedule);

    } else {
    //TODO, add input

      let remainingEvents =  await getWithoutUpdate(calendar.personal_schedule);
      let formRemainingEvents = convertToDate(remainingEvents);
      
      let remainingOnDay = getEventsOnDay(formRemainingEvents, deletedEvent.start_time);
      let dayNum = dateDiff(settings.startDate, deletedEvent.start_time);
      
      let organized = organizeEvents(remainingOnDay, dayNum);

      let promises = organized.map(async event => {
        return await updateEvent(event);
      })



      Promise.all(promises)
      .then(() => {
        getEvents(calendar.personal_schedule);
      })
    }
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