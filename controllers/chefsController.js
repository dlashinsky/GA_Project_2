const { default: axios } = require('axios');
// const {in} = require('sequelize/types/lib/operators');
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
        let mealURL = []
        let recipe = null
        const chefId = Number(req.params.chefId)
        const idMeal = Number(req.params.idMeal)
        
        mealURL = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
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
        
        recipe = await db.recipe.findOne({
            where: {idMeal: req.params.idMeal}, 
            include: [{
                model: db.chefs_comments,
                include: db.chef
            },{
                model: db.chefs_pinned_recipes,
                include: db.chef
            },{
                model: db.recipes_ratings,
                include: db.chef
            }]
        })
        let chefComments = [] 
        let chefPinned = null
        let chefRated = null
        let chefPinIds = []
        let chefRateIds = []
        let pinnedRecipeTable = []
        let chefRatingsTable = []
        if(recipe){
            chefComments = recipe.chefs_comments 
            pinnedRecipeTable = recipe.chefs_pinned_recipes
            pinnedRecipeTable.forEach(key => {
                chefPinIds = key.chefId
            })
            chefRatingsTable = recipe.recipes_ratings
            chefRatingsTable.forEach(key => {
                chefRateIds = key.chefId
            })
            if(recipe.idMeal === idMeal && chefId === chefPinIds){
                chefPinned = true 
            }else{
                chefPinned = false
            }
            if(recipe.idMeal === idMeal && chefId === chefRateIds){
                chefRated = true
            }else{
                chefRated = false
            }
        }
        res.render('chefs/chef-recipe-show', { 
            mealData: mealData, 
            combinedArrays: combinedArrays, 
            chefComments: chefComments,
            chefPinned: chefPinned,
            chefRated: chefRated
         })
    } catch (error) {
        console.log(error)
    }
})

// MORE COMPLEX ROUTES -- (DOUBLE ONE TO MANY)

//Chef Pinning a recipe 
router.post('/:chefId/recipes/:idMeal/recipes', async (req, res) => {
    try {

       const idMeal = req.params.idMeal
       const mealURL = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
       const mealData = mealURL.data.meals
       let mealTitle = []
       let mealImageUrl = []
       mealData.forEach(value => {
            mealTitle = value.strMeal
            mealImageUrl = value.strMealThumb
       })
       
        const [recipe, created] = await db.recipe.findOrCreate({
            where: { idMeal: req.params.idMeal },
            defaults: {
                title: mealTitle,
                image_url: mealImageUrl
            }
        })
        const chef = await db.chef.findOne({
            where: { id: req.params.chefId }
        })
        chef.createChefs_pinned_recipe({
            recipeId: recipe.id
        })
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

        const idMeal = req.params.idMeal
        const mealURL = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        const mealData = mealURL.data.meals
        let mealTitle = []
        let mealImageUrl = []
        mealData.forEach(value => {
            mealTitle = value.strMeal
            mealImageUrl = value.strMealThumb
        })
        const [recipe, created] = await db.recipe.findOrCreate({
            where: { idMeal: req.params.idMeal },
            defaults: {
                title: mealTitle,
                image_url: mealImageUrl
            }
        })
        const chef = await db.chef.findOne({
            where: { id: req.params.chefId }
        })
        chef.createChefs_comment({
            comment: req.body.comment,
            recipeId: recipe.id
        })
        res.redirect(`/chefs/${chef.id}/recipes/${idMeal}`)
    } catch (error) {
        console.log(error)
    }
})


//Chef rating a recipe 
router.post('/:chefId/recipes/:idMeal/ratings', async (req, res) => {
    try {
        console.log("HERE IS THE ADD RATING ROUTE")
        const idMeal = Number(req.params.idMeal)
        const chefId = Number(req.params.chefId)
        let overRate = false
        const mealURL = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        const mealData = mealURL.data.meals
        let mealTitle = []
        let mealImageUrl = []
        mealData.forEach(value => {
                mealTitle = value.strMeal
                mealImageUrl = value.strMealThumb
        })
        const [recipe, created] = await db.recipe.findOrCreate({
            where: { idMeal: req.params.idMeal },
            defaults: {
                title: mealTitle,
                image_url: mealImageUrl
            }
        })
        const chef = await db.chef.findOne({
            where: { id: req.params.chefId }
        })
        if(req.body.rating <= 10){
            chef.createRecipes_rating({
                rating: req.body.rating,
                recipeId: recipe.id
            })
            overRate = false
            res.redirect(`/chefs/${chefId}/recipes/${idMeal}`)
        }else{
            overRate = true
            res.render('chefs/error-page.ejs')
        }
    } catch (error) {
        console.log(error)
    }
})


//REMOVE PIN 
router.delete('/:chefId/recipes/:idMeal/recipes', async (req, res) =>{
    try{
        console.log("HERE IS THE DELETE PIN ROUTE")
        let pinId = []
        let idMealPin = []
        let idMealParam = Number(req.params.idMeal)
        let chefsPinnedTable = []
        let chefIdPin = []
        const chefId = Number(req.params.chefId)
        const idMeal = Number(req.params.idMeal)
        const recipe = await db.recipe.findOne({
            where: {idMeal: req.params.idMeal},
            include: [{
                model: db.chefs_pinned_recipes,
                include: db.chef
            }]
        })
        idMealPin = recipe.idMeal
        chefsPinnedTable = recipe.chefs_pinned_recipes
        chefsPinnedTable.forEach(column =>{
            chefIdPin = column.chefId
            if(chefId === chefIdPin  &&  idMealParam === idMealPin){
                pinId = column.id
            }
        })
       const pinnedRecipe = await db.chefs_pinned_recipes.findByPk(pinId)
       const removePinnedRecipe =  await pinnedRecipe.destroy();
       res.redirect(`/chefs/${chefId}/recipes/${idMeal}`)
    }catch(err){
        console.log(err)
    }
})

//CHANGE COMMENT
router.put('/:chefId/recipes/:idMeal/recipes', async (req, res) =>{
    try {
        console.log("HERE IS THE PUT ROUTE")
        const chefId = Number(req.params.chefId)
        const idMeal = Number(req.params.idMeal)
        
        const existingComment = await db.chefs_comments.findOne({
            where: {id: req.body.commentId}
        })
        const updatedComment = await existingComment.update({
            comment: req.body.comment
        })
        console.log(updatedComment)
        console.log("ABOVE IS THE COMMENT INFORMATION")
        
        res.redirect(`/chefs/${chefId}/recipes/${idMeal}`)
    } catch (err) {
        console.log(err)
    }
})


module.exports = router