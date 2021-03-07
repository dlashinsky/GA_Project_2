const { default: axios } = require('axios');
// const { in } = require('sequelize/types/lib/operators');
const db = require('../models')
const router = require('express').Router()
const cryptojs = require('crypto-js')
const bcrypt = require('bcrypt')




//displaying all Chefs registered in the system
router.get('/', async (req, res) =>{
    try {
        const chefs = await db.chef.findAll();
        res.render('chefs/chef-index.ejs', { chefs: chefs })
    } catch (error) {
        console.log(error)
    }
})

//logging a chef out
router.get('/logout', (req, res)=> {
    res.clearCookie('chefId')
    res.redirect('/')
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
        if(chef && bcrypt.compareSync(userInputPassword, password)) {
            const encryptedChefId = cryptojs.AES.encrypt(chef.id.toString(), process.env.COOKIE_SECRET)
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

//This is to create a new chef in the system
router.post('/new', async (req, res) =>{
    try {
        
        if(!req.body.username || !req.body.password) {
            res.render('auth/new', { errors: 'Invalid username/password'})
            return;
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 12)
        
        const newChef = await db.chef.create({
                user_name: req.body.username,
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                email: req.body.email,
                password: hashedPassword,
                experience: req.body.experience
            })
            const encryptedChefId = cryptojs.AES.encrypt(newChef.id.toString(), process.env.COOKIE_SECRET)
            const encryptedChefIdString = encryptedChefId.toString()
            console.log(encryptedChefIdString)
            console.log(newChef.id)
            res.cookie('chefId', encryptedChefIdString)
            res.redirect('/')
            
        } catch (error) {
            console.log(error)
        }
    })
    
//Loads profile of a particular Chef
router.get('/:chefId', async (req, res) =>{
    try {
        const chef = await db.chef.findByPk(req.params.chefId)
        const chefData = chef.dataValues
        res.render('chefs/chef-profile.ejs', { chefData: chefData })
    } catch (error) {
        console.log(error)
    }
})

// Homepage of Chef logged in
router.get('/:chefId/chef-home', async (req, res) =>{
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


//Chef gets full detail of recipe card from API
router.get('/:chefId/recipes/:idMeal', async (req, res) =>{
    try {
        let mealData = null
        let mealArr = []
        let ingredients = []
        let ingredientValues = []
        let combinedArrays = []
        const idMeal = req.params.idMeal
        const mealURL = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        mealData = mealURL.data.meals
        for (let i=0; i < mealData.length; i++){
            for (const key in mealData[i]) {
                if(key.includes("strIngredient") === true && (mealData[i][key] !== "" && mealData[i][key] !== " " && mealData[i][key] !== null) ){
                    ingredients.push(mealData[i][key])
                }
                if(key.includes("strMeasure") === true && (mealData[i][key] !== "" && mealData[i][key] !== " " && mealData[i][key] !== null)){
                    ingredientValues.push(mealData[i][key])
                }     
            }
            combinedArrays = ingredientValues.map(function (value, index){
                return [value, ingredients[index]]
            })
        }
        const recipe = await db.recipe.findOne({
            where: {idMeal: req.params.idMeal}, 
            include: [{
                model: db.chefs_comments,
                include: db.chef
            }]
        })
        let chefComments = []      
        if(recipe){
            chefComments = recipe.chefs_comments 
        }
        
        res.render('chefs/chef-recipe-show', { 
            mealData: mealData, 
            combinedArrays: combinedArrays, 
            chefComments: chefComments })
    } catch (error) {
        console.log(error)
    }
})

// MORE COMPLEX ROUTES -- (DOUBLE ONE TO MANY)

//Chef Pinning a recipe 
router.post('/:chefId/recipes/:idMeal/recipes', async (req, res) => {
    try {

        
        const [recipe, created] = await db.recipe.findOrCreate({
            where: { idMeal: req.params.idMeal }
        })
        console.log(recipe.id + "  this is the recipe log" + recipe.idMeal)

        const chef = await db.chef.findOne({
            where: { id: req.params.chefId }
        })
        console.log(chef.id + "   this is the chef log" + chef.first_name)

        chef.createChefs_pinned_recipe({
            recipeId: recipe.id
        })

        const idMeal = req.params.idMeal
        const chefId = req.params.chefId
        res.redirect(`/chefs/${chefId}/recipes/${idMeal}`)
    } catch (error) {
        console.log(error)
    }
})

//Chef tagging a recipe with a particular cuisine (may lose/change this one entirely, change to just "tags?")
router.post('/:chefId/recipes/:idMeal/cuisines', async (req, res) => {
    try {
        


    } catch (error) {
        console.log(error)
    }
})


//Chef commenting on a recipe 
router.post('/:chefId/recipes/:idMeal/comments', async (req, res) => {
    try {

        const [recipe, created] = await db.recipe.findOrCreate({
            where: { idMeal: req.params.idMeal }
        })

        const chef = await db.chef.findOne({
            where: { id: req.params.chefId }
        })

        chef.createChefs_comment({
            comment: req.body.comment,
            recipeId: recipe.id
        })
        const idMeal = req.params.idMeal
        res.redirect(`/chefs/${chef.id}/recipes/${idMeal}`)
    } catch (error) {
        console.log(error)
    }
})


//Chef rating a recipe 
router.post('/:chefId/recipes/:idMeal/ratings', async (req, res) => {
    try {

        const idMeal = req.params.idMeal
        const chefId = req.params.chefId

        // console.log("PARAMETERS " + chefId, recipeId)
        
        const rating = await db.recipe.findOne({
            where: { idMeal: req.params.idMeal},
            include: [{
                model: db.recipe_ratings,
                include: db.chef
            }]
        })

        console.log(rating + "")

        // if(rating.recipeId == recipeId){
        //     console.log(rating.recipeId, recipeId + "They're the same Values")
        // }

        // if(rating.recipeId != recipeId){
        //     console.log(rating.recipeId, recipeId + "They're NOT the same values")
        // }

        if(rating.chefId != chefId && rating.recipeId != recipeId){

            const chef = await db.chef.findOne({
                where: { id: req.params.chefId }
            })

            if(req.body.rating <= 10){
                chef.createRecipes_rating({
                    recipeId: req.params.recipeId,
                    rating: req.body.rating
                })
            }else{
                res.render("YOU CAN'T RATE HIGHER THAN 10!")
            }

            res.redirect(`/chefs/${chefId}/recipes/${recipeId}`)

        }else{
            res.render('chefs/error-page.ejs')
        }

        

    } catch (error) {
        console.log(error)
    }
})



module.exports = router