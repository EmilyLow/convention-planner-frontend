
let colOffset = 2;



/*
    Note: This function organizes events on a single day, and assumes inputs are on same day.
*/
function organizeEvents(rawEvents, dayNum) {

  
    if(rawEvents.length === 0) {
        return [];
      }

  //This removes the events previous placement
    let cleanEvents = [];
    rawEvents.forEach(event => {
        let newEvent = {...event, start_col: 0, span: 0};
        cleanEvents.push(newEvent);
        
    });

    let columns = [];

    let lastEventEnd = null;


    //Sorts events, by start time and then by end time
    let sortedEvents = cleanEvents.sort((event1, event2) => {
        return new Date(event1.start_time) - new Date (event2.start_time) || new Date(event1.end_time) - new Date(event2.end_time)
    });

    

    for(let i = 0; i < sortedEvents.length; i++) {

        let currentEvent = sortedEvents[i];

        //Checks to see if current event overlaps with previous group of intersecting events.
        //If not, it finalizes positions of previous group and starts new group.
        if(lastEventEnd !== null && new Date (currentEvent.start_time) > lastEventEnd) {
            
            //Finalizes the positions of the previous group
            packEvents(columns, dayNum);

            //Clears columns for next event set
            columns = [];
            lastEventEnd = null;
           
        }

     
        let eventPlaced = false;


        
        for (let i = 0; i < columns.length; i++) {
           
            let last = columns[i][columns[i].length - 1];


            if(last !== undefined && !checkTimeInt(last, currentEvent)) {
               
       
                currentEvent.span = 1;
                currentEvent.start_col = i;

                columns[i].push(currentEvent);
                eventPlaced = true;


                break;
            }
        }

        if(!eventPlaced) {
            
        
            currentEvent.span = 1;
         
 
            currentEvent.start_col = columns.length;
          
            columns.push([currentEvent]);
        }

        if(lastEventEnd === null || new Date(currentEvent.end_time) > lastEventEnd ) {
            lastEventEnd = new Date(currentEvent.end_time);
        }


    }

    if (columns.length > 0) {

        packEvents(columns, dayNum);

    }

 
    return sortedEvents;

}

function packEvents(columns, dayNum) {
   
    let numColumns = columns.length;


    //Iterates through each column
    for (let i = 0; i < numColumns; i++) {
        //Iterates through each event in the column
        for(let j = 0; j < columns[i].length; j++) {

            let colAdjust = 2 + dayNum*12;
            let currentEvent = columns[i][j];
           
            if(numColumns <= 4) {
                
                 let colSpan = expandEvent(currentEvent, i, columns);
           
   
                currentEvent.start_col = (i/numColumns) * 12 + colAdjust;
                currentEvent.span = (colSpan/numColumns) * 12;
            }
            else if(numColumns > 4 && numColumns <= 6) {
                currentEvent.span = 2;
                currentEvent.start_col = 2 * i + colAdjust;
            } else if (numColumns > 6 && numColumns < 13) {
                currentEvent.span = 1;
                currentEvent.start_col = 1 * i + colAdjust;
            } else {
                console.log("ERROR: No more than 12 overlapping events");
            }



        }
    }; 
}



function expandEvent(event, iColumn, columns) {
    let colSpan = 1;




    for (let i = iColumn + 1; i < columns.length; i++) {
        for(let j = 0; j < columns[i].length; j++) {
          
            let comEvent = columns[i][j];

            if(checkPhysicalInt(event, comEvent)) {

                return colSpan;
            }

        }

        colSpan++;
        event.span = colSpan;

    }


    return colSpan;

}

function checkTimeInt(event1, event2) {
    let maxStart = max(event1.start_time, event2.start_time);

   let end1Copy = new Date(event1.end_time);
   let end2Copy = new Date(event2.end_time);

    //The calculations bump the end time back by one minute, to prevent a reported intersection when things start and end in same hour
    let altEnd1 = new Date(end1Copy.setMinutes(end1Copy.getMinutes() -1));
    let altEnd2 = new Date(end2Copy.setMinutes(end2Copy.getMinutes() -1));

    let minEnd = min(altEnd1, altEnd2);

    

    if(maxStart <= minEnd) {
        return true;
    } else {
        return false;
    }
}


function checkPhysicalInt(event1, event2) {


    if(event1.span === 0 || event2.span === 0) {
        console.log("Error! Undefined physical placement when checking intersection");
    }

    if(checkTimeInt(event1, event2) === false) {
        return false;
    } else {


                let end_col1 = event1.start_col + event1.span;
                let end_col2 = event2.start_col + event2.span;
        
                let maxStart = max(event1.start_col, event2.start_col);
                let minEnd = min(end_col1, end_col2);
        
                if(maxStart <= minEnd) {
                    return true;
                } else {
                    return false;
                }
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

export default organizeEvents;