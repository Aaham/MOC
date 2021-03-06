const intervals = require('./helpers/intervals.js');
const relationObj = require('./helpers/relationObj.js')

function timeStringToFloat(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return (hours + minutes / 60);
  }
function checkAvailable(office,day,startTime, endTime){
    let startTime = (timeStringToFloat(startTime)).toFixed(2)
    let endTime = (timeStringToFloat(endTime)).toFixed(2)
    startTime = parseFloat(startTime)
    endTime = parseFloat(endTime)

    //if start time is 8:00 this does not need to increment. Determines what range of intervals to look over
    let startIndex = 1;
    while (relationObj[startIndex]!=startTime){
    startIndex+=1
    
    //from start time to end time checking availability every 15 minute interval
    for (let i = startTime; i<=endTime; ((i+= .25).toFixed(2)) ){
        //if the interval on that day is available(true) starting from selected start time
        if(office.day[startIndex]){
            startIndex++
        }
        else{
            console.log("time selected is unavailable")
            break;
            
        }
        if(i == endTime){
            console.log("the time is available")
        }
        
    }

}
}

function setAppointment(office,day,startTime, endTime){
    
}