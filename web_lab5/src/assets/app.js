const express = require("express");
const app = express();
const router = require("./router");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const corsOptions = {
  'credentials': true,
  'origin': true,
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'allowedHeaders': 'Authorization,X-Requested-With,X-HTTPMethod-Override,Content-Type,Cache-Control,Accept',
}
app.use(cors(corsOptions))

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use("/", router);
app.listen(3000);
