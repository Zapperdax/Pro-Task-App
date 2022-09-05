const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URL);



// const me = new User({
//     name: '   Mawia  ',
//     email: 'MAWIA@gmail.com',
//     age: 22,
//     password: 'Password123'
// });

// me.save().then(()=> {
//     console.log(me);
// }).catch((error)=> {
//     console.log('Error: ' + error);
// });

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// });

// const getSomethingDone = new Task({
//     description: 'My Work Is Never Done'
// });

// getSomethingDone.save().then(()=> {
//     console.log(getSomethingDone);
// }).catch((error)=> {
//     console.log('Error: ' + error);
// });