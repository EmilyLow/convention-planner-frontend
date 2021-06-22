import {useState, useEffect, useContext} from "react";
import axios from 'axios';
import styled from "styled-components";

import Schedule from "./Schedule";
import UserContext from "../utils/UserContext";

import organizeEvents from "../utils/organization";

//TODO: DATE FORMAT CONVERSIONS OR LACK THEREOF when stringifying
//Messing with it seems to show that date details are preserved when going back and forth between stringifying and not
//NOTE! For Get and Update, cannot assume schedule is a personal schedule, need to check that. 

//TODO Fix erorr where events are in wrong format in guest

//TODO Find out why guest events are not getting placed

function ScheduleHolder({scheduleId}) {

//  console.log("schedule id", scheduleId);


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
   

    if(scheduleId === 0) {
      // setCalendar
      setCalendar({id: 0, schedule_name: "", personal_schedule: 1});

  
      //!! Temp test
      // localStorage.removeItem("guestEvents");

      // Temp, put this somewhere else conditional on it being undefined.
      // localStorage.setItem("guestEvents", JSON.stringify([]));

      //!!! Temp changed for seed data testing
      triggerLoadReorder(true);


      //Real version
      // if (response.data.personal_schedule) {
      //   triggerLoadReorder(true);
      // } else {
      //   getEvents(true);
      // }
      
    } else {
    axios.get(url + "/schedules/"  + scheduleId)
    .then((response) => {
      // console.log(response.data);
      setCalendar(response.data);
  
    
      console.log("getCalendar", response.data);
      //!!! Temp changed for seed data testing
      triggerLoadReorder(response.data.personal_schedule);


      //Real version
      // if (response.data.personal_schedule) {
      //   triggerLoadReorder(response.data.personal_schedule);
      // } else {
      //   getEvents(response.data.personal_schedule);
      // }
    })
    .catch((err) => {
      console.log("Error retrieving calendar", err);
    })}
  }

 



const getEvents = (personalSchedule) => {
  
  console.log(personalSchedule);

  //TODO, figure out why userData.curr... doesn't use props
  //It feels like that might be more accurate, or maybe not. Two differnet values that are sometimes the same
  if(userData.currentUser.scheduleId === 0 && personalSchedule) {
    console.log("Guest getEvents");
    setEventsList(convertToDate(JSON.parse(localStorage.guestEvents)));

  } else {
    console.log("Axios getEvents");
    axios.get(url + "/schedules/" + scheduleId + "/events")
    .then((response) => {

      setEventsList(convertToDate(response.data));

    })
    .catch(error => console.error(`Error: ${error}`))

  }

  
}

 const getWithoutUpdate = async (personalSchedule) => {

   let results;
   console.log("Get without update");
  console.log("GWO ps", personalSchedule);

    if(userData.currentUser.scheduleId === 0 && personalSchedule) {
      
      results = JSON.parse(localStorage.guestEvents);
      console.log("GWO Guest", results);
    } else {
      console.log("Axios called");
      await axios.get(url + "/schedules/" + scheduleId + "/events")
      .then((response) => {

        results = response.data;
        // console.log("GWO Axios", results);
      })
      .catch(error => console.error(`Error: ${error}`))

    }

    return results;
 }

//TODO: Remove guest user version. Guest users should not call this. 
 //TODO: ALTER FOR GUEST USER
 //This creates a promise to update the event, and does not actually update it directly. 
 //TODO: See if there is a problem with this being called before schedule is set
 const updateEvent = (event) => {
   let id = event.id;
  //  console.log("Update event", event);

   if(userData.currentUser.scheduleId === 0 && calendar.personal_schedule) {
   console.log("Guest user in updateEvent");
   //Note for self: This failed to work because it needed to update the "backend" or localStorage
    //TODO: Check if this works fine
    //TODO: I Probably need to update local storage
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
 
  console.log("Add event");
  //TODO: Add Guest data to local storage. 
  let personalScheduleId = userData.currentUser.scheduleId;
  // console.log(userData);

  let formEvent = {
    id: event.id,
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

  console.log("Added form event", formEvent);
  if(personalScheduleId === 0) {
   console.log("Guest add");

   //TODO: Problem here is obvious in hindsight
   //It is using the 'eventList' from the calendar DOING the adding. Therefore, it is adding the entire contents of calendar, formatted improperly
    // let allEvents2 = [...eventsList, formEvent];
    let allEvents = JSON.parse(localStorage.guestEvents);
    //TODO Check if this being a shallow copy is a problem
    localStorage.setItem("guestEvents", JSON.stringify([...allEvents, formEvent]));
    console.log("Set");
    console.log("In add, local storage", localStorage.guestEvents);
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


  async function triggerLoadReorder(personalSchedule) {
    console.log("TLR", personalSchedule);
    
   let allEvents = await getWithoutUpdate(personalSchedule);
   console.log("TLR allEvents", allEvents);
   let formEvents = convertToDate(allEvents);
   console.log("TLR formEvents", formEvents);
   let organized = reorganizeAll(formEvents);
   console.log("TLR organized events", organized);

   //I think problem is here. For guests, events are getting organized, but not updated in local storage
   //It's probably simpler to not try and make it async because that causes weirdness, and instead just to have a different path here for guesets

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

 
  //TODO: Add new delete path for guest
  async function triggerDeleteReorder(deletedEvent) {
   console.log("Trigger delete reorder");
  
    if(scheduleId === 0)  {
      console.log("TDR if");
      console.log("GUest trigger DR");
      let remainingEvents = JSON.parse(localStorage.guestEvents);
      console.log("TDR RemainingEvents", remainingEvents);
      let formRemainingEvents = convertToDate(remainingEvents);

      let remainingOnDay = getEventsOnDay(formRemainingEvents, deletedEvent.start_time);

      let dayNum = dateDiff(settings.startDate, deletedEvent.start_time);
      let organized = organizeEvents(remainingOnDay, dayNum);

      console.log("TDR organized", organized);

      for(var fEvent in formRemainingEvents) {
        for(var oEvent in organized) {
          if(fEvent.id === oEvent.id) {
            fEvent = oEvent;
          }
        }
      }

      localStorage.setItem("guestEvents", JSON.stringify(formRemainingEvents));
      console.log("remaining events", formRemainingEvents);
      getEvents(calendar.personal_schedule);

    } else {
    //TODO, add input
    console.log("TDR else");
      let remainingEvents =  await getWithoutUpdate(calendar.personal_schedule);
      let formRemainingEvents = convertToDate(remainingEvents);
      
      let remainingOnDay = getEventsOnDay(formRemainingEvents, deletedEvent.start_time);
      let dayNum = dateDiff(settings.startDate, deletedEvent.start_time);
      
      let organized = organizeEvents(remainingOnDay, dayNum);

      let promises = organized.map(async event => {
        return await updateEvent(event);
      })

      console.log("In delete", calendar);

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