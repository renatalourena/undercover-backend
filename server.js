/*
 * Manage Session in Node.js and ExpressJS
 * Author : Shahid Shaikh
 * Version : 0.0.2
*/
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const router = express.Router();
const app = express();
const mysql = require('mysql');
const cors = require('cors')

app.use(cors())

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

router.get('/',(req,res) => {
    let sess = req.session;
    if(sess.email) {
        return res.redirect('/admin');
    }
    res.sendFile('index.html');
});

router.post('/login',(req,res) => {
    req.session.email = req.body.email;
    res.end('done');
});

router.get('/admin',(req,res) => {
    if(req.session.email) {
        res.write(`<h1>Hello ${req.session.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
    }
});

router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});


router.get('/players', (req, res) =>{
    execSQLQuery('SELECT * FROM users', res);
})

router.post('/players', (req, res) =>{
  console.log("post players: ", JSON.stringify(req.body))
  // execSQLQuery('SELECT * FROM players', res);
})

app.use('/', router);

app.listen(process.env.PORT || 3030,() => {
    console.log(`App Started on PORT ${process.env.PORT || 3030}`);
});


function execSQLQuery(sqlQry, res){
  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'undercover',
    password : 'bar',
    database : 'undercover'
  });
 
  connection.query(sqlQry, function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      connection.end();
      console.log('executou!');
  });
}