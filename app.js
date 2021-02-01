const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const North = require('./models/north')
const intervals = require('./helpers/intervals.js');
const relationObj = require('./helpers/relationObj.js');



mongoose.connect('mongodb://localhost:27017/Appointments', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/north',async (req,res)=>{
    const offices = await North.find({})
    res.render ('north', { offices, intervals })
})

app.post('/north', async (req, res) => {
    const office = await North.find({})
    var day = req.body.appointment[0];
    var start = req.body.appointment[1]
    var end= req.body.appointment[2];

    try{
    console.log(checkAvailable(office,day,start,end))
    } catch (err) {
    console.log(err);
  }
    res.redirect('/north')
})

app.get('/makeoffice', async (req,res)=>{
    const north = new Office({Monday:{1:false,2:true}})
    await north.save();
    res.send(north)
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})

//covnerts time string to time float (example: "3:15" -> 15.25, "8:30" -> 8.5) permitting iteration, compare and 24hr representation to avoid conflict.
function timeStringToFloat(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return (hours + minutes / 60);
  }

//looks if range selected for appointment is available for booking
function checkAvailable(office,day,startTime, endTime){
    startTime = (timeStringToFloat(startTime))
    endTime = (timeStringToFloat(endTime))

    if(startTime >= endTime){
        return "Invalid time range, appointment start time must be before end time"
    }
    
    //startTime = parseFloat(startTime)
    //endTime = parseFloat(endTime)

    //if start time is 8:00 this does not need to increment. Determines which index of range to start comparing to
    if(relationObj[startIndex]==startTime){
        var startIndex = 1;
    }
    else{
    var startIndex = 1;
    while (relationObj[startIndex]!=startTime){
    startIndex+=1
    }
   
     //from start time to end time checking availability every 15 minute interval
    for (let i = startTime; i<=endTime; i+= .25){
        //if the interval on that day is available(true) then check if next interval is available for all intervals in selected range
        if(office[0][day][startIndex]){
            startIndex++
        }
        else{
            return"time selected is unavailable" 
        }
        if(i == endTime){
            
            return "the time is available"
        }
        
    }

}
}

function updateCollection(collection,key, startTime, endTime){
    collection.findOneAndUpdate({key: true})
}