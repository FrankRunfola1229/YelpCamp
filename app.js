var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
 
mongoose.connect("mongodb+srv://devsprout:Ready4go!@cluster0-lakvf.mongodb.net/test?retryWrites=true", {
	useNewUrlParser:true,
	useCreateIndex: true
	
	}).then(() => {
		console.log("Connected to DB!");
	
	}).catch(err => {
		console.log("ERROR: ", err.message);
});

//var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v10";
//var url =  "mongodb+srv://devsprout:Ready4go!@cluster0-lakvf.mongodb.net/test?retryWrites=true";
//mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
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
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.get("/", (req,res) => {
	res.send("Hello, World!");
});

app.listen(3000, function(){
   console.log("..Server listening on port 3000");
});

/**
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
***/