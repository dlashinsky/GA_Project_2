// Dependencies 
require('dotenv').config()
const express = require('express')
const app = express()
const rowdy = require ('./models')
const rowdyRes = rowdy.begin(app)
const cookieParser = require('cookie-parser')
const cryptoJS = require('crypto-js')


//middleware
app.use(require('morgan')('tiny'))
app.set('view engine', 'ejs')
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
app.use(cookieParser())