const express = require('express');
require('./db/mongoose.js');
const userRoute = require('./routes/userRoute.js');
const taskRoute = require('./routes/taskRoute.js');

const app = express();

const port = process.env.PORT;

// app.use((req,res,next)=> {
//     const routes = ['GET', 'POST', 'PATCH', 'DELETE'];
//     if(routes.includes(req.method)){
//         res.status(503).send('Server Is Under Maintainance, Please Try Again Later');
//     } else {
//         next();
//     }
// })

// const multer = require('multer');
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please Upload a Word Document'));
//         }

//         cb(undefined, true);
        
//         // cb(new Error('File Must Be Proper Format'));
//         // cb(undefined, true);
//         // cb(undefined, false)
//     }
// });

// app.post('/upload', upload.single('upload'), (req, res)=> {
//     res.send();
// }, (err, req, res, next)=> {
// res.status(400).send({err: err.message});
// });

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);



app.listen(port, ()=> {
    console.log("Server At Port: " + port);
});

// const jwt = require('jsonwebtoken');

// const myFunction = async ()=> {
//     const token = jwt.sign({_id: 'abc123'}, 'thisismysecretcode', {expiresIn: '7 days'});
//     console.log(token);
//     const data = jwt.verify(token, 'thisismysecretcode');
//     console.log(data);
// }

// myFunction();

// const Task = require('./models/task.js');
// const User = require('./models/user.js');

// const main = async ()=> {
//     Task.findOne({_id:'630df254e74c9d0fc808d7f2'}).populate('owner').exec((err, result)=> {
//         console.log(result.owner);
//     })
//     // const user = await User.findById('630df1eee74c9d0fc808d7e7');
//     // await user.populate('tasks').execPopulate();
//     // console.log(user.tasks);
// }

// main(); 