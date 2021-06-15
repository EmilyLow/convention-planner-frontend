
let colOffset = 2;

//TODO: Figure out where in the algorithm "placement" occurs
//TODO: Draw out algorithm on paper

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

            //ToDo: Define physical place so it can be checked

            if(last !== undefined && !checkPhysicalInt(last, currentEvent)) {
                //Alter currentEvent to have matching physical position
                columns[i].push(currentEvent);
                eventPlaced = true;

                break;
            }
        }

        if(!eventPlaced) {
            
            //TODO: Alter currentEvent to have matching physical position
            columns.push([currentEvent]);
        }

        if(lastEventEnd === null || new Date(currentEvent.end_time) > lastEventEnd ) {
            lastEventEnd = new Date(currentEvent.end_time);
        }
       
        if (columns.length > 0) {

            packEvents(columns, dayNum);

        }


    }

    let organizedEvents = [];

    //Places events in column inside new array
    //This may not be necessary. Depends on if I alter them in place or not. (Better to not?)
    for (let i = 0; i < columns.length; i++) {
        for(let j = 0; j < columns[i].length; j++) {

            organizedEvents.push(columns[i][j]);

        }

    }
    return organizedEvents;

}

function packEvents(columns, dayNum) {

    let colCount = columns.length;


    //Iterates through each column
    for (let i = 0; i < colCount; i++) {
        //Iterates through each event in the column
        // console.log("columns[i]", columns[i].length);
        for(let j = 0; j < columns[i].length; j++) {

            //ToDo: Unsure of this
            //Remember! Example ends up with percentages
            // let startPos = i + (12/colCount) + baseColumn;

            // let copyEvent = {...columns[i][j], start_col: startPos};
            // console.log("CopyEvent", copyEvent);


            //TODO: An event should have a defined position by the time it reaches here. Check this. 
            //But position should be preliminary
            //Now, set actual positions based off number of columns
            //Then, use colSpan to set expanded positions based off that

            let colSpan = expandEvent(columns[i][j], i, columns);
            

            //Update actual positions 


        }
    }; 
}

function expandEvent(event, iColumn, columns) {
    let colSpan = 1;

    //Increase span of event to match colSpan as it goes.
    //It should be expanding to the right I believe?

   
    //Iterates through each column
    for (let i = iColumn + 1; i < columns.length; i++) {
        //Iterates through each event in the column
        for(let j = 0; j < columns[i].length; i++) {

          
            let comEvent = columns[i][j];


            if(checkPhysicalInt(event, comEvent)) {
                return colSpan;
            }
        }
    
        colSpan++;
        //Change event to update to new span (Here I think???)
        //Or should I make a test event to compare to?
        // event.span = colSpan;
    }

    if(colSpan >= 12) {
        console.log("Error: No more than twelve intersecting events");
        //Throw actual error here
    }
    // console.log(colSpan);
    return colSpan;

}


function checkPhysicalInt(event1, event2) {

    //Error check
    if(event1.start_col === 0 || event2.start_col === 0 || event1.span === 0 || event2.span === 0) {
        console.log("Error! Undefined physical placement when checking intersection");
    }


        //Subtracted by 0.1 so shared boundaries don't count as intersection.
        let end_col1 = event1.start_col + event1.span - 0.1;
        let end_col2 = event2.start_col + event2.span - 0.1;

        let maxStart = max(event1.start_col, event2.start_col);
        let minEnd = min(end_col1, end_col2);

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

export default organizeEvents;