const db = require('./models')



async function createChef () {
    const newChef = await db.chef.findOrCreate({
        where: { first_name: 'Gordon'},
        defaults: { 
            last_name: 'Ramsay',
            email: 'g.ramsay@gmail.com',
            user_name: 'G.Ramsay',
            password: 'yourePathetic',
            chef_bio: "Busted my ass for 35 years to get where I got.  Worked in the best restaurants in the world.  Made some of the best dishes in the world.  Your food is probably rubbish, and I'll tell you straight to your face.",
            experience: " British chef, restaurateur, television personality, and writer. Born in Johnstone, Scotland, and raised in Stratford-upon-Avon, England, he founded his global restaurant group, Gordon Ramsay Restaurants, in 1997.",
            profile_img_url: './imgs/ramsay.png',
            headline:"Idiot Sandwich" 
        }
        
    })
    console.log(newChef)
}

createChef();


// async function deleteChef() {
//     const findChef = await db.chef.findOne({
//         where: { first_name: 'Gordon' }
//     })
//     const deletedChef = await findChef.destroy()
//     console.log(deletedChef)
// }
// deleteChef();


async function createRecipe () {
    const newRecipe = await db.recipe.findOrCreate({
        where: { idMeal: 12345 },
        defaults: {
            title: 'Test Recipe',
            image_url:'./imgs/lasagna.png'
        }
    })
    console.log(newRecipe)
}

createRecipe();

async function addComment () {
    const chef = await db.chef.findOne({
        where: { first_name: 'Gordon' },
        include: db.chefs_comments
    })
    const recipe = await db.recipe.findOne({
        where: { id: 1 },
        include: db.chefs_comments
    })
    
    const newComment = await db.chefs_comments.create({
        comment: 'This is a test comment adding to the recipe created'
    })
    await 
}

