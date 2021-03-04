const { default: axios } = require('axios');
// const { in } = require('sequelize/types/lib/operators');
const db = require('../models')
const router = require('express').Router()


//GET Routes


//displaying all Chefs registered in the system
router.get('/', async (req, res) =>{
    try {
        const chefs = await db.chef.findAll();
        res.render('chefs/chef-index.ejs', { chefs: chefs})
    } catch (error) {
        console.log(error)
    }
})

//render login page
router.get('/login', (req, res) =>{
    res.render('chefs/chef-login.ejs')
})

//render create new account page
router.get('/new', (req, res) =>{
    res.render('chefs/chef-new.ejs')
})

//logging in a Chef
router.post('/login', async (req, res) =>{
    try{
        const chef = await db.chef.findOne({
            where: { user_name: req.body.username }
        })
        const chefPk = chef.id
        const password = chef.password
        const userInputPassword = req.body.password
        if(password === req.body.password) {
            res.redirect(`/chefs/${chefPk}/chef-home`)
        }else{
            res.redirect('/chefs/login')
        }
    }catch(error){
        console.log(error)
    }
})

// Homepage of Chef logged in
router.get('/:id/chef-home', async (req, res) =>{
    //search recipes from API
    let recipes = []
    if(req.query.search) {
        try {
            const searchTerm = req.query.search
            const mealURL = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
            const recipeData = mealURL.data
            // const chefId = db.chef.findByPk(req.params.id)
            recipes = recipeData.meals
        } catch (error) {
            console.log(error)
        }
    }
    res.render('chefs/chef-home.ejs', { recipes: recipes })

})


//This is to create a new chef in the system
router.post('/new', async (req, res) =>{
    const newChef = await db.chef.findOrCreate({
        where: { user_name: req.body.username },
        defaults: { 
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            experience: req.body.experience
        }
    })
    console.log(newChef)
})


//Loads profile of a particular Chef
router.get('/:id', async (req, res) =>{
    try {
        const chef = await db.chef.findByPk(req.params.id)
        const chefData = chef.dataValues
        res.render('chefs/chef-profile.ejs', { chefData: chefData })
    } catch (error) {
        console.log(error)
    }
})

//Chef clicks on viewing a recipe card in full detail
router.get('/:id/recipes/:id', async (req, res) =>{
    try {
        let mealArr = []
        let ingredients = []
        let ingredientValues = []
        let combinedArrays = []
        const mealId = req.params.id
        const mealURL = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        const mealData = mealURL.data.meals
        // console.log(mealData)
        // let ingName = mealData.filter(ingredient =>{
        //     ingredient.strIngredient1 
        // })
        // console.log(ingName)
        // console.log(mealData)
        // const array = Object.entries(mealData)
        // console.log(array)
        for (let i=0; i < mealData.length; i++){
        
            for (const key in mealData[i]) {
                mealArr= `${key}: ${mealData[i][key]}`
                if(mealArr.includes("strIngredient") === true && (mealData[i][key] !== "") ){
                    ingredients.push(mealData[i][key])
                }
                if(mealArr.includes("strMeasure") === true && (mealData[i][key] !== "") ){
                    ingredientValues.push(mealData[i][key])
                }
            }
            combinedArrays = ingredientValues.map(function (value, index){
                return [value, ingredients[index]]
            })
        }
        console.log(`here are the ingredients ${ingredients}`)
        res.render('chefs/chef-recipe-show', { mealData: mealData, combinedArrays: combinedArrays })
    } catch (error) {
        console.log(error)
    }
})

//Chef pinning/adding a recipe
router.post('/chefs/:id/')


//Chef adding a comment to a particular recipe
router.post('/:chefId/recipes/:recipeId/comments', async (req, res)=> {
    try {

        const chef = await db.chef.findOne({
            where: { id: req.params.chefId }
        })
            chef.createComment({
                comment: req.body.comment,
                recipeId: req.params.recipeId
            })
        
    } catch (error) {
        console.log(error)
    }
})


module.exports = router