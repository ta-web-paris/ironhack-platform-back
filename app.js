require('dotenv').config();

const bodyParser   = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
const express      = require( 'express' );
const favicon      = require( 'serve-favicon' );
const hbs          = require( 'hbs' );
const mongoose     = require( 'mongoose' );
const session      = require( "express-session" );
const passport     = require( "passport" );
const MongoStore   = require( 'connect-mongo' )( session );
const logger       = require( 'morgan' );
const path         = require( 'path' );
const cors         = require( "cors" );
const flash        = require( "connect-flash" );



mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/project-platform', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });


const passportSetup = require('./passport/index');
passportSetup(passport);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use((req, res, next) => {
  res.sendfile(__dirname + '/public/index.html');
});



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Might be important to be before session (?)
// WE NEED THIS TO BE ABLE TO LOG IN FROM THE FRONTEND
app.use( cors({
  credentials: true,
  origin: [ "http://localhost:4200" ]
}) );


// Enable authentication using session + passport
app.use(session({
  secret: 'yeahman',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}))
require('./passport')(app);


const index = require('./routes/index');
app.use('/', index);

const adminRouter = require('./routes/admin-routes');
app.use('/admin', adminRouter);


module.exports = app;
