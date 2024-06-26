require("dotenv").config({
	path: "./.env"
});
const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require("./routes/user");
const passport = require("passport");
const passportSetup = require("./routes/auth");
const { JWT_SECRET } = require("./config");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: JWT_SECRET, // Use a secure secret key
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({
	origin: `${process.env.CLIENT_URL}`,
	methods: ["POST", "GET"],
	credentials: true
}));

app.use("/auth", userRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
	  console.log(`server is running at ${PORT}`)
);