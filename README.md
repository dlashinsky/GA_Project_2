# Chef Curated Recipe Book
### Working_Titles: 
* The Consommé
* DeGlazed
* The Chinois
* Render
* WeChef

## Synopsis 

An e-recipe resource of online recipes that are curated, created by Chefs, whom are vetted by experienced culinarians and chefs.  Chef's have "channels" where they are the only ones that can create new content.   

## Problem To Solve:
From a chef's perspective some of the most frustrating things on the internet are foodies talking about things like how to "spatch-cock" a sausage or food bloggers sharing their recipe for "delicious cinnamon meatballs."  Don't get us on the subject of "Elite Yelpers", unless you wanna have an earful of angry frustrated words.

With all of that said, its true that food and cuisine is certainly a subjective art that evolves, and is moulded around culture, geography, weather and several other factors.  This is what makes cuisine beautiful-- the endlessness of possibilites.  

BUT, there are right and wrong ways to do things.  Cooking professionally you are forced to learn what those are becuase, simply put, there isn't enough time or resources to learn or do anything the wrong way in the food industry.  

Much of the uncurated recipes on the internet are full of ads, or massive backstories involving the food blogger's kids, dogs, or other unuseful information when you're simply looking for a reminder for that ratio of hollandaise or if you're trying to simply look up the ingredients needed in Harrisa. How do we have a simple, one stop shop for all recipes that are tride, true and without the fluff?

This is where "WeChef" comes into play. 

## App Description
This app will have two types of users: General Users and Chef Curators.  A simplistic one, stop shop where a General user can gain access to a list of recipes that have been curated by chefs who have been vetted by WeChef itself.  They can gain access to high quality, real and working recipes, easily and quickly without annoying backstories or endless ads.  A chef curator can share their recipes, favorite other chef curator recipes, pin other recipes from various resources (MealDB).

## MVP Goals

* Linking MealDB API as a searchable resource on the homepage that will populate with a preview of information on that recipe.

* Recipe information will include:  
    * Ingredients 
    * Procedure 
    * Chef Curator Comments
    * Chef Curator Rating
    * Chef Pins (number of chef's who have pinned that recipe)
    

* Chef Curator Account creation, login, profile and functionality with the following:
    
    * **Functionatilty**: Being able to "Approve", Pin, Rate and Comment on recipes. 
        * Approve: Used similarly like a Tag on a recipe
        * Pin: This will be stored under the Chef Curators account as the specific recipes that they have pinned
        * Rate: Chef Curators will be able to rate a recipe from 1-5
        * Comment: Chef Curators will be able to comment on the recipe

    * **Account Creation**: To create an account they will add in information that will be displayed on their profile, (name & about info (cuisine specialties, experience, etc.)), username, and password.
    * **Login**: Login page with username and password.

## Strech Goals

* Creating a "vetting" chef curator process, where to become a chef curator you first must send an email to request this type of access.  Then you will then be sent a link and key to create a profile if approved. 

* Chef Curators can create/Upload their own recipes to their Channel 

* Chef Curator Channel/profiles can be accessed by general users, and chef curator recipes will appear in general search query
    * Be able to filter/toggle recipe search from API to Chef Curators 

* Add a "dislike"/"disapprove" section for chef curators who disagree/dislike the recipe. 

* Account creation for general user Accounts 
    * Ability to favorite/store recipes in their account to refer back to later. 
    * Ability to comment on recipes 


* On Recipe Info page, be able to scale recipe dynamically 


## User Stories 

### General Users
*  As a user I can query a search term for recipes and see the following:

    * A list of matching searches that has a preview of info:
        * A thumbnail of the recipe 
        * A Chef's Curator rating of the recipe
        * Number of "Pins" as a clickable link to show what chef curators have pinned that recipe
        * A preview of a comment or two made by Chef Curators
        * this entire preview will be clickable bringing the user to the recipe show page.


    * Clicking on the recipe preview page, will bring user to the to recipe info page that has:
        * Listed Ingredients
        * Procedure
        * Nutritional Information
        * all Comments by chef Curators on that recipe
        * Rating of recipe by chef curators
        * List of chef's who have pinned the recipe 


## APIs to be used

 * ### MealDB 
    * This will be the API used for all recipe search queries that chef curators can rate, pin, and comment on. 

* ### Edamam *(stretch)* 
    * Ingredient information API.  Only used if adding chef curator recipe adding functionality where chefs can enter in their recipe and information on ingredients is accessed to add nutritinoal information. 


## Daily Sprints 

* ###  Monday: Finish Hard Pitch 
    * Test API
    * Wire Frame App
    * plan database ERD
    * plan routes

* ### Tuesday: Begin Coding 
    * create db models -- test db
    * stub routes -- test routes
    * build routes
    * build controllers

* ### Wednesday: Continue Coding, Finishing routes
    * finish routes if not complete
    * create views

* ### Thursday:  Views, etc. (latest)
    * finish views
    * mvp

* ### Friday: Acheive MVP (latest)
    * debug refactor
    * CSS Pages/views

* ### Saturday: Continue Styling/Begin Strech Goals 
    *   Continue Styling
    *   Begin stretch goals


*  ### Sunday:
    * Debug/continue working on stretch goals
    * Add live to Hiroku/Server hosting
    * Finishing Touches on CSS


## WireFrames:

### HomePage:
![Homepage](/imgs/homepage.png)
### Recipe Query:
![recipe query](/imgs/recipe-query.png)
### Recipe Card:
![recipe card](/imgs/recipe-card.png)
### Create Account:
![create account](/imgs/create-account.png)
### Login:
![login](/imgs/login.png)

## ERD:

![ERD](/imgs/ERD.png)



## Routes:

HTTP VERB | URL | Description 
------------ | ------------- | -------------
GET | /recipes | User search Query for all recipes within local database
GET | /recipes/:id | User Clicking on a recipe (show page)
GET | /chefs/new | renders creating an account page
POST | /chefs/new | adds new chef to Database, redirects to login page
GET | /chefs | User Clicking on "chefs", lists chefs.
GET | /chefs/:id | User Clicking on a specific Chef
GET | /chefs/login | Renders Chef's login page
POST | /chefs/login | logs a chef in, redirects to Chef's homepage 
GET | /chefs/:id/chef-home | Chef's home page.  Also same route that searches API for new recipes in order to render results on same page, but populating below the search bar. 
POST | /chefs/:id/chef-home/recipes/:id/recipes| Chef pinning/adding a recipe from API 
POST | /chefs/:id/chef-home/recipes/:id/cuisines| tagging a recipe with cuisine 
POST | /chefs/:id/chef-home/recipes/:id/comments| commenting on a recipe
POST | /chefs/:id/chef-home/recipes/:id/rating | chef submitting a rating for a recipe 

<!-- POST | /chefs/:id/chef-recipes | Chefs adding their own recipe to the database -->


## Strech Goal Routes:


HTTP VERB | URL | Description 
------------ | ------------------ | -------------
GET | /users/new | renders creating an account for user
POST | /users/new | creates a new user in the DB, redirects to user login page
GET | /users/:id | render user dashboard page
POST | users/:id/recipes/:id | Favorites a recipe to their page (not sure here, don't want to render or redirect, would like to just adjust css to change the color of the pin or something.)
*POST | /chefs/new | instead of automatically adding a chef to the database, create a vetting process where chef's can "apply" to become a chef to the system. The post will simply send an email out for review.  Once reviewed and approved, they will get an email back with an authentication password, or have a username and password generated for them?
GET | chefs/:id/chefs-recipes  | Displays all of a particular Chef's recipes that they have added
POST | chefs/:id/chefs-recipes | Chef adding a new recipe of theirs to their acount



