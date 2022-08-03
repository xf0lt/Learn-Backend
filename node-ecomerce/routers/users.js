const { User } = require('../models/user');
const express = require('express');
const  router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Product } = require('../models/product');

//* GET ALL USER
router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash');
    if(!userList){
        res.status(500).json({success: false})
    }
    res.send(userList);
})

//* GET USER BY ID
router.get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user){
        res.status(500).json({
            message: 'the user with the given by id not found',
            success: false
        })
    } 
    res.status(200).send(user);
})

//*  POST USER
router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        color: req.body.color,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country

    })
    user = await user.save();

    if(!user)
    return res.status(404).send('user cannot created')
    res.send(user);
})

//* put by id
router.put(`/:id`, async (req, res) => {
    const userExist = User.findById(req.params.id);
    let newPassword
    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.params, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id, {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        }, {new: true}
    ) 
    if(!user)
    return res.status(400).send('the user cannot  be created')
    res.send(user)
})

//*  LOGIN POST
router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;

    if(!user){
        return res.status(400).send('The user not found');
    } 
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            }, secret, {expiresIn: '1d'}
        )

        res.status(200).send({user: user.email , token: token})
    } else {
        return res.status(400).send('Password is wrong')
    }   
}) 

//* post register
router.post('/register', async (req, res) =>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    }) 
    user = await user.save();
    if(!user) return res.status(400).send('the user cannot be created')
    res.send(user)
})

//* get count
router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments((count) => count)

    if(!user) {
        res.status(500).json({success: false})
    }
    res.send({
        userCount: userCount
    })
})

//* deleted by id
router.delete('/:id', async (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user){
            return res.status(200).json({
                success: true,
                message: 'the user is deleted'
            })
        } else {
            return res.status(404).json({
                succes: false,
                message: 'user not found'
            })
        }
    }).catch(err => {
        return res.status(400).json({
            succes: false, 
            error: err
        })
    })
})







module.exports = router;