var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var logger = require('morgan');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var multer = require('multer')
var upload = multer({ dest: 'public/uploads' })
const images = [];

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//Sapp.set('view engine', 'pug');

//console log status of request
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'ACORDE SEUS SONHOS MAIS CEDO',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);
app.use('/posts', postsRouter);

app.get('/upload', (req, res) => {
  console.log(images);
  if(req.session.user){
    res.render('upload.pug', {image: images});
  }
  else {
    res.render('index.pug',{logado: false});
  }
})

app.post('/upload', upload.single('image'), (req, res) => {
  images.push(req.file.filename)
  res.redirect('/upload');
})

app.get('/login', (req, res) => {
  res.render('login.pug');
})

app.get('/logout',(req, res)=>{
	req.session.cookie.maxAge = 0;
	res.redirect('/');
})

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
