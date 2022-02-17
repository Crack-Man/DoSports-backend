const express = require("express");
const cors = require("cors");
const router = require("./routes/routes.js");
const bodyParser = require('body-parser');
const helmet = require('helmet');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet());
 
app.use(express.json());
 
app.use(cors());
 
app.use(router);
 
const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
