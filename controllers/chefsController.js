const { default: axios } = require('axios');
// const { in } = require('sequelize/types/lib/operators');
const db = require('../models')
const router = require('express').Router()
const cryptojs = require('crypto-js')


//GET Routes


//displaying all Chefs registered in the system
router.get('/', async (req, res) =>{
    try {
        const chefs = await db.chef.findAll();
        res.render('chefs/chef-index.ejs', { chefs: chefs })
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
router.post('/:id/chef-home', async (req, res) =>{
    try{
        const chef = await db.chef.findOne({
            where: { user_name: req.body.username }
        })
        const chefPk = chef.id
        const password = chef.password
        const userInputPassword = req.body.password
        if(password === req.body.password) {

            const encryptedChefId = cryptojs.AES.encrypt(chef.id.toString(), 'test')
            const encryptedChefIdString = encryptedChefId.toString()
            res.cookie('chefId', encryptedChefIdString)
            res.redirect(`/chefs/${chef.id}/chef-home`)
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
            recipes = recipeData.meals
        } catch (error) {
            console.log(error)
        }
    }

    res.render('chefs/chef-home.ejs', { recipes: recipes })

})


//This is to create a new chef in the system
router.post('/new', async (req, res) =>{
  
    const newChef = await db.chef.create({
            user_name: req.body.username,
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            experience: req.body.experience
    })
    const encryptedChefId = cryptojs.AES.encrypt(newChef.id.toString(), 'test')
    const encryptedChefIdString = encryptedChefId.toString()
    res.cookie('chefId', encryptedChefIdString)
    res.redirect('/chefs/login')
})

router.get('/logout', (req, res)=> {
    res.clearCookie('chefId')
    res.redirect('/')
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
        let mealData = null
        let mealArr = []
        let ingredients = []
        let ingredientValues = []
        let combinedArrays = []
        const mealId = req.params.id
        const mealURL = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        mealData = mealURL.data.meals
        for (let i=0; i < mealData.length; i++){
            for (const key in mealData[i]) {
                if(key.includes("strIngredient") === true && (mealData[i][key] !== "" && mealData[i][key] !== " ") ){
                    ingredients.push(mealData[i][key])
                }
                if(key.includes("strMeasure") === true && (mealData[i][key] !== "" && mealData[i][key] !== " ") ){
                    ingredientValues.push(mealData[i][key])
                }     
            }
            combinedArrays = ingredientValues.map(function (value, index){
                return [value, ingredients[index]]
            })
        }
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

//Chef Pinning a recipe 




module.exports = router