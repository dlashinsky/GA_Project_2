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
const recipesController = require('./controllers/recipesController')


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

app.use( async (req, res, next) => {
    const decryptedChefId = cryptojs.AES.decrypt(req.cookies.chefId, 'test')
    const decryptedChefIdString = decryptedChefId.toString(cryptojs.enc.Utf8)
    
    const chef = await db.chef.findByPk(decryptedChefIdString)
    res.locals.chef = chef
    next()
})


//Controllers
app.use('/chefs', chefsController)
app.use('/recipes', recipesController)



//Render Homepage
app.get('/', async (req, res) => {
    try{
    console.log(res.locals)
    res.render('index.ejs')
    }catch(err){
        console.log(err)
    }
})





//Start Server
app.listen(PORT, () =>{
    rowdyResults.print()
})



