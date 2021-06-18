import {useState, useEffect, useContext} from "react";
import axios from 'axios';
import styled from "styled-components";

import Schedule from "./Schedule";
import UserContext from "../utils/UserContext";

import organizeEvents2 from "../utils/organization";


function ScheduleHolder({scheduleId}) {




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
  
  axios.get(url + "/schedules/" + scheduleId + "/events")
  .then((response) => {

    setEventsList(convertToDate(response.data));

  })
  .catch(error => console.error(`Error: ${error}`))
}

 const getWithoutUpdate = async () => {

   let results;

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

   axios.delete(url + "/events/" + id)
   .then((response) => {
    triggerDeleteReorder(event);
   })
   .catch(error => console.error(`Error: ${error}`))
 }


 const  addEvent = (event) => {
 

  let personalScheduleId = userData.schedule_id;



  if(personalScheduleId === 0) {
    console.log("Error: Can't add event to guest schedule.");
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
    .then((res) => {})
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
  
      //ToDo: This is where the change is
      // let organizedSubset = organizeEvents(eventSubset);

      let organizedSubset = organizeEvents2(eventSubset, i);

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

    
    let organized = organizeEvents(remainingOnDay);

    let dayNum = dateDiff(settings.startDate, deletedEvent.start_time);

    
    let organized2 = organizeEvents2(remainingOnDay, dayNum);

    let promises = organized2.map(async event => {
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

  //Note, assumes all events are on a single day
  function organizeEvents(rawEvents) {
   
   

    
    if(rawEvents.length === 0) {
      return [];
    }


   
    let dayNum = dateDiff(settings.startDate, rawEvents[0].start_time);

    let colOffset = 2;
    
    let baseColumn = dayNum * 12 + colOffset;

    let cleanEvents = [];
    rawEvents.forEach(event => {
        let newEvent = {...event, start_col: 0, span: 0};
        cleanEvents.push(newEvent);

    });

    let addedEvents = [];

    for(let i = 0; i < cleanEvents.length; i++) {
       
        let intIndex = [];
        for(let j = 0; j < addedEvents.length; j++) {
            if(checkTimeInt(cleanEvents[i], addedEvents[j])) {
                intIndex.push(j);
            }
        }
     
       
        
        //Length of intIndex is the number of intersections
        if(intIndex.length === 0) {
            cleanEvents[i].span = 12;
            cleanEvents[i].start_col = baseColumn;
            addedEvents.push(cleanEvents[i]);
        } else {
            let defaultSpan;
            if(intIndex.length < 4) {
              defaultSpan = 12/(intIndex.length +1);
            } else if (intIndex.length < 6) {
              defaultSpan = 2;
            } else if (intIndex.length < 12) {
              defaultSpan = 1;
            } else {
              defaultSpan = 0;
              console.log("Error: No more than twelve events can intersect.");
            }
            

             //Add new event to addedEvents, and add it's index to the list of intersections
             //Once the current event is added, it is now one of the intersecting events
             addedEvents.push(cleanEvents[i]);
             intIndex.push(addedEvents.length-1)

  
             let slots = new Array(intIndex.length).fill(0);
           
             for(let j = 0; j < intIndex.length ; j++) {

               
                let addedIndex = intIndex[j];
                //Current intersecting event that is being placed
                let intEvent = addedEvents[addedIndex];


                //Makes the span smaller, but not larger
                if(!(intEvent.span > 0 && intEvent.span < defaultSpan)) {
                    intEvent.span = defaultSpan;
                }


              for(let x = 0; x < slots.length; x++) {
                  if(slots[x] === 0) {
                      
                      let blocked = false;

                      let origCol = intEvent.start_col;
                      intEvent.start_col = baseColumn + x * defaultSpan;
                  
                      for(let y = 0; y < addedIndex; y++) {
                        if(checkPhysicalInt(addedEvents[y], intEvent)) {
                           blocked = true;
                        }
                    }
                    
                    if (!blocked) {
                        //Set slot to full
                        slots[x] = 1;

                        break;
                        
                    } else if (x === slots.length -1) {
                        console.log("Error, found no open slot for", intEvent.id);
                     
                        intEvent.start_col = origCol;
                    } else {
                        intEvent.start_col = origCol;
                    }

                  }
              }
            }
         
        }
    }
    return addedEvents;
  }




  //This checks for an intersection in grid placement. 
  function checkPhysicalInt(event1, event2) {
    let logThis = false;
    if(event1.id === 234 || event1.id === 235 || event1.id === 236 || event2.id === 234 || event2.id === 235 || event2.id === 236) {
      logThis = false;
      // console.log("_____")
      // console.log("Check physical intersection for: ", event1.id, event2.id);
    }
    //Error check
    if(event1.start_col === 0 || event2.start_col === 0 || event1.span === 0 || event2.span === 0) {
        console.log("Error! Undefined physical placement");
    }

    if(checkTimeInt(event1, event2) === false) {
        if (logThis) console.log("Time intersection false");
        return false;
    } else {
        //Subtracted by 0.1 so shared boundaries don't count as intersection.
        let end_col1 = event1.start_col + event1.span - 0.1;
        let end_col2 = event2.start_col + event2.span - 0.1;

        let maxStart = max(event1.start_col, event2.start_col);
        let minEnd = min(end_col1, end_col2);

        if(maxStart <= minEnd) {
          if (logThis) console.log("Returns true");
            return true;
        } else {
          if (logThis) console.log("Returns false");
            return false;
        }
    }
  }

  //This checks for an intersection in time, aka vertical overlap
  function checkTimeInt(event1, event2) {
      let maxStart = max(event1.start_time, event2.start_time);

     let end1Copy = new Date(event1.end_time);
     let end2Copy = new Date(event2.end_time);
      //Bumping back by one minute in calculations, to prevent intersections when things start and end in same hour
      //Converted to new Date for readability when logging
      let altEnd1 = new Date(end1Copy.setMinutes(end1Copy.getMinutes() -1));
      let altEnd2 = new Date(end2Copy.setMinutes(end2Copy.getMinutes() -1));

      let minEnd = min(altEnd1, altEnd2);

      

      if(maxStart <= minEnd) {
          return true;
      } else {
          return false;
      }
  }

  function max(value1, value2) {
    if(value1 > value2) {
        return value1;
    } else {
        return value2;
    }
  }

  function min(value1, value2) {
    if(value1 < value2) {
        return value1;
    } else {
        return value2;
    }
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