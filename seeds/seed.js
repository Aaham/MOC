const mongoose = require('mongoose');
const Office = require('../models/office')

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
    await Office.deleteMany({});
    const North = new Office
    seedDB(North.Monday)
    seedDB(North.Tuesday)
    seedDB(North.Wednesday)
    seedDB(North.Thursday)
    seedDB(North.Friday)  
    await North.save();  
}


seeddb().then(() => {
    mongoose.connection.close();
})