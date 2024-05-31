var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let authRouter = require('./routes/auth');
let moviesRouter=require('./routes/Movies')
let watchListRouter=require('./routes/watchList')
const mongoose=require('mongoose')
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(process.env.DB_URL).then(()=>{
    console.log('vary good')
}).catch((e)=>{
    console.log('oops')
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth',authRouter)
app.use('/api/movies',moviesRouter)
app.use('/api/watchlist',watchListRouter)
console.log(process.env.PORT)
app.listen(process.env.PORT)
module.exports = app;
