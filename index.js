const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const RegNumber = require('./regNumber')
const flash = require('express-flash');
const session = require('express-session');



const pg = require("pg");
const Pool = pg.Pool;

 const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/testdb';

const pool = new Pool({
    connectionString
});


const app = express();

const registration = RegNumber(pool);

app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));


app.use(flash());

app.use(express.static('public'))


const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});


app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())



app.post('/addReg', async function (req, res) {
    let regTyped = req.body.registration;

        registration.storePlate(regTyped);

    res.render("index", {
        regNumbers: registration.showAllRegNumbers(),
        message: registration.getMessage()
       

    })

});


app.get('/', async function (req, res) {
    
    res.render("index", {
        regNumbers: registration.showAllRegNumbers(),
        message: registration.getMessage()

    })
   
});

app.post('/filter', async function (req, res) {

    let townSelected = req.body.townSlct
    let filteredPlates = registration.filterRegNum(townSelected)
    console.log(filteredPlates)
    res.render("index", {
        filteredReg : filteredPlates

    })

});


// app.get('/action', async function (req, res) {
//     res.render('actions', {
//         actions: await greeting.finalTable()
//     })

// })



const PORT = process.env.PORT || 7007;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
})