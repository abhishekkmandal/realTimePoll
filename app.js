const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // for getting the data from the form
const cors = require('cors'); //for cross domain functionality
const mongoose = require('mongoose');
const app = express();

const ejsMate = require('ejs-mate');

//anything that have to do with pusher we will put them in seperate file
const poll = require('./routes/poll');
/*
//const dbUrl = process.env.DB_URL || 'mongodb+srv://abhishek123:abhishek123@cluster0.ctegg.mongodb.net/realtimepoll?retryWrites=true&w=majority';

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

//logic check for mongoose connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
*/
//const dbUrl = process.env.DB_URL || 'mongodb+srv://abhishek123:abhishek123@cluster0.ctegg.mongodb.net/realtimepoll?retryWrites=true&w=majority';

const dbUrl = 'mongodb://localhost:27017/poll';

mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

//logic check for mongoose connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//set public folder
app.use(express.static(path.join(__dirname, 'public')));  //curr_dir/public will be our static folder

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//enable cors
app.use(cors());

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//anything that will go with /poll url that will reflect in poll file

app.get('/', (req, res) => {
    res.redirect('/polls');
});

app.use('/poll', poll);

//if we hit some url we dont recognise
app.all('*', (req, res) => {
    res.send("Page Unavailable");
})


const port = process.env.PORT || 3000;

//start server
app.listen(port, () => console.log(`Server started on port ${port}`));

