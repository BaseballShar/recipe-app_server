# Overview
This is the backend of the recipe-app, it uses Node + Express.

# Dependencies
- bcrypt: Encrypts things especially passwords
- cors: Configures Cross Origin Resource Sharing
- jsonwebtoken: Generates tokens for authentication
- mongoose: Provides structure for data via schemas and models and simplifies working with mongoDB

# Project Structure
All server function related code is located under the /src directory

## The src/models directory
It contains models that defines the structure of data (document) and validates data.
- Recipes.js: Holds name, ingredients, ..., and cookingTime. Each recipe is linked to a userOwner
- Users.js Holds username, *hashed* password and an array of savedRecipes

## The src/routes directory
It contains routers that processes requests to each endpoint
- recipes.js: Allows for getting all recipes, posting a newly created recipe, saving a recipe to a user and retrieving saved recipes
- user.js: Allows for account creation, login and authentication.

# Hosting
This backend is hosted locally in port 3001. This port number can be modified in `app.listen` in `src/index.js`

# Quick Start
1. Open your favourite terminal emulator
2. Clone this repo via `git clone https://github.com/BaseballShar/recipe-app_server`
3. Run `yarn` to install dependencies
4. Replace the credential in `src/index.js` with your MongoDB.
5. Use your preferred API tester to verify the server is error-free, e.g. [HTTPIE](https://github.com/httpie/cli)

# Related Resources
The frontend of this server can be found at [BaseballShar/recipe-app_client](https://github.com/BaseballShar/recipe-app_client).

# Credits
This project is inspired by the tutorial [MERN Recipe App With Authentication - PedroTech](https://www.youtube.com/watch?v=P43DW3HUUH8). However, I have made improvements to the code quality and continued developing the application beyond the video.
