if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')
const North = require('./models/north')
const South = require('./models/south')
const East = require('./models/east')
const West = require('./models/west')
const intervals = require('./helpers/intervals.js');
const relationObj = require('./helpers/relationObj.js');
const dbUrl = process.env.DB_URL

//mongodb://localhost:27017/Appointments

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(session({ secret: 'secret' , resave: false, saveUninitialized:false}))
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/home',async (req,res)=>{
    res.render ('home')
})





app.get('/north',async (req,res)=>{
    const offices = await North.find({})
    res.render ('north', { offices, intervals, messages: req.flash('success')})
})

app.put('/north', async (req, res) => {
    const office = await North.find({})
    var day = req.body.appointment[0];
    var start = req.body.appointment[1]
    var end= req.body.appointment[2];
    console.log(req.body)
     if('create' in req.body){
    try{
    var message = (checkAvailableNorth(office,day,start,end))
    } catch (err) {
    console.log(err);
  }
    req.flash('success','Your ' + day + ' appointment from ' + start, " to " + end + " has been added successfuly")
    res.redirect('/north')
}
if('delete' in req.body){
     try{
     console.log(removeAppointmentNorth(office,day,start,end))
     } catch (err) {
     console.log(err);
   }
    req.flash('success','Your ' + day + ' appointment from ' + start, " to " + end + " has been terminated successfuly")
     res.redirect('/north')
 
}}
)



app.get('/south',async (req,res)=>{
    const offices = await South.find({})
    res.render ('south', { offices, intervals, messages: req.flash('success')})
})

app.put('/south', async (req, res) => {
    const office = await South.find({})
    var day = req.body.appointment[0];
    var start = req.body.appointment[1]
    var end= req.body.appointment[2];
    console.log(req.body)
     if('create' in req.body){
    try{
    var message = (checkAvailableSouth(office,day,start,end))
    } catch (err) {
    console.log(err);
  }
    req.flash('success','Your ' + day + ' appointment from ' + start, " to " + end + " has been added successfuly")
    res.redirect('/south')
}
if('delete' in req.body){
     try{
     console.log(removeAppointmentSouth(office,day,start,end))
     } catch (err) {
     console.log(err);
   }
    req.flash('success','Your ' + day + ' appointment from ' + start, " to " + end + " has been terminated successfuly")
     res.redirect('/south')
 
}}
)


app.get('/east',async (req,res)=>{
    const offices = await East.find({})
    res.render ('east', { offices, intervals, messages: req.flash('success')})
})

app.put('/east', async (req, res) => {
    const office = await East.find({})
    var day = req.body.appointment[0];
    var start = req.body.appointment[1]
    var end= req.body.appointment[2];
    console.log(req.body)
     if('create' in req.body){
    try{
    var message = (checkAvailableEast(office,day,start,end))
    } catch (err) {
    console.log(err);
  }
    req.flash('success','Your ' + day + ' appointment from ' + start, " to " + end + " has been added successfuly")
    res.redirect('/east')
}
if('delete' in req.body){
     try{
     console.log(removeAppointmentEast(office,day,start,end))
     } catch (err) {
     console.log(err);
   }
    req.flash('success','Your ' + day + ' appointment from ' + start, " to " + end + " has been terminated successfuly")
     res.redirect('/east')
 
}}
)



app.get('/west',async (req,res)=>{
    const offices = await West.find({})
    res.render ('west', { offices, intervals, messages: req.flash('success')})
})

app.put('/west', async (req, res) => {
    const office = await West.find({})
    var day = req.body.appointment[0];
    var start = req.body.appointment[1]
    var end= req.body.appointment[2];
    console.log(req.body)
     if('create' in req.body){
    try{
    var message = (checkAvailableWest(office,day,start,end))
    } catch (err) {
    console.log(err);
  }
    req.flash('success','Your ' + day + ' appointment from ' + start, " to " + end + " has been added successfuly")
    res.redirect('/west')
}
if('delete' in req.body){
     try{
     console.log(removeAppointmentWest(office,day,start,end))
     } catch (err) {
     console.log(err);
   }
    req.flash('success','Your ' + day + ' appointment from ' + start, " to " + end + " has been cancelled successfuly")
     res.redirect('/west')
 
}}
)




const port = process.env.PORT || 3000;
app.listen(port, () => {
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
function checkAvailableNorth(office,day,startTime, endTime){
    startTime = (timeStringToFloat(startTime))
    endTime = (timeStringToFloat(endTime))

    if(startTime >= endTime){
        return "Invalid time range, appointment start time must be before end time"
    }
    //if start time is 8:00 this does not need to increment. Determines which index of range to start comparing to
    var startIndex = 1;
    var startIndex2 = 1;
    if(office[0][day][startIndex]){
        if (relationObj[2]==endTime){
            updateCollectionNorth(North,startIndex,day)
            return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
        }
    }
    
    else{
        var startIndex = 1;
        var startIndex2 = 1;
    while (relationObj[startIndex]!=startTime){
        startIndex+=1
        startIndex2+=1
    }}
    
     //from start time to end time checking availability every 15 minute interval
    
        if(endTime-startTime==.25){
            if(office[0][day][startIndex]){
                updateCollectionNorth(North,startIndex,day)
                return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
            }
            else {
                return "time selected is unavailable2"
            }
        }
        else{
        for (let i = startTime; i<=endTime; i+= .25){
        if(!office[0][day][startIndex]){
            return"time selected is unavailable"
        }
        if(office[0][day][startIndex] && i!==endTime){
            startIndex++ 
        }
        if(i == endTime){
            for (let i = startTime; i<endTime; i+= .25){
                updateCollectionNorth(North,startIndex2,day)
                
                startIndex2++;
            }
            return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
        }   
   }}
}

function updateCollectionNorth(collection,key,day){
    var query = {}
    query[`${day}.${key}`]= false
    
            collection.findByIdAndUpdate("601864c31c7188612b564bf9", {$set: query}, function(err, doc) {
                doc.save();});
    
}


function removeAppointmentNorth(office,day,startTime, endTime){
    startTime = (timeStringToFloat(startTime))
    endTime = (timeStringToFloat(endTime))
    if(startTime >= endTime){
        return "Invalid time range, appointment start time must be before end time"
    }
    var startIndex = 1;
    var startIndex2 = 1;
    while (relationObj[startIndex]!=startTime){
        startIndex+=1
        startIndex2 += 1;
    }
    for (let i = startTime; i<endTime; i+= .25){
        removeNorth(North,startIndex2,day)
        startIndex2++;
}}

function removeNorth(collection,key,day){
    var query = {}
    query[`${day}.${key}`]= true
    
            collection.findByIdAndUpdate("601864c31c7188612b564bf9", {$set: query}, function(err, doc) {
                doc.save();});
    
}





function checkAvailableNorth(office,day,startTime, endTime){
    startTime = (timeStringToFloat(startTime))
    endTime = (timeStringToFloat(endTime))

    if(startTime >= endTime){
        return "Invalid time range, appointment start time must be before end time"
    }
    //if start time is 8:00 this does not need to increment. Determines which index of range to start comparing to
    var startIndex = 1;
    var startIndex2 = 1;
    if(office[0][day][startIndex]){
        if (relationObj[2]==endTime){
            updateCollectionNorth(North,startIndex,day)
            return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
        }
    }
    
    else{
        var startIndex = 1;
        var startIndex2 = 1;
    while (relationObj[startIndex]!=startTime){
        startIndex+=1
        startIndex2+=1
    }}
    
     //from start time to end time checking availability every 15 minute interval
    
        if(endTime-startTime==.25){
            if(office[0][day][startIndex]){
                updateCollectionNorth(North,startIndex,day)
                return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
            }
            else {
                return "time selected is unavailable2"
            }
        }
        else{
        for (let i = startTime; i<=endTime; i+= .25){
        if(!office[0][day][startIndex]){
            return"time selected is unavailable"
        }
        if(office[0][day][startIndex] && i!==endTime){
            startIndex++ 
        }
        if(i == endTime){
            for (let i = startTime; i<endTime; i+= .25){
                updateCollectionNorth(North,startIndex2,day)
                
                startIndex2++;
            }
            return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
        }   
   }}
}

//SOUTH


function checkAvailableSouth(office,day,startTime, endTime){
    startTime = (timeStringToFloat(startTime))
    endTime = (timeStringToFloat(endTime))

    if(startTime >= endTime){
        return "Invalid time range, appointment start time must be before end time"
    }
    //if start time is 8:00 this does not need to increment. Determines which index of range to start comparing to
    var startIndex = 1;
    var startIndex2 = 1;
    if(office[0][day][startIndex]){
        if (relationObj[2]==endTime){
            updateCollectionSouth(South,startIndex,day)
            return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
        }
    }
    
    else{
        var startIndex = 1;
        var startIndex2 = 1;
    while (relationObj[startIndex]!=startTime){
        startIndex+=1
        startIndex2+=1
    }}
    
     //from start time to end time checking availability every 15 minute interval
    
        if(endTime-startTime==.25){
            if(office[0][day][startIndex]){
                updateCollectionSouth(South,startIndex,day)
                return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
            }
            else {
                return "time selected is unavailable2"
            }
        }
        else{
        for (let i = startTime; i<=endTime; i+= .25){
        if(!office[0][day][startIndex]){
            return"time selected is unavailable"
        }
        if(office[0][day][startIndex] && i!==endTime){
            startIndex++ 
        }
        if(i == endTime){
            for (let i = startTime; i<endTime; i+= .25){
                updateCollectionSouth(South,startIndex2,day)
                
                startIndex2++;
            }
            return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
        }   
   }}
}

function updateCollectionSouth(collection,key,day){
    var query = {}
    query[`${day}.${key}`]= false
    
            collection.findByIdAndUpdate("601864c31c7188612b564bfb", {$set: query}, function(err, doc) {
                doc.save();});
    
}


function removeAppointmentSouth(office,day,startTime, endTime){
    startTime = (timeStringToFloat(startTime))
    endTime = (timeStringToFloat(endTime))
    if(startTime >= endTime){
        return "Invalid time range, appointment start time must be before end time"
    }
    var startIndex = 1;
    var startIndex2 = 1;
    while (relationObj[startIndex]!=startTime){
        startIndex+=1
        startIndex2 += 1;
    }
    for (let i = startTime; i<endTime; i+= .25){
        removeSouth(South,startIndex2,day)
        startIndex2++;
}}

function removeSouth(collection,key,day){
    var query = {}
    query[`${day}.${key}`]= true
    
            collection.findByIdAndUpdate("601864c31c7188612b564bfb", {$set: query}, function(err, doc) {
                doc.save();});
    
}



//EAST


function checkAvailableEast(office,day,startTime, endTime){
    startTime = (timeStringToFloat(startTime))
    endTime = (timeStringToFloat(endTime))

    if(startTime >= endTime){
        return "Invalid time range, appointment start time must be before end time"
    }
    //if start time is 8:00 this does not need to increment. Determines which index of range to start comparing to
    var startIndex = 1;
    var startIndex2 = 1;
    if(office[0][day][startIndex]){
        if (relationObj[2]==endTime){
            updateCollectionEast(East,startIndex,day)
            return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
        }
    }
    
    else{
        var startIndex = 1;
        var startIndex2 = 1;
    while (relationObj[startIndex]!=startTime){
        startIndex+=1
        startIndex2+=1
    }}
    
     //from start time to end time checking availability every 15 minute interval
    
        if(endTime-startTime==.25){
            if(office[0][day][startIndex]){
                updateCollectionEast(East,startIndex,day)
                return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
            }
            else {
                return "time selected is unavailable2"
            }
        }
        else{
        for (let i = startTime; i<=endTime; i+= .25){
        if(!office[0][day][startIndex]){
            return"time selected is unavailable"
        }
        if(office[0][day][startIndex] && i!==endTime){
            startIndex++ 
        }
        if(i == endTime){
            for (let i = startTime; i<endTime; i+= .25){
                updateCollectionEast(East,startIndex2,day)
                
                startIndex2++;
            }
            return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
        }   
   }}
}

function updateCollectionEast(collection,key,day){
    var query = {}
    query[`${day}.${key}`]= false
    
            collection.findByIdAndUpdate("601864c31c7188612b564bfa", {$set: query}, function(err, doc) {
                doc.save();});
    
}


function removeAppointmentEast(office,day,startTime, endTime){
    startTime = (timeStringToFloat(startTime))
    endTime = (timeStringToFloat(endTime))
    if(startTime >= endTime){
        return "Invalid time range, appointment start time must be before end time"
    }
    var startIndex = 1;
    var startIndex2 = 1;
    while (relationObj[startIndex]!=startTime){
        startIndex+=1
        startIndex2 += 1;
    }
    for (let i = startTime; i<endTime; i+= .25){
        removeEast(East,startIndex2,day)
        startIndex2++;
}}

function removeEast(collection,key,day){
    var query = {}
    query[`${day}.${key}`]= true
    
            collection.findByIdAndUpdate("601864c31c7188612b564bfa", {$set: query}, function(err, doc) {
                doc.save();});
    
}


//WEST


function checkAvailableWest(office,day,startTime, endTime){
    startTime = (timeStringToFloat(startTime))
    endTime = (timeStringToFloat(endTime))

    if(startTime >= endTime){
        return "Invalid time range, appointment start time must be before end time"
    }
    //if start time is 8:00 this does not need to increment. Determines which index of range to start comparing to
    var startIndex = 1;
    var startIndex2 = 1;
    if(office[0][day][startIndex]){
        if (relationObj[2]==endTime){
            updateCollectionWest(West,startIndex,day)
            return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
        }
    }
    
    else{
        var startIndex = 1;
        var startIndex2 = 1;
    while (relationObj[startIndex]!=startTime){
        startIndex+=1
        startIndex2+=1
    }}
    
     //from start time to end time checking availability every 15 minute interval
    
        if(endTime-startTime==.25){
            if(office[0][day][startIndex]){
                updateCollectionWest(West,startIndex,day)
                return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
            }
            else {
                return "time selected is unavailable2"
            }
        }
        else{
        for (let i = startTime; i<=endTime; i+= .25){
        if(!office[0][day][startIndex]){
            return"time selected is unavailable"
        }
        if(office[0][day][startIndex] && i!==endTime){
            startIndex++ 
        }
        if(i == endTime){
            for (let i = startTime; i<endTime; i+= .25){
                updateCollectionWest(West,startIndex2,day)
                
                startIndex2++;
            }
            return "your appointment on " + day +  " from " + startTime + " to" + endTime + " has been booked"
        }   
   }}
}

function updateCollectionWest(collection,key,day){
    var query = {}
    query[`${day}.${key}`]= false
    
            collection.findByIdAndUpdate("601864c31c7188612b564bfc", {$set: query}, function(err, doc) {
                doc.save();});
    
}


function removeAppointmentWest(office,day,startTime, endTime){
    startTime = (timeStringToFloat(startTime))
    endTime = (timeStringToFloat(endTime))
    if(startTime >= endTime){
        return "Invalid time range, appointment start time must be before end time"
    }
    var startIndex = 1;
    var startIndex2 = 1;
    while (relationObj[startIndex]!=startTime){
        startIndex+=1
        startIndex2 += 1;
    }
    for (let i = startTime; i<endTime; i+= .25){
        removeWest(West,startIndex2,day)
        startIndex2++;
}}

function removeWest(collection,key,day){
    var query = {}
    query[`${day}.${key}`]= true
    
            collection.findByIdAndUpdate("601864c31c7188612b564bfc", {$set: query}, function(err, doc) {
                doc.save();});
    
}

