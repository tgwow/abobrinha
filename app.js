var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var logger = require('morgan');
var formidable = require('formidable');
var readChunk = require('read-chunk');
var fileType = require('file-type');
var fs = require('fs');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');

var app = express();
const photo = []

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//console log status of request
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'))
app.use(session({
  secret: 'ACORDE SEUS SONHOS MAIS CEDO',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/', usersRouter);
app.use('/posts', postsRouter);

app.get('/login', (req, res) => {
  res.render('login.pug');
})


app.get('/upload', function(req, res) {
  if(req.session.user){
      res.render('upload.pug');
  }else {
      res.render('index.pug');
  }
});

app.post('/upload', (req,res) => {
  var form = new formidable.IncomingForm()

  form.multiples = true
  form.uploadDir = path.join(__dirname, 'tmp')

  form.on('file', (name, file) => {
    /*if (photo.length >0){
      if (fs.existsSync(file.path)) {
        fs.unlink(file.path, (err)=>{
          if (err) throw err;
          console.log('deleted!'+file.path)
          return true
        })
      }
    }*/
    var buffer = null, type = null, filename = ''

    buffer = readChunk.sync(file.path, 0, 262)
    type = fileType(buffer)

    if (type !== null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'jpeg')){
      filename = Date.now() + '-' + file.name ;

      fs.rename(file.path, path.join(__dirname, 'uploads/'+filename), (err) => {
        if (err) throw err;
        console.log('renamed!');
      })
      photo.push({
        status: true,
        filename: filename,
        type: type.ext,
        publicPath: 'uploads/'+filename
      })
    }else {
      photo.push({
        status: false,
        filename: file.name,
        message: 'Invalid file type'
      })
      fs.unlink(file.path);
    }
  })

  form.on('error', (err)=> {
    console.log('error during procc - ' + err);
  })
  form.on('end', ()=>{
    console.log('All the request fields have been proccess')
  })

  form.parse(req, (err, fields, files) => {
    res.status(200).json(photo);
  })
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
