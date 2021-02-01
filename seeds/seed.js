const mongoose = require('mongoose');
const North = require('../models/north')
const South =  require('../models/south')
const East = require('../models/east')
const West = require('../models/west')

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

const seedDB = async (day) => {
    for(let i = 1; i <= 32; i++){
        if (Math.random() < 0.5){
            day[i] = true;

        }
        else{
            day[i] = false;
        }    
    }
    
}

const seeddb = async () =>{
    await North.deleteMany({});
    await East.deleteMany({});
    await South.deleteMany({});
    await East.deleteMany({});
    
    const north = new North
    const east = new East
    const south = new South
    const west = new West
    
    seedDB(north.Monday)
    seedDB(north.Tuesday)
    seedDB(north.Wednesday)
    seedDB(north.Thursday)
    seedDB(north.Friday) 
    await north.save(); 
    
    seedDB(east.Monday)
    seedDB(east.Tuesday)
    seedDB(east.Wednesday)
    seedDB(east.Thursday)
    seedDB(east.Friday)  
    await east.save(); 

    seedDB(south.Monday)
    seedDB(south.Tuesday)
    seedDB(south.Wednesday)
    seedDB(south.Thursday)
    seedDB(south.Friday)  
    await south.save(); 

      
    seedDB(west.Monday)
    seedDB(west.Tuesday)
    seedDB(west.Wednesday)
    seedDB(west.Thursday)
    seedDB(west.Friday)  
    await west.save();  
}
seeddb().then(() => {
    mongoose.connection.close();
})