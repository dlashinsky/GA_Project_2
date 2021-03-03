// Dependencies 
require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const rowdy = require ('rowdy-logger')
const cookieParser = require('cookie-parser')
const cryptoJS = require('crypto-js')
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
app.use(cookieParser())
app.use(ejsLayouts)


//Controllers
app.use('/chefs', chefsController)
app.use('/recipes', recipesController)



//Render Homepage
app.get('/', async (req, res) => {
    try{
    res.render('index.ejs')
    
    }catch(err){
        console.log(err)
    }
})





//Start Server
app.listen(PORT, () =>{
    rowdyResults.print()
})



