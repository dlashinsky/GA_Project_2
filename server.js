// Dependencies 
require('dotenv').config()
const db = require('./models')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const rowdy = require ('rowdy-logger')
const cookieParser = require('cookie-parser')
const cryptojs = require('crypto-js')
const axios = require('axios')
const chefsController = require('./controllers/chefsController')
const usersController = require('./controllers/usersController')


const app = express()
const rowdyResults = rowdy.begin(app)
const PORT = process.env.PORT || 3000

//middleware
app.use(require('morgan')('tiny'))
app.set('view engine', 'ejs')
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
app.use(ejsLayouts)
app.use(cookieParser())

//RES.LOCALS AND DECRYPTION 
app.use( async (req, res, next) => {

    if(req.cookies.chefId) {
        const decryptedChefId = cryptojs.AES.decrypt(req.cookies.chefId, process.env.COOKIE_SECRET)
        const decryptedChefIdString = decryptedChefId.toString(cryptojs.enc.Utf8)
        const chef = await db.chef.findByPk(decryptedChefIdString)
        res.locals.chef = chef
        

    }else {
        res.locals.chef = null
    }
    
    next()
})


//Controllers
app.use('/chefs', chefsController)
app.use('/recipes', usersController)

//Render Homepage
app.get('/', async (req, res) => {
    res.render('index.ejs')
   
})

//Renders Create account page 
app.get('/new', (req, res) =>{
    res.render('chefs/chef-new.ejs')
})

//render login page
app.get('/login', (req, res) =>{
    res.render('chefs/chef-login.ejs')
})

//Anyone clicks on "chefs" in Nav-bar, displays all the chefs in the system 
app.get('/chefs', async (req, res) =>{
    try {
        const chefs = await db.chef.findAll();
        res.render('chefs/chef-index.ejs', { chefs: chefs })
    } catch (error) {
        console.log(error)
    }
})

//Loads profile of a particular Chef
app.get('/:id', async (req, res) =>{
    try {
        const chef = await db.chef.findByPk(req.params.id)
        const chefData = chef.dataValues
        res.render('chefs/chef-profile.ejs', { chefData: chefData })
    } catch (error) {
        console.log(error)
    }
})





//Start Server
app.listen(PORT, () =>{
    rowdyResults.print()
})



