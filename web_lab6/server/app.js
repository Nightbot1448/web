const express = require('express');
const createError = require('http-errors');
const cors = require('cors');

const app = express();

const corsOptions = {
    'credentials': true,
    'origin': true,
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'allowedHeaders': 'Authorization,X-Requested-With,X-HTTP-Method-Override, Content-Type, Cache-Control, Accept',
};

app.use(cors(corsOptions));

const usersRouter = require('./router');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);
//app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
// render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;