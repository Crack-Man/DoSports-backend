const express = require("express");
const session = require("express-session");
const cors = require("cors");
const router = require("./routes/routes.js");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const passport = require("passport");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
app.use(cors());

app.use(cookieParser());

app.use(
    session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());
 
app.use(router);
 
const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));