const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const path = require('path')
const publicDir = path.join(__dirname, '../../public')
const auth = require('../middleware/auth')

router.get('', (req, res) => {
    res.sendFile(publicDir+'/html/index.html')
})

router.get('/home', auth, (req, res) => {
    res.render('home', {
        name: req.user.firstName
    })
})

router.post('/users', async (req, res)=> {
    const user = new User(req.body)
    try{
        await user.save();
        const token = await user.generateAuthToken();
        // res.status(201).sendFile(publicDir+'/html/home.html')
        res.status(201).render('home', {
            name: user.firstName
        })
    }
    catch(e){
        console.log(req)
        res.status(400).send({e});
    }
})

module.exports = router;