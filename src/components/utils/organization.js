
let colOffset = 2;



//Note: This assumes all events will be on same day
function organizeEvents(rawEvents, dayNum) {

  
    if(rawEvents.length === 0) {
        return [];
      }

    //This removes the previous placement of events
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
            //Assuming empty columns are possible
           
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


            //Attempt
            //This attempt means the more elegant parts of this algorithm only work if events < 4, such as the parts to fill empty space
            //Can this be fixed?
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
                console.log("num columns", numColumns);
                console.log("ERROR: No more than 12 overlapping events");
            }



        }
    }; 
}



function expandEvent(event, iColumn, columns) {
    let colSpan = 1;



    //Iterates through each column
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

//Find why this isn't working, and never returns true
//I think maybe it also needs to check for time intersection?
function checkPhysicalInt(event1, event2) {


    // if(event1.id === 1073) {
    //     console.log("--------")
    //     console.log("Event1", event1.event_name);
    //     console.log("Event2", event2.event_name);
    // }
    if(event1.span === 0 || event2.span === 0) {
        console.log("Error! Undefined physical placement when checking intersection");
    }

    if(checkTimeInt(event1, event2) === false) {
        // if(event1.id === 1073) console.log("Time false")
        // console.log("Time false");
        return false;
    } else {

                //Subtracted by 0.1 so shared boundaries don't count as intersection.
                //Removed .01 subtraction to test
                let end_col1 = event1.start_col + event1.span;
                let end_col2 = event2.start_col + event2.span;
        
                let maxStart = max(event1.start_col, event2.start_col);
                let minEnd = min(end_col1, end_col2);
                // if(event1.id === 1073) console.log("maxStart", maxStart);
                // if(event1.id === 1073) console.log("minEnd", minEnd);

                // if(event1.id === 1073) {
                //     console.log("Event 1 start_col",event1.start_col );
                //     console.log("Event 1 end col", end_col1);
                //     console.log("Event 2 start_col",event2.start_col );
                //     console.log("Event 2 end col", end_col2);
                // }
        
                if(maxStart <= minEnd) {
                    // console.log("True");
                    // if(event1.id === 1073) console.log("True")
                    return true;
                } else {
                    // if(event1.id === 1073) console.log("False")
                    // console.log("False");
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