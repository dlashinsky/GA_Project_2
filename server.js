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
const methodOverride = require('method-override')
// const { removeTicks } = require('sequelize/types/lib/utils')

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
app.use(methodOverride('_method'))

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

//searchBar on homepage
app.get('/recipes', async (req, res) =>{
    //search recipes from database, add in API
    let recipes = []
    let searchRecipes = []
    let searchedRecipes = []
    let recipeImage = []
    let recipeTitle = []
    if(req.query.search) {
        try {
            let idMealAPI = []
            let mealTitle = []
            let image = []
            if(req.query.search){
                const searchTerm = req.query.search
                const mealURL = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
                const recipeData = mealURL.data
                recipes = recipeData.meals
            
                async () => {
                    for(let recipe of recipes){
                       mealTitle = await recipe.strMeal
                       idMealAPI = await recipe.idMeal
                       image = await recipe.image_url
                       searchRecipes = await db.recipe.findAll({
                            where: {
                                idMeal: idMealAPI
                            }
                        });
                        
                        // searchRecipes.forEach(recipe => {
                            
                        //     searchedRecipes.push({
                        //         idMeal: recipe.idMeal,
                        //         title: recipe.title,
                        //         image_url: recipe.image_url
                        //     })
                            
                        // })
    
                    }
                }


                console.log(searchRecipes)
                console.log("HERE IS SEARCH RECIPES")
            }

        } catch (error) {
            console.log(error)
        }
    }

    res.render('recipe-index.ejs', { recipes: recipes, searchRecipes: searchRecipes})
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
app.get('chefs/:chefId', async (req, res) =>{
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



