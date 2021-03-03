const db = require('../models')
const router = require('express').Router()


//GET Routes


//GET all chefs by Clicking on "Chefs" in nav-bar

router.get('/', async (req, res) =>{
    try {
        const chefs = await db.chef.findAll();
        res.render('chef-index.ejs', { chefs: chefs})
    } catch (error) {
        console.log(error)
    }
})
    

router.get('/:id', async (req, res) =>{
    try {
        const chef = await db.chef.findByPk(req.params.id)
        const chefData = chef.dataValues
        res.render('chef-profile.ejs', { chefData: chefData })
    } catch (error) {
        console.log(error)
    }
})


router.get('/login', async (req, res) =>{
    res.render('chef-login.ejs')
})

// router.get('/new', (req, res) =>{
//     try {
//         res.render('chef-new.ejs')
//     } catch (error) {
//        console.log(error) 
//     }
// })

module.exports = router