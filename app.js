const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Office = require('./models/office')
const intervals = require('./helpers/intervals.js');
const relationObj = require('./helpers/relationObj.js')


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

app.get('/office',async (req,res)=>{
    const offices = await Office.find({})
    res.render ('office', { offices, intervals })
})

app.post('/office', async (req, res) => {
    const office = req.body
    const day = req.body.appointment[0];
    const startTime = req.body.appointment[1]
    const endTime = req.body.appointment[2];
    console.log(office)
    res.send(office)
})

app.get('/makeoffice', async (req,res)=>{
    const north = new Office({Monday:{1:false,2:true}})
    await north.save();
    res.send(north)
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})