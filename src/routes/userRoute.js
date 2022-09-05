const express = require('express');
const User = require('../models/user.js');
const auth = require('../middleware/auth.js');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmail, cancelEmail} = require('../emails/account');

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Supported Images Types Are PNG, JPEG, JPG'));
        }
        cb(undefined, true);
    }
});



router.get('/users/me', auth, async (req,res)=> {
    res.send(req.user);
});

router.get('/users/:id/avatar', async(req, res)=> {
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch(err){
        res.status(404).send();
    }
});

router.post('/users', async (req,res)=> {
    const user = new User(req.body);
    
    try{
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(e){
        res.status(400).send(e);
    }
    
});

router.post('/users/login', async(req,res)=> {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(err){
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async(req,res)=> {
    try{
        req.user.tokens = req.user.tokens.filter((token)=> {
            return token.token !== req.token
        });
        await req.user.save();
        res.send();
    } catch(err){
        res.stauts(500).send();
    }
});

router.post('/users/logoutAll', auth, async(req,res)=> {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(err){
        res.stauts(500).send();
    }
});

router.post('/users/me/avatar',auth, upload.single('avatar'), async(req, res)=> {
    const buffer = await sharp(req.file.buffer).resize({
        width: 500,
        height: 500
    }).png().toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
}, (err, req, res, next)=> {
    res.status(400).send({err: err.message});
});

router.patch('/users/me', auth, async(req,res)=> {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidUpdate = updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidUpdate) {
        return res.status(400).send({"error": "Some Properties Do Not Exist"});
    }

    try{
        // const user = await User.findById(req.params.id);
        updates.forEach((update)=> req.user[update] = req.body[update]);
        await req.user.save();
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        // if(!user){
        //     return res.status(404).send();
        // }
        res.send(req.user);
    } catch(err){
        res.status(400).send(err);
    }
});

router.delete('/users/me', auth, async(req,res)=> {
    try{
        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user){
        //     return res.status(404).send();
        // }
        await req.user.remove();
        cancelEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch(err){
        res.status(404).send(err);
    }
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send(200);
});

module.exports = router;