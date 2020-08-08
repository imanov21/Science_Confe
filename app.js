var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
	flash		= require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Conf  = require("./models/conf"),
    Participant     = require("./models/participant"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requiring routes
var participantRoutes    = require("./routes/participants"),
    confRoutes = require("./routes/confs"),
    indexRoutes      = require("./routes/index")
   
mongoose.connect("mongodb+srv://devantony:topcodeR37@cluster0.e1xol.mongodb.net/sc_db?retryWrites=true&w=majority", { 
	useUnifiedTopology: true,                         
	useNewUrlParser: true,                            
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log("DB Connection Error: " + err.message);
});

// mongoose.connect("mongodb://localhost:27017/sf_db", { 
// 	useUnifiedTopology: true,                         
// 	useNewUrlParser: true,                            
// })
// .then(() => console.log('DB Connected!'))
// .catch(err => {
// console.log("DB Connection Error: " + err.message);
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //clear date from the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Science conference is very important!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error"),
   res.locals.success = req.flash("success"),
   next();
});

app.use("/", indexRoutes);
app.use("/confs", confRoutes);
app.use("/confs/:id/participants", participantRoutes);


app.listen(3000, function(){
	console.log('Server listening on port 3000');
});