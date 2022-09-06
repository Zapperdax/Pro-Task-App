const express = require('express');
require('./db/mongoose.js');
const userRoute = require('./routes/userRoute.js');
const taskRoute = require('./routes/taskRoute.js');

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

app.listen(port, ()=> {
    console.log("Server At Port: " + port);
});