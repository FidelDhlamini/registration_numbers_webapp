const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const RegNumber = require('./regNumber')
const flash = require('express-flash');
const session = require('express-session');



const pg = require("pg");
const Pool = pg.Pool;

// we are using a special test database for the tests
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

// initialise the flash middleware
app.use(flash());

app.use(express.static('public'))


// app.engine('handlebars', exphbs({
//     defaultLayout: 'main'
// }));
// app.set('view engine', 'handlebars');

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



app.post('/greetUser', async function (req, res) {
    let regTyped = req.body.reg;
    let fromWhichTwn = req.body.townName;

        registration.storePlate(regTyped);

   
    // if (regTyped.startsWith("CA")||regTyped.startsWith("CJ")||regTyped.startsWith("CJ")) {
    //     registration.
    
    // } 

    res.redirect('/');
});


app.get('/', async function (req, res) {
    
    res.render("index", {
        regNumbers: await registration.showAllRegNumbers(),
        message: await registration.getMessage()

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